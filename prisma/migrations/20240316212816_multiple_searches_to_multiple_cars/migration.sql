/*
  Warnings:

  - You are about to drop the column `Search` on the `Car` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_Search_fkey";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "Search",
ADD CONSTRAINT "Car_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "_CarToSearch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CarToSearch_AB_unique" ON "_CarToSearch"("A", "B");

-- CreateIndex
CREATE INDEX "_CarToSearch_B_index" ON "_CarToSearch"("B");

-- AddForeignKey
ALTER TABLE "_CarToSearch" ADD CONSTRAINT "_CarToSearch_A_fkey" FOREIGN KEY ("A") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarToSearch" ADD CONSTRAINT "_CarToSearch_B_fkey" FOREIGN KEY ("B") REFERENCES "Search"("id") ON DELETE CASCADE ON UPDATE CASCADE;
