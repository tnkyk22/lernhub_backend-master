import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { UploadThumbnail } from "@/app/api/upload_handle/upload";
import * as fs from "fs";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: {
        Id: parseInt(params.id),
      },
    });
    return NextResponse.json(news);
  } catch (e) {
    return NextResponse.json({ message: e });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();
    const newimg = formData.get("thumbnail") as File | null;
    const NewsTitle = formData.get("NewsTitle") as string;
    const NewsContent = formData.get("NewsContent") as string;

    if (newimg) {
      const findImg = await prisma.news.findUnique({
        where: {
          Id: parseInt(params.id),
        },
      });
      if (findImg?.Thumbnail) {
        fs.unlinkSync(`public/uploads/${findImg?.Thumbnail}`);
      }
      const { filePath, fileName } = await UploadThumbnail(newimg);
      const updatedNews = await prisma.news.update({
        where: {
          Id: parseInt(params.id),
        },
        data: {
          NewsTitle,
          NewsContent,
          Thumbnail: fileName,
        },
      });
    }
    const updatedNews = await prisma.news.update({
      where: {
        Id: parseInt(params.id),
      },
      data: {
        NewsTitle,
        NewsContent,
      },
    });

    return NextResponse.json(updatedNews);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const findImg = await prisma.news.findUnique({
      where: {
        Id: parseInt(params.id),
      },
    });
    if (findImg?.Thumbnail) {
      fs.unlinkSync(`public/uploads/${findImg?.Thumbnail}`);
    }
    const news = await prisma.news.delete({
      where: {
        Id: parseInt(params.id),
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
