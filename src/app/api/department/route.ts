import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Department {
  Name: string;
  facultyId: number;
}
export async function GET() {
  try {
    const department = await prisma.department.findMany({});
    return NextResponse.json(department);
  } catch (e) {
    return NextResponse.json({ message: e });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { Name, facultyId }: Department = await req.json();
    const department = await prisma.department.create({
      data: {
        Name,
        facultyId
      },
    });
    return NextResponse.json(department);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
