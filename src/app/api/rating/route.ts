import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        // รับ query parameters
        const { searchParams } = new URL(req.url);
        const sheetId = searchParams.get("sheetId");
        const userId = searchParams.get("userId");

        // ค้นหาข้อมูล Rating ตาม sheetId หรือ userId (ถ้ามี)
        const ratings = await prisma.rating.findMany({
            where: {
                ...(sheetId ? { sheetId: Number(sheetId) } : {}),
                ...(userId ? { userId: Number(userId) } : {}),
            },
            include: {
                User: true,  // ดึงข้อมูลของผู้ใช้ที่ให้คะแนน
                Sheet: true, // ดึงข้อมูลของเอกสารที่ถูกให้คะแนน
            },
            orderBy: {
                Id: "desc", // เรียงลำดับจากล่าสุดไปเก่าสุด
            },
        });

        return NextResponse.json(ratings);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
