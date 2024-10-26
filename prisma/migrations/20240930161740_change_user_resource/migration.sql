/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Resource_userId_key" ON "Resource"("userId");
