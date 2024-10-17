import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const detailTransaksischema = Joi.object({
    menu_id : Joi.number().required(),
    quantity : Joi.number().min(1).required()
})

const addDataSchema = Joi.object({
    user_id : Joi.number().required(),
    nama_pelanggan : Joi.string().required(),
    nomor_meja : Joi.string().required(),
    tgl_transaksi :  Joi.date().required(),
    status: Joi.string().valid('belum_bayar', 'lunas').required(),
    detailTransaksi: Joi.array().items(detailTransaksischema).min(1).required()
})

export const verifyAddOrder = (request: Request, response: Response, next: NextFunction) => {
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