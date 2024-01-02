/*
  Warnings:

  - Added the required column `updatedAt` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `distance` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Car_id_idx";

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL,
DROP COLUMN "distance",
ADD COLUMN     "distance" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Car_id_price_title_idx" ON "Car"("id", "price", "title");
