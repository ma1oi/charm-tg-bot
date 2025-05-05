/*
  Warnings:

  - You are about to drop the column `imgUrl` on the `Artist` table. All the data in the column will be lost.
  - Added the required column `imgUrl` to the `ArtistCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Artist` DROP COLUMN `imgUrl`;

-- AlterTable
ALTER TABLE `ArtistCategory` ADD COLUMN `imgUrl` VARCHAR(191) NOT NULL;
