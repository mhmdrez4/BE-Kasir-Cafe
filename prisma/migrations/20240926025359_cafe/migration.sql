/*
  Warnings:

  - You are about to drop the column `nomor_meja` on the `transaksi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `nomor_meja`;

-- CreateTable
CREATE TABLE `Meja` (
    `id_meja` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_meja` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id_meja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
