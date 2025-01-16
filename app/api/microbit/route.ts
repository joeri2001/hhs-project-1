import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { serial_number } = await req.json();

  try {
    let microbit = await prisma.microbit.findUnique({
      where: { serial_number },
    });

    if (!microbit) {
      microbit = await prisma.microbit.create({
        data: { serial_number },
      });
    }

    return NextResponse.json({ microbit });
  } catch (error) {
    console.error('Error processing Microbit:', error);
    return NextResponse.json({ error: 'Error processing Microbit' }, { status: 500 });
  }
}

