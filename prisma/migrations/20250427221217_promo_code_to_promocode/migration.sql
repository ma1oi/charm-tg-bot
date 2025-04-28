/*
  Warnings:

  - You are about to drop the column `promoCodeId` on the `PromoCodeUsage` table. All the data in the column will be lost.
  - Added the required column `promocodeId` to the `PromoCodeUsage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `PromoCodeUsage` DROP FOREIGN KEY `PromoCodeUsage_promoCodeId_fkey`;

-- DropIndex
DROP INDEX `PromoCodeUsage_promoCodeId_fkey` ON `PromoCodeUsage`;

-- AlterTable
ALTER TABLE `PromoCodeUsage` DROP COLUMN `promoCodeId`,
    ADD COLUMN `promocodeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `PromoCodeUsage` ADD CONSTRAINT `PromoCodeUsage_promocodeId_fkey` FOREIGN KEY (`promocodeId`) REFERENCES `PromoCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
