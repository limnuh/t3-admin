/*
  Warnings:

  - You are about to drop the `_CarToSearch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CarToSearch" DROP CONSTRAINT "_CarToSearch_A_fkey";

-- DropForeignKey
ALTER TABLE "_CarToSearch" DROP CONSTRAINT "_CarToSearch_B_fkey";

-- DropTable
DROP TABLE "_CarToSearch";

-- CreateTable
CREATE TABLE "_Search_to_Car" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Search_to_Car_AB_unique" ON "_Search_to_Car"("A", "B");

-- CreateIndex
CREATE INDEX "_Search_to_Car_B_index" ON "_Search_to_Car"("B");

-- AddForeignKey
ALTER TABLE "_Search_to_Car" ADD CONSTRAINT "_Search_to_Car_A_fkey" FOREIGN KEY ("A") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Search_to_Car" ADD CONSTRAINT "_Search_to_Car_B_fkey" FOREIGN KEY ("B") REFERENCES "Search"("id") ON DELETE CASCADE ON UPDATE CASCADE;
