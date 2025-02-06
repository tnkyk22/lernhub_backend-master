import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Faculty {
  name: string;
}

export async function GET() {
  try {
    const faculty = await prisma.faculty.findMany();
    return NextResponse.json(faculty);
  } catch (e) {
    return NextResponse.json({ message: e });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name }: Faculty = await req.json();
    const faculty = await prisma.faculty.create({
      data: {
        Name: name,
      },
    });
    return NextResponse.json(faculty);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}