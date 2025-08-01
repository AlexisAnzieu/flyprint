/*
  Warnings:

  - Made the column `has_time` on table `Flybooth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Flybooth" ALTER COLUMN "has_time" SET NOT NULL,
ALTER COLUMN "has_time" SET DEFAULT true,
ALTER COLUMN "logo_height" SET DEFAULT 200,
ALTER COLUMN "logo_width" SET DEFAULT 200;
