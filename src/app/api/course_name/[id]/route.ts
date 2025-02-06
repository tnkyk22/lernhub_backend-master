import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const courseName = await prisma.course_name.findUnique({
            where: {
                Id: parseInt(params.id),
            },
        });

        if (!courseName) {
            return NextResponse.json({ message: "Course name not found" }, { status: 404 });
        }

        return NextResponse.json(courseName);
    } catch (e) {
        return NextResponse.json({ message: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { name } = await request.json();

        const courseName = await prisma.course_name.update({
            where: {
                Id: parseInt(params.id),
            },
            data: {
                Name: name,
            },
        });

        return NextResponse.json(courseName);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const deletedCourseName = await prisma.course_name.delete({
            where: {
                Id: parseInt(params.id),
            },
        });

        return NextResponse.json({ message: "Deleted successfully", deletedCourseName });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
