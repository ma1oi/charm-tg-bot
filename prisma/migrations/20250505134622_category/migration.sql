/*
  Warnings:

  - You are about to drop the column `artistId` on the `ArtistCategory` table. All the data in the column will be lost.
  - Made the column `userId` on table `ArtistCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ArtistCategory` DROP FOREIGN KEY `ArtistCategory_artistId_fkey`;

-- DropForeignKey
ALTER TABLE `ArtistCategory` DROP FOREIGN KEY `ArtistCategory_userId_fkey`;

-- DropIndex
DROP INDEX `ArtistCategory_artistId_fkey` ON `ArtistCategory`;

-- DropIndex
DROP INDEX `ArtistCategory_userId_fkey` ON `ArtistCategory`;

-- AlterTable
ALTER TABLE `ArtistCategory` DROP COLUMN `artistId`,
    MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ArtistCategory` ADD CONSTRAINT `ArtistCategory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
