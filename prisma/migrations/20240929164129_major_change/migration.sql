/*
  Warnings:

  - You are about to drop the column `plan` on the `KTPlan` table. All the data in the column will be lost.
  - Changed the type of `progress` on the `KTPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProgressEnum" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "KTPlan" DROP COLUMN "plan",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
DROP COLUMN "progress",
ADD COLUMN     "progress" "ProgressEnum" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "managerId" INTEGER;

-- CreateTable
CREATE TABLE "ActionItem" (
    "id" SERIAL NOT NULL,
    "ktPlanId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ActionItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_ktPlanId_fkey" FOREIGN KEY ("ktPlanId") REFERENCES "KTPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
