
import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const addDataSchema = Joi.object({
    nama_user: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('kasir','admin','manajer').required()
})

const updateDataSchema = Joi.object({
    nama_user: Joi.string().optional(),
    username: Joi.string().optional(),
    password: Joi.string().optional(),
    role: Joi.string().valid('kasir','admin','manajer').required()
})

const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('kasir','admin','manajer').required()
})

export const verifyAddUser = (request: Request, response: Response, next: NextFunction) => {
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

export const verifyEditUser = (request: Request, response: Response, next: NextFunction) => {
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

export const verifyAuthentication = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = authSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}