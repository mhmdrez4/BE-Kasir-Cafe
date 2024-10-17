"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaksiController_1 = require("../controllers/transaksiController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
/** add middleware process to verify token */
app.get(`/`, transaksiController_1.getTransaksi);
/** add middleware process to verify token and verify request data */
app.post(`/`, transaksiController_1.createTransaksi);
/** add middleware process to verify token */
app.delete(`/:id`, transaksiController_1.deleteTransaksi);
/** add middleware process to verify token */
exports.default = app;
