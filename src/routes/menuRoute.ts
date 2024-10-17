import express from "express"
import { createMenu, dropMenu, getMenu, updateMenu } from "../controllers/menuController"
import uploadFile from "../middlewares/uploadImage"
import { verifyAddMenu, verifyEditMenu } from "../middlewares/verifyMenu"
const app = express()

app.use(express.json())
/** add middleware process to verify token */
app.get(`/`, getMenu)

/** add middleware process to varify token, upload an image, and verify request data */
app.post(`/`, [uploadFile.single("gambar"), verifyAddMenu], createMenu)

/** add middleware process to varify token, upload an image, and verify request data */
app.put(`/:id_menu`, [uploadFile.single("gambar"), verifyEditMenu], updateMenu)

/** add middleware process to verify token */
app.delete(`/:id_menu`, dropMenu)
export default app