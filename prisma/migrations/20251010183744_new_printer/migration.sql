-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ONLINE', 'OFFLINE', 'ERROR');

-- CreateTable
CREATE TABLE "public"."Printer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'OFFLINE',
    "remainingPrints" INTEGER NOT NULL DEFAULT 500,

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Printer_ipAddress_key" ON "public"."Printer"("ipAddress");
