/*
  Warnings:

  - You are about to drop the column `assistanceType` on the `ProcedureManual` table. All the data in the column will be lost.
  - Added the required column `Title` to the `ProcedureManual` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProcedureManual" DROP COLUMN "assistanceType",
ADD COLUMN     "Title" TEXT NOT NULL;
