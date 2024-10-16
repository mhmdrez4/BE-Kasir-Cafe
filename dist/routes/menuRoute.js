"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menuController_1 = require("../controllers/menuController");
const uploadImage_1 = __importDefault(require("../middlewares/uploadImage"));
const verifyMenu_1 = require("../middlewares/verifyMenu");
const app = (0, express_1.default)();
app.use(express_1.default.json());
/** add middleware process to verify token */
app.get(`/`, menuController_1.getMenu);
/** add middleware process to varify token, upload an image, and verify request data */
app.post(`/`, [uploadImage_1.default.single("gambar"), verifyMenu_1.verifyAddMenu], menuController_1.createMenu);
/** add middleware process to varify token, upload an image, and verify request data */
app.put(`/:id_menu`, [uploadImage_1.default.single("gambar"), verifyMenu_1.verifyEditMenu], menuController_1.updateMenu);
/** add middleware process to verify token */
app.delete(`/:id_menu`, menuController_1.dropMenu);
exports.default = app;
