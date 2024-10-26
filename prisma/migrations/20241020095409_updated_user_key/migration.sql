/*
  Warnings:

  - You are about to drop the column `userId` on the `Resource` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_userId_fkey";

-- DropIndex
DROP INDEX "Resource_userId_key";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Resource_userEmail_key" ON "Resource"("userEmail");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
