import express from "express"
import { getMeja, createMeja, dropMeja } from "../controllers/mejaController"
const app = express()

app.use(express.json())
/** add middleware process to verify token */
app.get(`/`, getMeja)

/** add middleware process to verify token and verify request data */
app.post(`/`, createMeja)

/** add middleware process to verify token */
app.delete(`/:meja_id`, dropMeja)

export default app