import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface Register {
    Email: string;
    UserName: string;
    Password: string;
    facultyId: number;
    departmentId: number;
}

export async function POST(req: NextRequest) {
    try {
        const { Email, UserName, Password, facultyId, departmentId }: Register = await req.json();
        const hashedPassword = await bcrypt.hash(Password, 10);
        const register = await prisma.users.create({
            data: {
                Email,
                UserName,
                Password: hashedPassword,
                facultyId,
                departmentId
            },
        });

        return NextResponse.json({ message: "User registered successfully" });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
