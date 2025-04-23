/*
  Warnings:

  - You are about to drop the column `content` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `content`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `nameProduct` VARCHAR(191) NULL,
    ADD COLUMN `promocode` VARCHAR(191) NULL,
    MODIFY `artistId` INTEGER NULL DEFAULT 0,
    MODIFY `status` ENUM('not_paid', 'pending', 'in_progress', 'done') NOT NULL DEFAULT 'not_paid';

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('customer', 'artist', 'admin') NOT NULL DEFAULT 'customer';
