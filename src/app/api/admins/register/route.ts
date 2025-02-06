import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface Register {
    StaffName: string;
    Email: string;
    Password: string;
    telephone: string;
}

export async function POST(req: NextRequest) {
    try {
        const { StaffName, Email, Password, telephone }: Register = await req.json();
        const hashedPassword = await bcrypt.hash(Password, 10);
        const register = await prisma.admins.create({
            data: {
                StaffName,
                Email,
                Password: hashedPassword,
                telephone,
            },
        });

        return NextResponse.json({ message: "Admin registered successfully" });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
