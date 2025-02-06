import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

interface Report {
  Id: number;
  Content: string;
  UserId: number;
}
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.reports.findUnique({
      where: {
        Id: parseInt(params.id),
      },
      include: {
        User: true,
      },
    });
    return NextResponse.json(report);
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { Content }: Report = await req.json();
    const report = await prisma.reports.update({
      where: {
        Id: parseInt(params.id),
      },
      data: {
        Content,
      },
    });
    return NextResponse.json(report);
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.reports.delete({
      where: {
        Id: parseInt(params.id),
      },
    });
    return NextResponse.json(report);
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
