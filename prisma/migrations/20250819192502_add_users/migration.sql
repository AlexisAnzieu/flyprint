/*
  Warnings:

  - You are about to drop the column `userId` on the `Flybooth` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Flybooth" DROP CONSTRAINT "Flybooth_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Flybooth" DROP COLUMN "userId",
ADD COLUMN     "teamId" TEXT;

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_TeamToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_FlyboothToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FlyboothToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "public"."_TeamToUser"("B");

-- CreateIndex
CREATE INDEX "_FlyboothToUser_B_index" ON "public"."_FlyboothToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."Flybooth" ADD CONSTRAINT "Flybooth_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeamToUser" ADD CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FlyboothToUser" ADD CONSTRAINT "_FlyboothToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Flybooth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FlyboothToUser" ADD CONSTRAINT "_FlyboothToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
