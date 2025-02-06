import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const admins = await prisma.admins.findUnique({
      where: {
        Id: parseInt(id || "0"),
      },
    });
    return NextResponse.json(admins);
  } catch (e) {
    return NextResponse.json({ message: "Failed to fetch admins", error: e });
  }
}
