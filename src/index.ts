import  Express  from "express"
import path from "path"
import cors from "cors"
import userRoute from "./routes/userRoute"
import menuRoute from "./routes/menuRoute"
import transaksiRoute from "./routes/transaksiRoute"
import mejaRoute from "./routes/mejaRoute"

const app = Express()
const PORT: number = 5000

app.use(cors())

app.use(`/user`, userRoute)
app.use(`/menu`, menuRoute)
app.use(`/transaksi`, transaksiRoute)
app.use(`/meja`, mejaRoute)

app.use(`/public`, Express.static(path.join(__dirname, `public`)))
app.listen(PORT, () => console.log(`Server run on port ${PORT}`))