/*
  Warnings:

  - You are about to alter the column `tuid` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `tuid` BIGINT NOT NULL;
