-- AlterTable
ALTER TABLE `Message` ADD COLUMN `artistId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `artistId` INTEGER NULL;

-- AlterTable
ALTER TABLE `PromocodeUsage` ADD COLUMN `artistId` INTEGER NULL;
