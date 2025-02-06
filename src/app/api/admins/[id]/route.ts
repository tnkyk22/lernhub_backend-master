import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(params: { id: string }, req: NextRequest) {
    try {
        const admins = await prisma.admins.findUnique({
            where: {
                Id: parseInt(params.id)
            }
        });
        return NextResponse.json(admins);
    }
    catch (e) {
        return NextResponse.json({ message: e });
    }
}

