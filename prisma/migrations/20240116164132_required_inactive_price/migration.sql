/*
  Warnings:

  - Made the column `inactivePrice` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "inactivePrice" SET NOT NULL;
