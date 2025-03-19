/*
  Warnings:

  - You are about to drop the column `staffId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `createdByStaffId` on the `AssistanceProcedure` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdByUserId` to the `AssistanceProcedure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_staffId_fkey";

-- DropForeignKey
ALTER TABLE "AssistanceProcedure" DROP CONSTRAINT "AssistanceProcedure_createdByStaffId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_staffId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "staffId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AssistanceProcedure" DROP COLUMN "createdByStaffId",
ADD COLUMN     "createdByUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "staffId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Staff";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistanceProcedure" ADD CONSTRAINT "AssistanceProcedure_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
