/*
  Warnings:

  - You are about to drop the `procedureManual` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "procedureManual" DROP CONSTRAINT "procedureManual_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "procedureManual" DROP CONSTRAINT "procedureManual_customerId_fkey";

-- DropTable
DROP TABLE "procedureManual";

-- CreateTable
CREATE TABLE "ProcedureManual" (
    "id" TEXT NOT NULL,
    "assistanceType" TEXT NOT NULL,
    "steps" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,

    CONSTRAINT "ProcedureManual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProcedureManual_customerId_idx" ON "ProcedureManual"("customerId");

-- CreateIndex
CREATE INDEX "ProcedureManual_createdByUserId_idx" ON "ProcedureManual"("createdByUserId");

-- AddForeignKey
ALTER TABLE "ProcedureManual" ADD CONSTRAINT "ProcedureManual_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureManual" ADD CONSTRAINT "ProcedureManual_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
