/*
  Warnings:

  - Made the column `nameProduct` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `nameProduct` VARCHAR(191) NOT NULL;
