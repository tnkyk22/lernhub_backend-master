import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import fs from "fs";
// import { writeFile } from "fs/promises";
import path from "path";
import { put, del } from "@vercel/blob";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sheet = await prisma.sheet.findUnique({
      where: { Id: parseInt(params.id) },
      include: {
        CreatedBy: {
          select: {
            Id: true,
            UserName: true,
            Email: true,
          },
        },
        Ratings: {
          select: {
            Score: true,
            User: { select: { Id: true, Email: true } },
          },
        },
        _count: { select: { Ratings: true } },
        Course: true,
        Course_name: true,
      },
    });

    if (!sheet) {
      return NextResponse.json({ message: "Sheet not found" }, { status: 404 });
    }

    return NextResponse.json(sheet);
  } catch (error) {
    console.error("Failed to fetch sheet:", error);
    return NextResponse.json(
      { message: "Failed to fetch sheet", error },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();

    const updateData: any = {};

    if (formData.has("Name")) updateData.Name = formData.get("Name");
    if (formData.has("NoteType"))
      updateData.NoteType = formData.get("NoteType");
    if (formData.has("courseId"))
      updateData.courseId = Number(formData.get("courseId"));
    if (formData.has("course_nameId"))
      updateData.course_nameId = Number(formData.get("course_nameId"));

    // อัปโหลดไฟล์รูปภาพใหม่
    if (formData.has("thumbnail")) {
      const file: File | null = formData.get("thumbnail") as File;
      if (file && file.size > 0) {
        // const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`;
        // const filePath = path.join(process.cwd(), "public/uploads", uniqueFileName);
        // await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        // updateData.Thumbnail = `${uniqueFileName}`;
        if (file) {
          const findImg = await prisma.sheet.findUnique({
            where: {
              Id: parseInt(params.id),
            },
          });
          if (findImg?.Thumbnail) {
            // fs.unlinkSync(`public/uploads/${findImg?.Thumbnail}`);
            await del(findImg?.Thumbnail);
          }
          const { url } = await put(file.name, file, { access: "public" });
          updateData.Thumbnail = url;
        }
      }
    }

    // อัปโหลดไฟล์ชีทใหม่
    if (formData.has("sheet")) {
      const file: File | null = formData.get("sheet") as File;
      if (file && file.size > 0) {
        // const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`;
        // const filePath = path.join(process.cwd(), "public/uploads", uniqueFileName);
        // await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        // updateData.Path = `${uniqueFileName}`;

        if (file) {
          const findSheet = await prisma.sheet.findUnique({
            where: {
              Id: parseInt(params.id),
            },
          });
          if (findSheet?.Path) {
            // fs.unlinkSync(`public/uploads/${findSheet?.Path}`);
            await del(findSheet?.Path);
          }
          const { url } = await put(file.name, file, { access: "public" });
          updateData.Path = url;
        }
      }
    }

    // อัปเดตข้อมูลชีท
    const sheet = await prisma.sheet.update({
      where: { Id: parseInt(params.id) },
      data: updateData,
    });

    return NextResponse.json(sheet);
  } catch (error) {
    console.error("Failed to update sheet:", error);
    return NextResponse.json(
      { message: "Failed to update sheet", error },
      { status: 500 }
    );
  }
}

// 📌 DELETE: ลบชีท
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sheetId = parseInt(params.id, 10);
    if (isNaN(sheetId)) throw new Error("Invalid sheet ID");

    // เช็คว่ามี sheet อยู่จริง
    const sheet = await prisma.sheet.findUnique({ where: { Id: sheetId } });
    if (!sheet) throw new Error("Sheet not found");

    // ลบ ratings ที่เกี่ยวข้องกับ sheet นี้ก่อน
    await prisma.rating.deleteMany({
      where: { sheetId: sheetId },
    });

    // ลบ reports ที่เกี่ยวข้อง
    prisma.reports.deleteMany({
      where: { sheetId: sheetId },
    }),
      // จากนั้นค่อยลบ sheet
      await prisma.sheet.delete({ where: { Id: sheetId } });

    return NextResponse.json({ message: "Sheet deleted successfully" });
  } catch (error) {
    console.error("Error deleting sheet:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
