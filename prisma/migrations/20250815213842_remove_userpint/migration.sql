/*
  Warnings:

  - You are about to drop the `UserPrintMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPrintMessage" DROP CONSTRAINT "UserPrintMessage_flyboothId_fkey";

-- DropTable
DROP TABLE "UserPrintMessage";
