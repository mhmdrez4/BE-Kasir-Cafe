/*
  Warnings:

  - You are about to alter the column `tgl_transaksi` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `transaksi` MODIFY `tgl_transaksi` DATETIME(3) NOT NULL;
