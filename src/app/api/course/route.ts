import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all courses
export async function GET() {
    try {
        const courses = await prisma.course.findMany();
        return NextResponse.json(courses);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}

// Create a new course
export async function POST(req: NextRequest) {
    try {
        const { Course_Id } = await req.json();
        const newCourse = await prisma.course.create({
            data: {
                Course_Id
            },
        });

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 400 }
        );
    }
}
