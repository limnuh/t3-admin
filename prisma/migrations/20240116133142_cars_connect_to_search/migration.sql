/*
  Warnings:

  - Added the required column `Search` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "Search" CHAR(30) NOT NULL;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_Search_fkey" FOREIGN KEY ("Search") REFERENCES "Search"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
