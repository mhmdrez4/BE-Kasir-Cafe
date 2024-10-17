import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';


const prisma = new PrismaClient({ errorFormat: "minimal" })

export const getTransaksi = async (request: Request, response: Response) => {
    try {
        const { startDate, endDate } = request.query;

        // Fungsi untuk validasi dan parsing tanggal
        const parseDate = (dateString: string) => {
            const parsedDate = Date.parse(dateString);
            return isNaN(parsedDate) ? null : new Date(parsedDate); // Mengembalikan objek Date
        };

        // Parsing dan validasi tanggal
        const start = startDate ? parseDate(startDate.toString()) : null;
        const end = endDate ? parseDate(endDate.toString()) : null;

        // Jika kedua tanggal tidak diberikan, tampilkan semua transaksi tanpa filter
        let dateFilter = {};
        if (start && end) {
            // Mempersiapkan filter berdasarkan rentang tanggal
            dateFilter = {
                tgl_transaksi: {
                    gte: start, // Tanggal lebih besar atau sama dengan startDate
                    lte: end    // Tanggal lebih kecil atau sama dengan endDate
                },
            };
        }

        // Query ke database menggunakan filter rentang tanggal atau tanpa filter
        const allTransaksi = await prisma.transaksi.findMany({
            where: dateFilter, // Jika dateFilter kosong, akan menampilkan semua transaksi
            include: { 
                detailTransaksi: {
                    include: { menu: true } // Menyertakan detail dari menu terkait
                },
                user: true, // Menyertakan informasi user yang melakukan transaksi
            },
            orderBy: {
                tgl_transaksi: 'asc' // Mengurutkan transaksi dari yang terkecil ke yang terbesar
            }
        });

        // Menghitung total untuk setiap transaksi dan menyiapkan format nota
        const transaksiWithNota = allTransaksi.map((transaksi) => {
            if (!transaksi.detailTransaksi || transaksi.detailTransaksi.length === 0) {
                return { ...transaksi, total: 0 };
            }

            const total = transaksi.detailTransaksi.reduce((acc, detail) => {
                const harga = detail.menu?.harga ?? 0;
                const quantity = detail.quantity ?? 0;
                return acc + (quantity * harga);
            }, 0);

            // Format hasil seperti nota
            return {
                id_transaksi: transaksi.id_transaksi,
                tgl_transaksi: transaksi.tgl_transaksi,
                nama_user: transaksi.user.nama_user, // Menampilkan nama user
                nama_pelanggan: transaksi.nama_pelanggan, // Nama pelanggan
                items: transaksi.detailTransaksi.map((detail) => ({
                    nama_menu: detail.menu.nama_menu,
                    quantity: detail.quantity,
                    harga: detail.menu.harga,
                    subtotal: detail.quantity * detail.menu.harga
                })),
                total: total
            };
        });

        return response.status(200).json({
            status: true,
            data: transaksiWithNota,
            message: `Transaksi List has been retrieved successfully.`
        });
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `There was an error: ${error}`
        });
    }
};

