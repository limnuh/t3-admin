/*
  Warnings:

  - Added the required column `km` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SearchStatus" AS ENUM ('NEW', 'RUN', 'END');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "history" JSONB,
ADD COLUMN     "km" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Search" ADD COLUMN     "status" "SearchStatus" NOT NULL DEFAULT 'NEW';

-- CreateTable
CREATE TABLE "AgregatedSearchData" (
    "id" TEXT NOT NULL,
    "Search" CHAR(30) NOT NULL,
    "count" INTEGER NOT NULL,
    "pricePercentiles" INTEGER[],
    "yearPercentiles" INTEGER[],
    "kmPercentiles" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgregatedSearchData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AgregatedSearchData" ADD CONSTRAINT "AgregatedSearchData_Search_fkey" FOREIGN KEY ("Search") REFERENCES "Search"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
