import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Register {
  StaffName: string;
  Email: string;
  Password: string;
  telephone: string;
}

export async function POST(req: NextRequest) {
  try {
    const { StaffName, Email, Password }: Register = await req.json();
    const hashedPassword = await bcrypt.hash(Password, 10);
    const register = await prisma.admins.create({
      data: {
        Name: StaffName,
        Email,
        Password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Admin registered successfully" });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
