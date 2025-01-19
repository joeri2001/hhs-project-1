import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serialNumber = searchParams.get("serialNumber");

  if (!serialNumber) {
    return NextResponse.json(
      { error: "Serial number is required" },
      { status: 400 }
    );
  }

  try {
    const microbit = await prisma.microbit.findUnique({
      where: { serial_number: serialNumber },
    });

    if (!microbit) {
      return NextResponse.json(
        { error: "Microbit not found" },
        { status: 404 }
      );
    }

    const moistureReadings = await prisma.moisture.findMany({
      where: {
        microbitId: microbit.id,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 24,
    });

    return NextResponse.json({ moistureReadings });
  } catch (error) {
    console.error("Error fetching moisture readings:", error);
    return NextResponse.json(
      { error: "Failed to fetch moisture readings" },
      { status: 500 }
    );
  }
}
