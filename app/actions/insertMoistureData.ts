"use server";

import { sql } from "@vercel/postgres";

export async function insertMoistureData(averageMoisture: number) {
  try {
    await sql`INSERT INTO moisture (value, timestamp) VALUES (${averageMoisture}, NOW())`;
    console.log("Successfully inserted new moisture data");
  } catch (error) {
    console.error("Error inserting moisture data:", error);
  }
}
