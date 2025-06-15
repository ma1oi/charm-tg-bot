/*
  Warnings:

  - You are about to drop the column `artistId` on the `PromocodeUsage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Promocode` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `PromocodeUsage` DROP COLUMN `artistId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
