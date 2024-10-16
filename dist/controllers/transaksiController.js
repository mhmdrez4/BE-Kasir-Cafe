"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaksi = exports.createTransaksi = exports.getTransaksi = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ errorFormat: "minimal" });
const getTransaksi = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter } = request.query;
        const allTransaksi = yield prisma.transaksi.findMany({
            where: {
                OR: [
                    { tgl_transaksi: { contains: (filter === null || filter === void 0 ? void 0 : filter.toString()) || "" } },
                ]
            },
            include: { detailTransaksi: { include: { menu: true } } },
        });
        return response.json({
            status: true,
            data: allTransaksi,
            message: `Transaksi List har retrieved`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.getTransaksi = getTransaksi;
const createTransaksi = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nama_pelanggan, nomor_meja, tgl_transaksi, status, detailTransaksi, user_id, transaki_id } = request.body;
        // Variabel untuk menyimpan total harga transaksi
        let totalHarga = 0;
        // Membuat transaksi baru
        const newTransaksi = yield prisma.transaksi.create({
            data: {
                id_transaksi: transaki_id,
                user_id: user_id,
                nama_pelanggan,
                status,
                nomor_meja,
                tgl_transaksi
            }
        });
        // Iterasi untuk membuat detail transaksi dan menjumlahkan harga total
        for (let index = 0; index < detailTransaksi.length; index++) {
            const { menu_id, quantity, harga } = detailTransaksi[index];
            // Menambahkan harga item ke total harga
            totalHarga += quantity * harga;
            // Membuat detail transaksi untuk setiap item
            yield prisma.detailTransaksi.create({
                data: {
                    transaksi_id: newTransaksi.id_transaksi,
                    menu_id: Number(menu_id),
                    quantity: Number(quantity),
                    harga: Number(harga)
                }
            });
        }
        // Mengirim respons sukses dengan data transaksi baru dan total harga
        return response.status(200).json({
            status: true,
            data: { newTransaksi, total_harga: totalHarga }, // Mengirim data transaksi dengan total harga
            message: "New Transaksi has been created with total price calculated"
        });
    }
    catch (error) {
        // Mengirim respons error jika terjadi kesalahan
        return response.status(400).json({
            status: false,
            message: `There is an error. ${error}`
        });
    }
});
exports.createTransaksi = createTransaksi;
const deleteTransaksi = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const findTransaksi = yield prisma.transaksi.findFirst({
            where: {
                id_transaksi: Number(id)
            }
        });
        if (!findTransaksi)
            return response.status(200).json({
                status: false,
                message: `Transaksi is not found`
            });
        let deleteDetailTransaksi = yield prisma.detailTransaksi.deleteMany({
            where: {
                id_detail_transaksi: Number(id)
            }
        });
        let dropTransaksi = yield prisma.transaksi.delete({
            where: {
                id_transaksi: Number(id)
            }
        });
        return response.json({
            status: true,
            data: dropTransaksi,
            message: `Transaksi has deleted`
        });
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.deleteTransaksi = deleteTransaksi;
