"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAddOrder = void 0;
const joi_1 = __importDefault(require("joi"));
const detailTransaksischema = joi_1.default.object({
    menu_id: joi_1.default.number().required(),
    quantity: joi_1.default.number().min(1).required(),
    harga: joi_1.default.number().min(1).optional()
});
const addDataSchema = joi_1.default.object({
    user_id: joi_1.default.number().required(),
    nama_pelanggan: joi_1.default.string().required(),
    nomor_meja: joi_1.default.string().required(),
    tgl_transaksi: joi_1.default.string().required(),
    status: joi_1.default.string().valid('belum_bayar', 'lunas').required(),
    detailTransaksi: joi_1.default.array().items(detailTransaksischema).min(1).required()
});
const verifyAddOrder = (request, response, next) => {
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
exports.verifyAddOrder = verifyAddOrder;
