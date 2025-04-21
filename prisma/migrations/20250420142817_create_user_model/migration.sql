-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tuid` BIGINT NOT NULL,
    `username` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `is_premium` BOOLEAN NOT NULL DEFAULT false,
    `language_code` VARCHAR(191) NULL,

    UNIQUE INDEX `users_tuid_key`(`tuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
