import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const admins = await prisma.admins.findMany();
        return NextResponse.json(admins);
    }
    catch (e) {
        return NextResponse.json({ message: e });
    }
}