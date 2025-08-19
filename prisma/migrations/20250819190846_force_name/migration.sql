/*
  Warnings:

  - Made the column `name` on table `Flybooth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Flybooth" ALTER COLUMN "name" SET NOT NULL;
