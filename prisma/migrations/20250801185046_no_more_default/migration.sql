/*
  Warnings:

  - Made the column `logo_height` on table `Flybooth` required. This step will fail if there are existing NULL values in that column.
  - Made the column `logo_width` on table `Flybooth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Flybooth" ALTER COLUMN "logo_height" SET NOT NULL,
ALTER COLUMN "logo_width" SET NOT NULL;
