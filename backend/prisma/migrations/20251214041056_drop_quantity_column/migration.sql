/*
  Warnings:

  - You are about to drop the column `quantity` on the `Sweet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sweet" DROP COLUMN "quantity",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "stockKg" DROP DEFAULT;
