"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const global_1 = require("../global");
/** define storage configuration of egg's image  */
const storage = multer_1.default.diskStorage({
    destination: (request, file, cb) => {
        /** define location of uploaded image, make sure that you have create a "public" folder in root folder.
         * then create folder "egg-image" inside of "public folder"
         */
        cb(null, `${global_1.BASE_URL}/public/image`);
    },
    filename: (request, file, cb) => {
        /** define file name of uploaded file */
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`);
    }
});
const uploadFile = (0, multer_1.default)({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } /** define max size of uploaded file, in this case max size is 2 MB */
});
exports.default = uploadFile;
