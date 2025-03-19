/*
  Warnings:

  - You are about to drop the `_FacilityToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FacilityToUser" DROP CONSTRAINT "_FacilityToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FacilityToUser" DROP CONSTRAINT "_FacilityToUser_B_fkey";

-- DropTable
DROP TABLE "_FacilityToUser";
