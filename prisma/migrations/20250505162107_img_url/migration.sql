/*
  Warnings:

  - Added the required column `imgUrl` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Artist` ADD COLUMN `imgUrl` VARCHAR(191) NOT NULL;
