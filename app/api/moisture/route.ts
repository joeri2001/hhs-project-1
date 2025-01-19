import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { serial_number, average_moisture } = await request.json();

    if (!serial_number || average_moisture === undefined) {
      return NextResponse.json(
        { error: "Serial number and average moisture are required" },
        { status: 400 }
      );
    }

    const microbit = await prisma.microbit.findUnique({
      where: { serial_number: serial_number },
    });

    if (!microbit) {
      return NextResponse.json(
        { error: "Microbit not found" },
        { status: 404 }
      );
    }

    const moisture = await prisma.moisture.create({
      data: {
        value: average_moisture,
        microbitId: microbit.id,
      },
    });

    return NextResponse.json({ moisture });
  } catch (error) {
    console.error("Error saving moisture data:", error);
    return NextResponse.json(
      { error: "Failed to save moisture data" },
      { status: 500 }
    );
  }
}
