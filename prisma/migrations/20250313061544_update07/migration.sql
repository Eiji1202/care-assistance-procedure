/*
  Warnings:

  - Added the required column `city` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefecture` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssistanceProcedure" DROP CONSTRAINT "AssistanceProcedure_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_facilityId_fkey";

-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "prefecture" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "AssistanceProcedure_customerId_idx" ON "AssistanceProcedure"("customerId");

-- CreateIndex
CREATE INDEX "AssistanceProcedure_createdByUserId_idx" ON "AssistanceProcedure"("createdByUserId");

-- CreateIndex
CREATE INDEX "Customer_facilityId_idx" ON "Customer"("facilityId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistanceProcedure" ADD CONSTRAINT "AssistanceProcedure_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
