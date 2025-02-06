import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Report {
  Id: number;
  Content: string;
  UserId: number;
}

export async function GET(req: NextRequest) {
  try {
    const reports = await prisma.reports.findMany({
      include: {
        User: true,
      },
    });
    return NextResponse.json(reports);
  } catch (e) {
    return NextResponse.json({ message: e });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { Content, UserId }: Report = await req.json();
    const report = await prisma.reports.create({
      data: {
        Content,
        userId: UserId,
      },
    });
    return NextResponse.json(report);
  } catch (e) {
    return NextResponse.json({ message: e });
  } finally {
    await prisma.$disconnect();
  }
}
