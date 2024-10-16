"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthentication = exports.verifyEditUser = exports.verifyAddUser = void 0;
const joi_1 = __importDefault(require("joi"));
const addDataSchema = joi_1.default.object({
    nama_user: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    role: joi_1.default.string().valid('kasir', 'admin', 'manajer').required()
});
const updateDataSchema = joi_1.default.object({
    nama_user: joi_1.default.string().optional(),
    username: joi_1.default.string().optional(),
    password: joi_1.default.string().optional(),
    role: joi_1.default.string().valid('kasir', 'admin', 'manajer').required()
});
const authSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    role: joi_1.default.string().valid('kasir', 'admin', 'manajer').required()
});
const verifyAddUser = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyAddUser = verifyAddUser;
const verifyEditUser = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyEditUser = verifyEditUser;
const verifyAuthentication = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = authSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyAuthentication = verifyAuthentication;
