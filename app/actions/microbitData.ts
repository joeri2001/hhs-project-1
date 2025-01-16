"use server";

import { sql } from "@vercel/postgres";

async function ensureMoistureTableExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS Moisture (
        id SERIAL PRIMARY KEY,
        serial_number VARCHAR(255) NOT NULL,
        value FLOAT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Moisture table created or already exists");
  } catch (error) {
    console.error("Error creating Moisture table:", error);
  }
}

export async function getMicrobitData(serialNumber: string) {
  await ensureMoistureTableExists();
  try {
    const { rows } = await sql`
      SELECT * FROM Moisture 
      WHERE serial_number = ${serialNumber} 
      ORDER BY timestamp DESC
    `;
    return rows;
  } catch (error) {
    console.error("Error fetching micro:bit data:", error);
    return [];
  }
}

export async function insertMicrobitData(
  serialNumber: string,
  moisture: number
) {
  await ensureMoistureTableExists();
  try {
    await sql`
      INSERT INTO Moisture (serial_number, value, timestamp) 
      VALUES (${serialNumber}, ${moisture}, NOW())
    `;
    console.log("Successfully inserted new micro:bit data");
  } catch (error) {
    console.error("Error inserting micro:bit data:", error);
  }
}

export async function checkMicrobitExists(serialNumber: string) {
  try {
    const { rows } = await sql`
        SELECT EXISTS(SELECT 1 FROM Moisture WHERE serial_number = ${serialNumber})
      `;
    return rows[0].exists;
  } catch (error) {
    console.error("Error checking micro:bit existence:", error);
    return false;
  }
}

export async function insertMicrobitIfNotExists(serialNumber: string) {
  try {
    const exists = await checkMicrobitExists(serialNumber);
    if (!exists) {
      await sql`
          INSERT INTO Moisture (serial_number, value, timestamp)
          VALUES (${serialNumber}, 0, NOW())
        `;
      console.log(
        `New micro:bit entry created for serial number: ${serialNumber}`
      );
    }
  } catch (error) {
    console.error("Error inserting new micro:bit entry:", error);
  }
}
