import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { Email, Password } = await req.json();

    const admins = await prisma.admins.findUnique({
        where: {
            Email: Email
        }
    });

    if (!admins || !await bcrypt.compare(Password, admins.Password)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({
        StaffId: admins.Id,
        Email: admins.Email,
    }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

    return NextResponse.json({ token });
}
