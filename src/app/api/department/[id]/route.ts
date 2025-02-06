import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const department = await prisma.department.findUnique({
            where: {
                Id: parseInt(params.id),
            },
        });
        return NextResponse.json(department);
    } catch (e) {
        return NextResponse.json({ message: e });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        console.log("🟢 Request Body:", body);
        console.log("🟢 Params ID:", params.id);

        if (!body.name) {
            return NextResponse.json({ error: "ชื่อไม่สามารถเป็นค่าว่างได้" }, { status: 400 });
        }

        const department = await prisma.department.update({
            where: {
                Id: parseInt(params.id),
            },
            data: {
                Name: body.name,
            },
        });

        console.log("✅ Updated Department:", department);
        return NextResponse.json(department);
    } catch (error) {
        console.error("❌ Update Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const department  = await prisma.department.delete({
            where: {
                Id: parseInt(params.id),
            },
        });
        return NextResponse.json(department);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}