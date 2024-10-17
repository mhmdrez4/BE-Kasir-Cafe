// import { PrismaClient } from '@prisma/client';
// import PDFDocument from 'pdfkit';
// import { Request, Response } from 'express';
// import fs from 'fs';
// import path from 'path';

// const prisma = new PrismaClient();

// export const transaksiReport = async (req: Request, res: Response) => {
//     try {
//         // Ambil id_transaksi dari parameter URL
//         const { id } = req.params;
        
//         // Ambil detail transaksi berdasarkan id_transaksi
//         const transaksi = await prisma.transaksi.findUnique({
//             where: { id_transaksi: parseInt(id) },
//             include: {
//                 user: true,
//                 detailTransaksi: {
//                     include: {
//                         menu: true
//                     }
//                 },
//                 meja: true,
//             }
//         });

//         if (!transaksi) {
//             return res.status(404).send('Transaksi tidak ditemukan');
//         }

//         // Tentukan path untuk file PDF
//         const reportsDir = path.join(__dirname, '../../public/reports');
//         const filePath = path.join(reportsDir, 'nota_transaksi.pdf');

//         // Buat folder 'reports' jika belum ada
//         if (!fs.existsSync(reportsDir)) {
//             fs.mkdirSync(reportsDir, { recursive: true });
//         }

//         // Buat dokumen PDF baru
//         const doc = new PDFDocument();
//         const writeStream = fs.createWriteStream(filePath);

//         // Pipe dokumen ke file
//         doc.pipe(writeStream);

//         // Tambahkan header nota
//         doc.fontSize(20).text('Nota Transaksi', { align: 'center' });
//         doc.moveDown();
//         doc.fontSize(12).text(`ID Transaksi: ${transaksi.id_transaksi}`);
//         doc.text(`Tanggal: ${transaksi.tgl_transaksi.toISOString().split('T')[0]}`);
//         doc.text(`Nomor Meja: ${transaksi.meja.nomor_meja}`);
//         doc.text(`Pelanggan: ${transaksi.nama_pelanggan}`);
//         doc.text(`Kasir: ${transaksi.user.nama_user}`);
//         doc.moveDown();

//         // Tambahkan detail item yang dipesan
//         doc.fontSize(14).text('Detail Pesanan:', { underline: true });
//         let totalHarga = 0;

//         transaksi.detailTransaksi.forEach((detail) => {
//             doc.fontSize(12).text(`- ${detail.menu.nama_menu} (x${detail.quantity})`);
//             doc.text(`  Harga: Rp${detail.harga}`);
//             totalHarga += detail.harga * detail.quantity;
//             doc.moveDown();
//         });

//         // Tambahkan total harga
//         doc.moveDown();
//         doc.fontSize(14).text(`Total: Rp${totalHarga}`, { align: 'right' });

//         // Akhiri dokumen
//         doc.end();

//         // Tunggu sampai dokumen selesai ditulis
//         writeStream.on('finish', () => {
//             res.download(filePath, 'nota_transaksi.pdf', (err) => {
//                 if (err) {
//                     console.error('Error saat mengunduh nota transaksi:', err);
//                     res.status(500).send('Error saat mengunduh nota transaksi.');
//                 }
//             });
//         });
//     } catch (error) {
//         console.error('Error saat menghasilkan nota transaksi:', error);
//         res.status(500).send('Error saat menghasilkan nota transaksi.');
//     }
// };
    