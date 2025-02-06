import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET; // Make sure to set your JWT secret in environment variables

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Token missing" }, { status: 401 });
    }

    let decoded;
    try {
      if (!secret) {
        return NextResponse.json({ message: "JWT secret not set" }, { status: 500 });
      }
      decoded = jwt.verify(token, secret);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    console.log("Decoded token:", decoded);
    
    const userId = (decoded as jwt.JwtPayload).userId;
    const user = await prisma.users.findUnique({
      where: { Id: userId },
      include: {
        Faculty: true,
        Department: true,
        _count: {
          select: { Sheet: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
