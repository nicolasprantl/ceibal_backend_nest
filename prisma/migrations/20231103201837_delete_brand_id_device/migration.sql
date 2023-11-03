/*
  Warnings:

  - You are about to drop the column `brandId` on the `Device` table. All the data in the column will be lost.
  - Added the required column `brand` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Device` DROP FOREIGN KEY `Device_brandId_fkey`;

-- AlterTable
ALTER TABLE `Device` DROP COLUMN `brandId`,
    ADD COLUMN `brand` VARCHAR(191) NOT NULL;
