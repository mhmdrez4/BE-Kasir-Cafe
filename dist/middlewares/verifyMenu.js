"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEditMenu = exports.verifyAddMenu = void 0;
const joi_1 = __importDefault(require("joi"));
const addDataSchema = joi_1.default.object({
    nama_menu: joi_1.default.string().required(),
    deskripsi: joi_1.default.string().required(),
    gambar: joi_1.default.allow().optional(),
    harga: joi_1.default.number().min(0).required(),
    jenis: joi_1.default.string().valid('makanan', 'minuman').required()
});
const updateDataSchema = joi_1.default.object({
    nama_menu: joi_1.default.string().optional(),
    deskripsi: joi_1.default.string().optional(),
    gambar: joi_1.default.allow().optional(),
    harga: joi_1.default.number().min(0).optional(),
    jenis: joi_1.default.string().valid('makanan', 'minuman').optional()
});
const verifyAddMenu = (request, response, next) => {
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
exports.verifyAddMenu = verifyAddMenu;
const verifyEditMenu = (request, response, next) => {
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
exports.verifyEditMenu = verifyEditMenu;
