import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient({ errorFormat: "minimal" })

export const getMeja = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allMeja = await prisma.meja.findMany({
            where: { nomor_meja: { contains: search?.toString() || "" } }
        })
        /** contains means search name of admin based on sent keyword */

        return response.json({
            status: true,
            data: allMeja,
            message: `Meja has retrieved`
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

export const createMeja = async (request: Request, response: Response) => {

    try {
        const { nomor_meja } = request.body

        const newMeja = await prisma.meja.create({
            data: {
                nomor_meja: nomor_meja
            }
        })

        return response.json({
            status: true,
            data: newMeja,
            message: `Meja has created`
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

export const dropMeja = async (request: Request, response: Response) => {
    try {
        const { meja_id } = request.params /** get id of egg's id that sent in parameter of URL */

        /** make sure that data is exists in database */
        const findMeja = await prisma.meja.findFirst({ where: { id_meja: Number(meja_id) } })
        if (!findMeja) return response
            .status(200)
            .json({ status: false, message: `Meja is not found` })

        /** process to delete admin's data */
        const deletedMeja = await prisma.meja.delete({
            where: { id_meja: Number(meja_id) }
        })
        return response.json({
            status: true,
            data: deletedMeja,
            message: `Meja has deleted`
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


