-- CreateTable
CREATE TABLE "Microbit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Microbit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Moisture" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "microbitId" INTEGER NOT NULL,

    CONSTRAINT "Moisture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Moisture" ADD CONSTRAINT "Moisture_microbitId_fkey" FOREIGN KEY ("microbitId") REFERENCES "Microbit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
