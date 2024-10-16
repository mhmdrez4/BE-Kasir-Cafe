"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropMenu = exports.updateMenu = exports.createMenu = exports.getMenu = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const global_1 = require("../global");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const getMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = request.query;
        const allMenu = yield prisma.menu.findMany({
            where: { nama_menu: { contains: (search === null || search === void 0 ? void 0 : search.toString()) || "" } }
        });
        /** contains means search name of admin based on sent keyword */
        return response.json({
            status: true,
            data: allMenu,
            message: `Menu has retrieved`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.getMenu = getMenu;
const createMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nama_menu, jenis, deskripsi, harga } = request.body;
        let filename = "";
        if (request.file)
            filename = request.file.filename; /** get file name of uploaded file */
        const newUser = yield prisma.menu.create({
            data: { nama_menu, harga: Number(harga), gambar: filename, jenis, deskripsi }
        });
        return response.json({
            status: true,
            data: newUser,
            message: `Admin has created`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.createMenu = createMenu;
const updateMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_menu } = request.params;
        const { nama_menu, harga, jenis, deskripsi } = request.body; /** get requested data (data has been sent from request) */
        /** make sure that data is exists in database */
        const findMenu = yield prisma.menu.findFirst({ where: { id_menu: Number(id_menu) } });
        if (!findMenu)
            return response
                .status(200)
                .json({ status: false, message: `Menu is not found` });
        let filename = findMenu.gambar; /** default value of variable filename based on saved information */
        if (request.file) {
            filename = request.file.filename;
            let path = `${global_1.BASE_URL}public/image/${findMenu.gambar}`;
            let exists = fs_1.default.existsSync(path);
            if (exists && findMenu.gambar !== ``)
                fs_1.default.unlinkSync(path);
            /** this code use to delete old exists file if reupload new file */
        }
        const updatedMenu = yield prisma.menu.update({
            data: {
                nama_menu: nama_menu || findMenu.nama_menu,
                harga: harga ? Number(harga) : findMenu.harga,
                jenis: jenis || findMenu.jenis,
                deskripsi: deskripsi || findMenu.deskripsi,
                gambar: filename
            },
            where: { id_menu: Number(id_menu) }
        });
        return response.json({
            status: true,
            data: updatedMenu,
            message: `menu has updated`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.updateMenu = updateMenu;
const dropMenu = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_menu } = request.params;
        /** make sure that data is exists in database */
        const findMenu = yield prisma.menu.findFirst({ where: { id_menu: Number(id_menu) } });
        if (!findMenu)
            return response
                .status(200)
                .json({ status: false, message: `Menu is not found` });
        let path = `${global_1.BASE_URL}public/image/${findMenu.gambar}`; /** define path (address) of file location */
        let exists = fs_1.default.existsSync(path);
        if (exists && findMenu.gambar !== ``)
            fs_1.default.unlinkSync(path); /** if file exist, then will be delete */
        const deletedMenu = yield prisma.menu.delete({
            where: { id_menu: Number(id_menu) }
        });
        return response.json({
            status: true,
            data: deletedMenu,
            message: `Menu has deleted`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `There is an error. ${error}`
        })
            .status(400);
    }
});
exports.dropMenu = dropMenu;
