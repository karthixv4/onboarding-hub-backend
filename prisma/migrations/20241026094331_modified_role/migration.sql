/*
  Warnings:

  - You are about to drop the column `position` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "position" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "position";
