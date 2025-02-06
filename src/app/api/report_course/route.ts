import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        Sheet: {
          select: {
            Id: true,
          },
        },
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
