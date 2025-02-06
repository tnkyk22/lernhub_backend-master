import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Course {
  Name: string;
  courseId: number;
}

export async function GET() {
  try {
    const courses = await prisma.course_name.findMany();
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { Name, courseId }: Course = await req.json();
    const course = await prisma.course_name.create({
      data: { Name, courseId },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
