import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        // รับ query parameters
        const { searchParams } = new URL(req.url);
        const sheetId = searchParams.get("sheetId");
        const userId = searchParams.get("userId");

        // ค้นหาข้อมูล Reports ตาม sheetId หรือ userId (ถ้ามี)
        const reports = await prisma.reports.findMany({
            where: {
                ...(sheetId ? { sheetId: Number(sheetId) } : {}),
                ...(userId ? { userId: Number(userId) } : {}),
            },
            include: {
                User: true,  // ดึงข้อมูลของผู้ใช้ที่รายงาน
                Sheet: { select: { Name: true } }, // ดึงข้อมูลของเอกสารที่ถูกรายงาน
            },
            orderBy: {
                ReportDate: "desc", // เรียงลำดับจากใหม่ไปเก่า
            },
        });

        return NextResponse.json(reports);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}


