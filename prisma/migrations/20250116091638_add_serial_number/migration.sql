/*
  Warnings:

  - You are about to drop the column `name` on the `Microbit` table. All the data in the column will be lost.
  - Added the required column `serial_number` to the `Microbit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Microbit" DROP COLUMN "name",
ADD COLUMN     "serial_number" TEXT NOT NULL;
