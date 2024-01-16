/*
  Warnings:

  - You are about to alter the column `url` on the `Search` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5000)`.

*/
-- AlterTable
ALTER TABLE "Search" ALTER COLUMN "url" SET DATA TYPE VARCHAR(5000);
