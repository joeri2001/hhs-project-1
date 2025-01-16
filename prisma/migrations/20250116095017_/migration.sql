/*
  Warnings:

  - A unique constraint covering the columns `[serial_number]` on the table `Microbit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Microbit_serial_number_key" ON "Microbit"("serial_number");
