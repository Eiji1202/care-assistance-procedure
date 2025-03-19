/*
  Warnings:

  - You are about to drop the column `userId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `AssistanceProcedure` table. All the data in the column will be lost.
  - You are about to drop the column `createdByUserId` on the `AssistanceProcedure` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `staffId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdByStaffId` to the `AssistanceProcedure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `AssistanceProcedure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "AssistanceProcedure" DROP CONSTRAINT "AssistanceProcedure_clientId_fkey";

-- DropForeignKey
ALTER TABLE "AssistanceProcedure" DROP CONSTRAINT "AssistanceProcedure_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "userId",
ADD COLUMN     "staffId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AssistanceProcedure" DROP COLUMN "clientId",
DROP COLUMN "createdByUserId",
ADD COLUMN     "createdByStaffId" TEXT NOT NULL,
ADD COLUMN     "customerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "userId",
ADD COLUMN     "staffId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "handicap" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "image" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistanceProcedure" ADD CONSTRAINT "AssistanceProcedure_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistanceProcedure" ADD CONSTRAINT "AssistanceProcedure_createdByStaffId_fkey" FOREIGN KEY ("createdByStaffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
