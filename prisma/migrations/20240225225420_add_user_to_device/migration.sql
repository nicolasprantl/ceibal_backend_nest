/*
  Warnings:

  - Added the required column `user` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Device` ADD COLUMN `user` VARCHAR(191) NOT NULL;
