/*
  Warnings:

  - You are about to drop the column `description` on the `InitialSetup` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InitialSetup` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `InitialSetup` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resourceId]` on the table `InitialSetup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resourceId` to the `InitialSetup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InitialSetup" DROP CONSTRAINT "InitialSetup_userEmail_fkey";

-- DropIndex
DROP INDEX "InitialSetup_userEmail_key";

-- AlterTable
CREATE SEQUENCE initialsetup_id_seq;
ALTER TABLE "InitialSetup" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "userEmail",
ADD COLUMN     "resourceId" INTEGER NOT NULL,
ADD COLUMN     "setupCompleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" SET DEFAULT nextval('initialsetup_id_seq');
ALTER SEQUENCE initialsetup_id_seq OWNED BY "InitialSetup"."id";

-- CreateTable
CREATE TABLE "InitialSetupTask" (
    "id" SERIAL NOT NULL,
    "initialSetupId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InitialSetupTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InitialSetup_resourceId_key" ON "InitialSetup"("resourceId");

-- AddForeignKey
ALTER TABLE "InitialSetup" ADD CONSTRAINT "InitialSetup_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InitialSetupTask" ADD CONSTRAINT "InitialSetupTask_initialSetupId_fkey" FOREIGN KEY ("initialSetupId") REFERENCES "InitialSetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