export const createTransaksi = async (request: Request, response: Response) => {
    try {
        const { user_id, meja_id, nama_pelanggan, status, tgl_transaksi, detailTransaksi } = request.body;

        // Validasi tgl_transaksi, konversi dari string ke Date
        const parsedDate = new Date(tgl_transaksi);
        if (isNaN(parsedDate.getTime())) {
            return response.status(400).json({
                status: false,
                message: "Invalid tgl_transaksi format. Please use a valid ISO-8601 DateTime format."
            });
        }

        // Array untuk menyimpan detail transaksi setelah harga diambil dari menu
        const transaksiDetailsWithPrice = await Promise.all(
            detailTransaksi.map(async (detail: any) => {
                const menu = await prisma.menu.findUnique({
                    where: { id_menu: detail.menu_id }
                });

                if (!menu) {
                    throw new Error(`Menu with id ${detail.menu_id} not found`);
                }

                return {
                    menu_id: detail.menu_id,
                    harga: menu.harga,
                    quantity: detail.quantity
                };
            })
        );

        // Membuat transaksi baru
        const newTransaksi = await prisma.transaksi.create({
            data: {
                user_id: user_id,
                meja_id: meja_id,
                nama_pelanggan: nama_pelanggan,
                status: status,
                tgl_transaksi: parsedDate,
                detailTransaksi: {
                    create: transaksiDetailsWithPrice
                }
            },
            include: {
                user: true,
                detailTransaksi: { include: { menu: true } },
                meja: true
            }
        });

        // Path untuk file PDF nota
        const reportsDir = path.join(__dirname, '../../public/reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const filePath = path.join(reportsDir, `nota_transaksi_${newTransaksi.id_transaksi}.pdf`);
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Header
        doc.fontSize(16).text('Nota Pesanan', { align: 'center' });
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Garis horizontal
        doc.moveDown(1);

       // Informasi Transaksi
       doc.fontSize(12);
       doc.text(`nama pelanggan : ${newTransaksi.nama_pelanggan}`);
       doc.text(`nomor meja         : ${newTransaksi.meja?.nomor_meja}`);
       doc.text(`id transaksi          : ${newTransaksi.id_transaksi}`);
       doc.text(`tanggal                : ${newTransaksi.tgl_transaksi.toISOString().split('T')[0]}`);
       doc.text(`kasir                    : ${newTransaksi.user?.nama_user}`);
       doc.moveDown(1);
       doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Garis horizontal
       doc.moveDown(1);

       // Detail Pesanan
       doc.fontSize(12).text('Detail Pesanan:', { align: 'left', underline: true });
       doc.moveDown(0.5);
       newTransaksi.detailTransaksi.forEach((detail) => {
           doc.text(`pesanan  : ${detail.menu.nama_menu}`);
           doc.text(`jumlah     : ${detail.quantity}`);
           doc.text(`subtotal   : Rp${(detail.quantity * detail.menu.harga).toLocaleString()}`);
           doc.moveDown(0.5);
       });

        // Garis horizontal
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Garis horizontal

        // Menghitung Total Harga
        const total = newTransaksi.detailTransaksi.reduce((acc, detail) => acc + (detail.menu.harga * detail.quantity), 0);
        doc.moveDown(1);
        doc.fontSize(14).text(`Total : Rp${total.toLocaleString()}`, { align: 'right' });

        // Pesan Terima Kasih
        doc.moveDown(2);
        doc.fontSize(12).text('Terimakasih sudah memesan', { align: 'center' });

        // Akhiri Dokumen
        doc.end();
        writeStream.on('finish', () => {
            response.download(filePath, `nota_transaksi_${newTransaksi.id_transaksi}.pdf`, (err) => {
                if (err) {
                    console.error('Error saat mengunduh nota transaksi:', err);
                    response.status(500).send('Error saat mengunduh nota transaksi.');
                }
            });
        });

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: `There was an error. ${error}`
        });
    }
};

