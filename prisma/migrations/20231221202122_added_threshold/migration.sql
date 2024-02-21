-- AlterTable
ALTER TABLE `Device` ADD COLUMN `tender` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Threshold` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `config` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
