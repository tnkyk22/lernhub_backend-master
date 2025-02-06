import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { Email, Password } = await req.json();

  const user = await prisma.users.findUnique({
    where: {
      Email: Email,
    },
  });

  if (!user || !(await bcrypt.compare(Password, user.Password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      userId: user.Id,
      Email: user.Email,
      UserName: user.UserName,
      Role: "User",
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return NextResponse.json(
    {
      token,
      user: {
        Id: user.Id,
        UserName: user.UserName,
        Email: user.Email,
        Role: "User",
      },
    },
    { status: 200 }
  );
}