export const updateTransaksi = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const { tgl_transaksi, status, nama_pelanggan } = request.body;

        // Cek apakah transaksi dengan ID tersebut ada
        const findTransaksi = await prisma.transaksi.findUnique({
            where: { id_transaksi: Number(id) },
            include: {
                user: true,
                detailTransaksi: { include: { menu: true } },
                meja: true
            }
        });

        if (!findTransaksi) {
            return response.status(404).json({
                status: false,
                message: "Transaksi not found"
            });
        }

        // Validasi dan konversi tgl_transaksi
        const parsedDate = new Date(tgl_transaksi);
        if (isNaN(parsedDate.getTime())) {
            return response.status(400).json({
                status: false,
                message: "Invalid tgl_transaksi format. Please use a valid ISO-8601 DateTime format."
            });
        }

        // Path untuk file PDF lama
        const oldFilePath = path.join(__dirname, `../../public/reports/nota_transaksi_${id}.pdf`);

        // Update transaksi di database
        const updatedTransaksi = await prisma.transaksi.update({
            where: { id_transaksi: Number(id) },
            data: {
                tgl_transaksi: parsedDate,
                status: status,
                nama_pelanggan: nama_pelanggan
            },
            include: {
                user: true,
                detailTransaksi: { include: { menu: true } },
                meja: true
            }
        });

        // Hapus file PDF lama jika ada
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }

        // Path untuk file PDF nota yang baru
        const newFilePath = path.join(__dirname, `../../public/reports/nota_transaksi_${updatedTransaksi.id_transaksi}.pdf`);
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(newFilePath);
        doc.pipe(writeStream);

        // Header
        doc.fontSize(16).text('Nota Pesanan', { align: 'center' });
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Garis horizontal
        doc.moveDown(1);

        // Informasi Transaksi
        doc.fontSize(12);
        doc.text(`nama pelanggan : ${updatedTransaksi.nama_pelanggan}`);
        doc.text(`nomor meja         : ${updatedTransaksi.meja?.nomor_meja}`);
        doc.text(`id transaksi          : ${updatedTransaksi.id_transaksi}`);
        doc.text(`tanggal                : ${updatedTransaksi.tgl_transaksi.toISOString().split('T')[0]}`);
        doc.text(`kasir                    : ${updatedTransaksi.user?.nama_user}`);
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Garis horizontal
        doc.moveDown(1);

        // Detail Pesanan
        doc.fontSize(12).text('Detail Pesanan:', { align: 'left', underline: true });
        doc.moveDown(0.5);
        updatedTransaksi.detailTransaksi.forEach((detail) => {
            doc.text(`pesanan  : ${detail.menu.nama_menu}`);
            doc.text(`jumlah     : ${detail.quantity}`);
            doc.text(`subtotal   : Rp${(detail.quantity * detail.menu.harga).toLocaleString()}`);
            doc.moveDown(0.5);
        });

        // Garis horizontal
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Garis horizontal

        // Menghitung Total Harga
        const total = updatedTransaksi.detailTransaksi.reduce((acc, detail) => acc + (detail.menu.harga * detail.quantity), 0);
        doc.moveDown(1);
        doc.fontSize(14).text(`Total : Rp${total.toLocaleString()}`, { align: 'right' });

        // Pesan Terima Kasih
        doc.moveDown(2);
        doc.fontSize(12).text('Terimakasih sudah memesan', { align: 'center', underline: true}, );

        // Akhiri Dokumen
        doc.end();
        writeStream.on('finish', () => {
            response.download(newFilePath, `nota_transaksi_${updatedTransaksi.id_transaksi}.pdf`, (err) => {
                if (err) {
                    console.error('Error saat mengunduh nota transaksi:', err);
                    response.status(500).send('Error saat mengunduh nota transaksi.');
                }
            });
        });

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: `Error updating transaksi: ${error}`
        });
    }
};


export const deleteTransaksi = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;

        // Cek apakah transaksi dengan ID yang diberikan ada
        const findTransaksi = await prisma.transaksi.findFirst({
            where: {
                id_transaksi: Number(id)
            }
        });

        if (!findTransaksi) {
            return response.status(404).json({
                status: false,
                message: `Transaksi not found`
            });
        }

        // Path untuk file PDF yang terkait dengan transaksi
        const filePath = path.join(__dirname, `../../public/reports/nota_transaksi_${id}.pdf`);

        // Hapus semua detail transaksi terkait dengan transaksi tersebut
        await prisma.detailTransaksi.deleteMany({
            where: {
                transaksi_id: Number(id) // Menggunakan transaksi_id untuk menghapus detail terkait
            }
        });

        // Hapus transaksi
        const dropTransaksi = await prisma.transaksi.delete({
            where: {
                id_transaksi: Number(id)
            }
        });

        // Hapus file PDF nota jika ada
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return response.status(200).json({
            status: true,
            data: dropTransaksi,
            message: `Transaksi has been deleted and associated PDF has been removed`
        });

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: `There is an error. ${error}`
        });
    }
};