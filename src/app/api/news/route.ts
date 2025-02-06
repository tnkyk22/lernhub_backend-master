import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { UploadThumbnail } from "../upload_handle/upload";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const news = await prisma.news.findMany();
    return NextResponse.json(news);
  } catch (e) {
    return NextResponse.json({ message: e });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;
    if (!file) {
      throw new Error("No file uploaded.");
    }
    const { filePath, fileName } = await UploadThumbnail(file);
    const NewsTitle = formData.get("NewsTitle") as string;
    const NewsContent = formData.get("NewsContent") as string;
    const news = await prisma.news.create({
      data: {
        NewsTitle,
        NewsContent,
        Thumbnail: fileName,

      },
    });
    return NextResponse.json(news);
  } catch (e) {
    return NextResponse.json({ message: e });
  }
}
