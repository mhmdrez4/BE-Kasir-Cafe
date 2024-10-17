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
exports.authentication = exports.dropUser = exports.updateUser = exports.createUser = exports.addUser = void 0;
const client_1 = require("@prisma/client");
const md5_1 = __importDefault(require("md5"));
const prisma = new client_1.PrismaClient({ errorFormat: "minimal" });
const addUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = request.query;
        const allAdmin = yield prisma.user.findMany({
            where: { nama_user: { contains: (search === null || search === void 0 ? void 0 : search.toString()) || "" } }
        });
        /** contains means search name of admin based on sent keyword */
        return response.json({
            status: true,
            data: allAdmin,
            message: `Admin has retrieved`
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
exports.addUser = addUser;
const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nama_user, username, password, role } = request.body;
        const newUser = yield prisma.user.create({
            data: {
                nama_user, username, password: (0, md5_1.default)(password), role
            }
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
exports.createUser = createUser;
const updateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_user } = request.params;
        const { nama_user, username, password, Role } = request.body;
        const findUser = yield prisma.user.findFirst({ where: { id_user: Number(id_user) } });
        if (!findUser)
            return response
                .status(200)
                .json({ status: false, message: `user not found` });
        const updatedUser = yield prisma.user.update({
            where: { id_user: Number(id_user) },
            data: {
                nama_user: nama_user || findUser.nama_user,
                username: username || findUser.username,
                password: password ? (0, md5_1.default)(password) : findUser.password,
                role: Role || findUser.role
            }
        });
        return response.json({
            status: true,
            data: updatedUser,
            message: `admin was updated`
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
exports.updateUser = updateUser;
const dropUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_user } = request.params; /** get id of egg's id that sent in parameter of URL */
        /** make sure that data is exists in database */
        const findUser = yield prisma.user.findFirst({
            where: { id_user: Number(id_user) }
        });
        if (!findUser)
            return response
                .status(200)
                .json({ status: false, message: `Admin is not found` });
        /** process to delete admin's data */
        const deletedAdmin = yield prisma.user.delete({
            where: { id_user: Number(id_user) }
        });
        return response.json({
            status: true,
            data: deletedAdmin,
            message: `Admin has deleted`
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
exports.dropUser = dropUser;
const authentication = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, role } = request.body;
        const findUser = yield prisma.user.findFirst({
            where: { username, password: (0, md5_1.default)(password), role }
        });
        if (!findUser)
            return response
                .status(200)
                .json({ status: false, logged: true, message: `username, password, or role is not valdi` });
        const findRole = yield prisma.user.findFirst({
            where: { role }
        });
        return response
            .status(200)
            .json({ status: true, logged: true, message: `login success` });
    }
    catch (error) {
        return response.json({
            status: false,
            message: `there is an error ${error}`
        }).status(400);
    }
});
exports.authentication = authentication;
