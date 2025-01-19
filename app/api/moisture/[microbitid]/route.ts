import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { microbitId: string } }
) {
  try {
    const microbitId = parseInt(params.microbitId, 10);

    if (isNaN(microbitId)) {
      return NextResponse.json(
        { error: "Invalid microbit ID" },
        { status: 400 }
      );
    }

    const moistureReadings = await prisma.moisture.findMany({
      where: {
        microbitId: microbitId,
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
      { error: "Error fetching moisture readings" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
