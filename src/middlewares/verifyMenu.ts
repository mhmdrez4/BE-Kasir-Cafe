import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const addDataSchema = Joi.object({
    nama_menu: Joi.string().required(),
    deskripsi: Joi.string().required(),
    gambar: Joi.allow().optional(),
    harga: Joi.number().min(0).required(),
    jenis: Joi.string().valid('makanan','minuman').required()
})

const updateDataSchema = Joi.object({
    nama_menu: Joi.string().optional(),
    deskripsi: Joi.string().optional(),
    gambar: Joi.allow().optional(),
    harga: Joi.number().min(0).optional(),
    jenis: Joi.string().valid('makanan','minuman').optional()
})

export const verifyAddMenu = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditMenu = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}