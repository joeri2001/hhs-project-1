import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { microbit_id, average_moisture } = await req.json();

    if (!microbit_id || average_moisture === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const moisture = await prisma.moisture.create({
      data: {
        value: average_moisture,
        microbitId: microbit_id,
      },
    });

    return NextResponse.json({ moisture });
  } catch (error) {
    console.error("Error storing moisture:", error);
    return NextResponse.json(
      { error: "Error storing moisture" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
