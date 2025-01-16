'use server'

import { sql } from '@vercel/postgres';

export async function getMoistureData() {
  try {
    const { rows } = await sql`SELECT * FROM moisture ORDER BY timestamp DESC`;
    return rows;
  } catch (error) {
    console.error('Error fetching moisture data:', error);
    return [];
  }
}
