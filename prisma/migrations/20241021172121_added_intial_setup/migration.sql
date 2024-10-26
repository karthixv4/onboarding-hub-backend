-- CreateTable
CREATE TABLE "InitialSetup" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "InitialSetup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InitialSetup_userEmail_key" ON "InitialSetup"("userEmail");

-- AddForeignKey
ALTER TABLE "InitialSetup" ADD CONSTRAINT "InitialSetup_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
