/*
  Warnings:

  - You are about to drop the `Text` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Flybooth` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Flybooth" DROP CONSTRAINT "Flybooth_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Text" DROP CONSTRAINT "Text_flyboothId_fkey";

-- AlterTable
ALTER TABLE "public"."Flybooth" ADD COLUMN     "texts" TEXT[],
ALTER COLUMN "userId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Text";

-- AddForeignKey
ALTER TABLE "public"."Flybooth" ADD CONSTRAINT "Flybooth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
