import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { sheetId: string } }) {
    try {
        const { sheetId } = params;
        const { Content, userId } = await req.json();

        // ตรวจสอบค่าที่ส่งมา
        if (!sheetId || !userId || !Content) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        const numericSheetId = parseInt(sheetId, 10);
        if (isNaN(numericSheetId)) {
            return NextResponse.json({ error: "Invalid sheetId" }, { status: 400 });
        }

        // บันทึกข้อมูลลงใน Reports
        const report = await prisma.reports.create({
            data: {
                Content,
                userId,
                sheetId: numericSheetId,
            },
        });

        return NextResponse.json({ message: "Report submitted successfully", report });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}


