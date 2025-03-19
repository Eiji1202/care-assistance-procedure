/*
  Warnings:

  - You are about to drop the column `createdByUserId` on the `ProcedureManual` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProcedureManual" DROP CONSTRAINT "ProcedureManual_createdByUserId_fkey";

-- DropIndex
DROP INDEX "ProcedureManual_createdByUserId_idx";

-- AlterTable
ALTER TABLE "ProcedureManual" DROP COLUMN "createdByUserId";
