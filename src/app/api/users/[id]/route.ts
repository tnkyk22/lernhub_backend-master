import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        Id: parseInt(params.id),
      },
      include: {
        Faculty: true,
        Department: true,
        _count: {
          select: { Sheet: true },
        },
      },
    });
    return NextResponse.json({
      user,
    });
  } catch (e) {
    return NextResponse.json({ message: e });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json(); // Parse the request body
    let hashedPassword = null;
    if (body.Password) {
      hashedPassword = await bcrypt.hash(body.Password, 10);
    }
    const updatedUser = await prisma.users.update({
      where: {
        Id: parseInt(params.id),
      },
      data: {
        UserName: body.UserName,
        Email: body.Email,
        Password: hashedPassword ? hashedPassword : undefined,
      },
    });

    return NextResponse.json({
      message: "อัปเดตข้อมูลผู้ใช้สำเร็จ",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    // เช็คว่ามีผู้ใช้อยู่จริง
    const user = await prisma.users.findUnique({
      where: { Id: userId },
      include: {
        _count: {
          select: {
            Sheet: true,
            Ratings: true, // เพิ่มการเช็ค Ratings
          },
        },
      },
    });

    // ลบข้อมูลที่เกี่ยวข้องทั้งหมดในลำดับที่ถูกต้อง
    await prisma.$transaction([
      // ลบ ratings ที่เกี่ยวข้อง
      prisma.rating.deleteMany({
        where: { userId: userId },
      }),

      prisma.reports.deleteMany({
        where: { userId: userId },
      }),
      // ลบ user
      prisma.users.delete({
        where: { Id: userId },
      }),
    ]);

    return NextResponse.json({
      message: "ลบผู้ใช้เรียบร้อยแล้ว",
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
