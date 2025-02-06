import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { sheetId: string } }
) {
  try {
    const { sheetId } = params;
    const { Score, userId } = await req.json();

    if (!sheetId || !userId || !Score) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const numericSheetId = parseInt(sheetId, 10);
    if (isNaN(numericSheetId)) {
      return NextResponse.json({ error: "Invalid sheetId" }, { status: 400 });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_sheetId: {
          userId: +userId,
          sheetId: numericSheetId,
        },
      },
    });

    let rating;
    if (existingRating) {
      rating = await prisma.rating.update({
        where: {
          userId_sheetId: {
            userId: +userId,
            sheetId: numericSheetId,
          },
        },
        data: { Score },
      });
    } else {
      rating = await prisma.rating.create({
        data: {
          Score,
          userId: +userId,
          sheetId: numericSheetId,
        },
      });
    }

    return NextResponse.json({
      message: "Rating added/updated successfully",
      rating,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
