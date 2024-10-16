import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5"



const prisma = new PrismaClient({ errorFormat: "minimal" })

export const addUser = async (request: Request, response: Response) => {

    try {
        const { search } = request.query
        const allAdmin = await prisma.user.findMany({
            where: { nama_user: { contains: search?.toString() || "" } }
        })
        /** contains means search name of admin based on sent keyword */

        return response.json({
            status: true,
            data: allAdmin,
            message: `Admin has retrieved`
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

export const createUser = async (request: Request, response: Response) => {

    try {
        const { nama_user, username, password, role } = request.body

        const newUser = await prisma.user.create({
            data: {
                nama_user, username, password: md5(password), role
            }
        })

        return response.json({
            status: true,
            data: newUser,
            message: `Admin has created`
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

export const updateUser = async (request: Request, response: Response) => {

    try {
        const { id_user } = request.params
        const { nama_user, username, password, Role } = request.body

        const findUser = await prisma.user.findFirst({ where: { id_user: Number(id_user) } })
        if (!findUser) return response
            .status(200)
            .json({ status: false, message: `user not found` })

        const updatedUser = await prisma.user.update({
            where: { id_user: Number(id_user) },
            data: {
                nama_user: nama_user || findUser.nama_user,
                username: username || findUser.username,
                password: password ? md5(password) : findUser.password,
                role: Role || findUser.role
            }
        })

        return response.json({
            status: true,
            data: updatedUser,
            message: `admin was updated`
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

export const dropUser = async (request: Request, response: Response) => {
    try {
        const { id_user } = request.params /** get id of egg's id that sent in parameter of URL */

        /** make sure that data is exists in database */
        const findUser = await prisma.user.findFirst({
            where: { id_user: Number(id_user) }
        })
        if (!findUser) return response
            .status(200)
            .json({ status: false, message: `Admin is not found` })

        /** process to delete admin's data */
        const deletedAdmin = await prisma.user.delete({
            where: { id_user: Number(id_user) }
        })
        return response.json({
            status: true,
            data: deletedAdmin,
            message: `Admin has deleted`
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

export const authentication = async (request: Request, response: Response) => {

    try {
        const { username, password, role } = request.body

        const findUser = await prisma.user.findFirst({
            where: { username, password: md5(password), role }
        })
        if (!findUser) return response
            .status(200)
            .json({ status: false, logged: true, message: `username, password, or role is not valdi` })

        const findRole = await prisma.user.findFirst({
            where: { role }
        })
        return response
            .status(200)
            .json({ status: true, logged: true, message: `login success` })
    } catch (error) {
        return response.json({
            status: false,
            message: `there is an error ${error}`
        }).status(400)
    }

}