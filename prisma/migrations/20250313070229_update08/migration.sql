/*
  Warnings:

  - You are about to drop the `AssistanceProcedure` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssistanceProcedure" DROP CONSTRAINT "AssistanceProcedure_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "AssistanceProcedure" DROP CONSTRAINT "AssistanceProcedure_customerId_fkey";

-- DropTable
DROP TABLE "AssistanceProcedure";

-- CreateTable
CREATE TABLE "procedureManual" (
    "id" TEXT NOT NULL,
    "assistanceType" TEXT NOT NULL,
    "steps" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,

    CONSTRAINT "procedureManual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "procedureManual_customerId_idx" ON "procedureManual"("customerId");

-- CreateIndex
CREATE INDEX "procedureManual_createdByUserId_idx" ON "procedureManual"("createdByUserId");

-- AddForeignKey
ALTER TABLE "procedureManual" ADD CONSTRAINT "procedureManual_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedureManual" ADD CONSTRAINT "procedureManual_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
