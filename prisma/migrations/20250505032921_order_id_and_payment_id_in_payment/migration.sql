/*
  Warnings:

  - You are about to drop the column `paymentLink` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Made the column `maxUses` on table `Promocode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `paymentLink`,
    ADD COLUMN `paymentId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Promocode` MODIFY `maxUses` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_orderId_key` ON `Payment`(`orderId`);
