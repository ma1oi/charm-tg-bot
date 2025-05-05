/*
  Warnings:

  - You are about to drop the column `tuid` on the `Artist` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Artist_tuid_key` ON `Artist`;

-- AlterTable
ALTER TABLE `Artist` DROP COLUMN `tuid`;

-- AlterTable
ALTER TABLE `ArtistCategory` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ArtistCategory` ADD CONSTRAINT `ArtistCategory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
