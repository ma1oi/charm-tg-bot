/*
  Warnings:

  - You are about to drop the `PromoCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PromoCodeUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PromoCodeUsage` DROP FOREIGN KEY `PromoCodeUsage_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `PromoCodeUsage` DROP FOREIGN KEY `PromoCodeUsage_promocodeId_fkey`;

-- DropForeignKey
ALTER TABLE `PromoCodeUsage` DROP FOREIGN KEY `PromoCodeUsage_userId_fkey`;

-- DropTable
DROP TABLE `PromoCode`;

-- DropTable
DROP TABLE `PromoCodeUsage`;

-- CreateTable
CREATE TABLE `Promocode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `discountType` ENUM('percent', 'fixed') NOT NULL,
    `discountValue` DOUBLE NOT NULL,
    `expiresAt` DATETIME(3) NULL,
    `maxUses` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Promocode_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PromocodeUsage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `promocodeId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `usedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PromocodeUsage` ADD CONSTRAINT `PromocodeUsage_promocodeId_fkey` FOREIGN KEY (`promocodeId`) REFERENCES `Promocode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromocodeUsage` ADD CONSTRAINT `PromocodeUsage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromocodeUsage` ADD CONSTRAINT `PromocodeUsage_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
