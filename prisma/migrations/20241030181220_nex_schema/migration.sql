/*
  Warnings:

  - You are about to drop the column `authorId` on the `Text` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Text" DROP CONSTRAINT "Text_authorId_fkey";

-- AlterTable
ALTER TABLE "Text" DROP COLUMN "authorId",
ADD COLUMN     "flyboothId" TEXT;

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_flyboothId_fkey" FOREIGN KEY ("flyboothId") REFERENCES "Flybooth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
