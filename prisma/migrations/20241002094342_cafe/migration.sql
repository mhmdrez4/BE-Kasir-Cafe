/*
  Warnings:

  - You are about to drop the column `nomor_meja` on the `transaksi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `nomor_meja`,
    ADD COLUMN `meja_id` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Meja` (
    `id_meja` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_meja` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id_meja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_meja_id_fkey` FOREIGN KEY (`meja_id`) REFERENCES `Meja`(`id_meja`) ON DELETE RESTRICT ON UPDATE CASCADE;
