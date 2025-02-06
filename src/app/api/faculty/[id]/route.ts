import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const faculty = await prisma.faculty.findUnique({
            where: {
                Id: parseInt(params.id),
            },
        });
        return NextResponse.json(faculty);
    } catch (e) {
        return NextResponse.json({ message: e });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { name } = await request.json();
        const faculty = await prisma.faculty.update({
            where: {
                Id: parseInt(params.id),
            },
            data: {
                Name: name,
            },
        });
        return NextResponse.json(faculty);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // ตรวจสอบว่ามี department ที่เกี่ยวข้องกับ faculty หรือไม่
        const facultyWithDepartments = await prisma.faculty.findUnique({
            where: {
                Id: parseInt(params.id),
            },
            include: {
                Department: true, // รวมข้อมูล department ที่เกี่ยวข้อง
            },
        });

        // ถ้ามี department ที่เกี่ยวข้อง จะไม่อนุญาตให้ลบ
        if (facultyWithDepartments && facultyWithDepartments.Department.length > 0) {
            return NextResponse.json({ error: "ไม่สามารถลบคณะได้ เนื่องจากมีสาขาที่เกี่ยวข้อง" }, { status: 400 });
        }

        // ถ้าไม่มี department ที่เกี่ยวข้อง ให้ทำการลบ faculty
        const faculty = await prisma.faculty.delete({
            where: {
                Id: parseInt(params.id),
            },
        });
        return NextResponse.json(faculty);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}