/*
  Warnings:

  - You are about to drop the `meja` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `nomor_meja` VARCHAR(191) NOT NULL DEFAULT '';

-- DropTable
DROP TABLE `meja`;
