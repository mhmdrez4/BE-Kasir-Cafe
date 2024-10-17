import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({errorFormat: "pretty"})

export const getMenu = async (request:Request, response: Response) => {

    try {
        const { search } = request.query
        const allMenu = await prisma.menu.findMany({
            where: { nama_menu: { contains: search?.toString() || "" } }
        })
        /** contains means search name of admin based on sent keyword */

        return response.json({
            status: true,
            data: allMenu,
            message: `Menu has retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }

}

export const createMenu = async (request:Request, response:Response) => {

    try{
        const {nama_menu, jenis, deskripsi, harga} = request.body

        let filename = ""
        if (request.file) filename = request.file.filename /** get file name of uploaded file */

        const newUser = await prisma.menu.create({
            data: { nama_menu, harga: Number(harga), gambar: filename, jenis, deskripsi}
        })

        return response.json({
            status: true,
            data: newUser,
            message: `Admin has created`
        }).status(200)
    }catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }

}

export const updateMenu = async (request: Request, response: Response) => {
    try {
        const { id_menu } = request.params
        const { nama_menu, harga, jenis, deskripsi } = request.body /** get requested data (data has been sent from request) */

        /** make sure that data is exists in database */
        const findMenu = await prisma.menu.findFirst({ where: { id_menu: Number(id_menu) } })
        if (!findMenu) return response
            .status(200)
            .json({ status: false, message: `Menu is not found` })

        let filename = findMenu.gambar /** default value of variable filename based on saved information */
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}public/image/${findMenu.gambar}`
            let exists = fs.existsSync(path)
            if (exists && findMenu.gambar !== ``) fs.unlinkSync(path)

            /** this code use to delete old exists file if reupload new file */
        }


        const updatedMenu= await prisma.menu.update({
            data: {
                nama_menu: nama_menu || findMenu.nama_menu,
                harga: harga ? Number(harga) : findMenu.harga,
                jenis : jenis || findMenu.jenis,
                deskripsi : deskripsi || findMenu.deskripsi,
                gambar: filename
            },
            where: { id_menu: Number(id_menu) }
        })

        return response.json({
            status: true,
            data: updatedMenu,
            message: `menu has updated`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const dropMenu = async (request: Request, response: Response) => {
    try {
        const { id_menu } = request.params
        /** make sure that data is exists in database */
        const findMenu = await prisma.menu.findFirst({ where: { id_menu: Number(id_menu) } })
        if (!findMenu) return response
            .status(200)
            .json({ status: false, message: `Menu is not found` })

        let path = `${BASE_URL}public/image/${findMenu.gambar}` /** define path (address) of file location */
        let exists = fs.existsSync(path)
        if (exists && findMenu.gambar !== ``) fs.unlinkSync(path) /** if file exist, then will be delete */

        const deletedMenu = await prisma.menu.delete({
            where: { id_menu: Number(id_menu) }
        })
        return response.json({
            status: true,
            data: deletedMenu,
            message: `Menu has deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}