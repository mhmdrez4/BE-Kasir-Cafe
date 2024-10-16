"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const verifyUser_1 = require("../middlewares/verifyUser");
const app = (0, express_1.default)();
app.use(express_1.default.json());
/** add middleware process to verify token */
app.get(`/`, userControllers_1.addUser);
/** add middleware process to verify token and verify request data */
app.post(`/`, userControllers_1.createUser);
/** add middleware process to varify token and verify request data */
app.put(`/:id_user`, userControllers_1.updateUser);
/** add middleware process to verify token */
app.delete(`/:id_user`, userControllers_1.dropUser);
/** add middleware process to verify token */
app.post(`/auth`, [verifyUser_1.verifyAuthentication], userControllers_1.authentication);
exports.default = app;
