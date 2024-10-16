import express from "express"
import { authentication, addUser, createUser, updateUser, dropUser } from "../controllers/userControllers"
import { verifyAddUser, verifyEditUser, verifyAuthentication } from "../middlewares/verifyUser"
const app = express()

app.use(express.json())
/** add middleware process to verify token */
app.get(`/`, addUser)

/** add middleware process to verify token and verify request data */
app.post(`/`, createUser)

/** add middleware process to varify token and verify request data */
app.put(`/:id_user`, updateUser)

/** add middleware process to verify token */
app.delete(`/:id_user`, dropUser)

/** add middleware process to verify token */
app.post(`/auth`, [verifyAuthentication], authentication)
export default app