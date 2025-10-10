/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `Printer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Printer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Printer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Printer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Printer_ipAddress_key";

-- AlterTable
ALTER TABLE "public"."Flybooth" ADD COLUMN     "printerId" TEXT;

-- AlterTable
ALTER TABLE "public"."Printer" DROP COLUMN "ipAddress",
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Printer_name_key" ON "public"."Printer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_url_key" ON "public"."Printer"("url");

-- AddForeignKey
ALTER TABLE "public"."Flybooth" ADD CONSTRAINT "Flybooth_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "public"."Printer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
