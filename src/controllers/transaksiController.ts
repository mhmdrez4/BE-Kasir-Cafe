import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
                    harga: menu.harga, // Harga didapatkan langsung dari menu
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
                tgl_transaksi: parsedDate, // Pastikan ini berupa objek Date, bukan string
                detailTransaksi: {
                    create: transaksiDetailsWithPrice // Menghubungkan dengan detail transaksi yang telah dilengkapi dengan harga dari menu
                }
            },
            include: {
                user: true, // Menyertakan data user yang melakukan transaksi
                detailTransaksi: {
                    include: { menu: true } // Menyertakan detail transaksi dan menu
                }
            }
        });

        // Menghitung total dan menyiapkan format nota
        const total = newTransaksi.detailTransaksi.reduce((acc, detail) => {
            const harga = detail.menu?.harga ?? 0;
            const quantity = detail.quantity ?? 0;
            return acc + (quantity * harga);
        }, 0);

        const transaksiNota = {
            id_transaksi: newTransaksi.id_transaksi,
            tgl_transaksi: newTransaksi.tgl_transaksi,
            nama_user: newTransaksi.user.nama_user, // Nama user
            nama_pelanggan: newTransaksi.nama_pelanggan, // Nama pelanggan
            items: newTransaksi.detailTransaksi.map((detail) => ({
                nama_menu: detail.menu.nama_menu,
                quantity: detail.quantity,
                harga: detail.menu.harga,
                subtotal: detail.quantity * detail.menu.harga
            })),
            total: total
        };

        return response.status(201).json({
            status: true,
            data: transaksiNota,
            message: "Transaksi created successfully"
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: `There is an error. ${error}`
        });
    }
};




export const updateTransaksi = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;  // Mengambil ID transaksi dari URL params
        const { tgl_transaksi, status, nama_pelanggan } = request.body;

        // Cek apakah ID transaksi diberikan
        if (!id) {
            return response.status(400).json({
                status: false,
                message: "Transaksi ID is required"
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

        // Update transaksi di database
        const updatedTransaksi = await prisma.transaksi.update({
            where: { id_transaksi: Number(id) },
            data: {
                tgl_transaksi: parsedDate, // Pastikan menggunakan objek Date
                status: status,
                nama_pelanggan: nama_pelanggan
            }
        });

        return response.status(200).json({
            status: true,
            data: updatedTransaksi,
            message: "Transaksi updated successfully"
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
        const { id } = request.params

        const findTransaksi = await prisma.transaksi.findFirst({
            where: {
                id_transaksi: Number(id)
            }
        })

        if (!findTransaksi) return response.status(200).json({
            status: false,
            message: `Transaksi is not found`
        })

        let deleteDetailTransaksi = await prisma.detailTransaksi.deleteMany({
            where: {
                id_detail_transaksi: Number(id)
            }
        })

        let dropTransaksi = await prisma.transaksi.delete({
            where: {
                id_transaksi : Number(id)
            }
        })

        return response.json({
            status: true,
            data: dropTransaksi,
            message: `Transaksi has deleted`
        })
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}