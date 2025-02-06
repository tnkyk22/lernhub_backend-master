import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const course = await prisma.course.findUnique({
            where: {
                Id: parseInt(params.id),
            },
        });
        return NextResponse.json(course);
    } catch (e) {
        return NextResponse.json({ message: e });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { Course_Id } = await request.json();
        const course = await prisma.course.update({
            where: {
                Id: parseInt(params.id),
            },
            data: {
                Course_Id
            },
        });
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // ตรวจสอบว่ามี Sheet หรือ Course_name ที่เกี่ยวข้องกับ Course หรือไม่
        const courseWithRelations = await prisma.course.findUnique({
            where: {
                Id: parseInt(params.id),
            },
            include: {  
                Course_name: true,  // รวมข้อมูล Course_name ที่เกี่ยวข้อง
            },
        });

        // ถ้ามี Sheet หรือ Course_name ที่เกี่ยวข้อง จะไม่อนุญาตให้ลบ
        if (courseWithRelations && courseWithRelations.Course_name.length > 0) {
            return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลบรหัสวิชา เนื่องจากมีชื่อวิชาที่เกี่ยวข้อง" }, { status: 400 });
        }

        // ถ้าไม่มีข้อมูลที่เกี่ยวข้อง ให้ทำการลบ Course
        const course = await prisma.course.delete({
            where: {
                Id: parseInt(params.id),
            },
        });
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}