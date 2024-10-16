"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const menuRoute_1 = __importDefault(require("./routes/menuRoute"));
const transaksiRoute_1 = __importDefault(require("./routes/transaksiRoute"));
const app = (0, express_1.default)();
const PORT = 5000;
app.use((0, cors_1.default)());
app.use(`/user`, userRoute_1.default);
app.use(`/menu`, menuRoute_1.default);
app.use(`/transaksi`, transaksiRoute_1.default);
app.use(`/public`, express_1.default.static(path_1.default.join(__dirname, `public`)));
app.listen(PORT, () => console.log(`Server Egg Farm run on port ${PORT}`));
