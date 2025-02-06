import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, NoteType } from "@prisma/client";
import { upload } from "../upload_handle/upload";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sheets = await prisma.sheet.findMany({
      include: {
        CreatedBy: {
          select: {
            Id: true,
            UserName: true,
          },
        },
        Ratings: true,
        Course: {
          select: {
            Id: true,
            Course_Id: true,
          },
        },
        Course_name: {
          select: {
            Id: true,
            Name: true,
          },
        },
      },
      orderBy: {
        CreatedAt: "desc",
      },
    });

    return NextResponse.json(sheets);
  } catch (error) {
    console.error("❌ Failed to fetch sheets:", error);
    return NextResponse.json(
      { message: "Failed to fetch sheets", error: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("sheet") as File | null;
    if (!file) throw new Error("No file uploaded.");

    const thumbnail = formData.get("thumbnail") as File | null;
    if (!thumbnail) throw new Error("No thumbnail uploaded.");

    // อัปโหลดไฟล์
    const { filePath, fileName } = await upload(file);
    const { filePath: thumbnailPath, fileName: thumbnailName } = await upload(
      thumbnail
    );

    // รับค่าจากฟอร์ม
    const Name = formData.get("Name") as string;
    const NoteType = formData.get("NoteType") as NoteType;
    const CreatedById = parseInt(formData.get("CreatedById") as string, 10);
    const courseId = formData.get("courseId")
      ? parseInt(formData.get("courseId") as string, 10)
      : null;
    const course_nameId = formData.get("course_nameId")
      ? parseInt(formData.get("course_nameId") as string, 10)
      : null;

    // บันทึกข้อมูลลงฐานข้อมูล
    const sheet = await prisma.sheet.create({
      data: {
        Name,
        Path: fileName,
        Thumbnail: thumbnailName,
        NoteType,
        CreatedById,
        courseId,
        course_nameId,
      },
    });

    return NextResponse.json({
      message: {
        data: sheet,
        file: "File uploaded successfully.",
        filePath,
      },
    });
  } catch (error) {
    console.error("Error creating sheet:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
