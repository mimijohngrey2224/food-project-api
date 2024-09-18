const express = require("express")
const connectDB = require("./config/db")
const userRouter = require("./routes/userRoute")
const dotenv = require("dotenv")
const menuRouter = require('./routes/menuRoute')
const restaurantRouter = require('./routes/restaurantRoute')
const cartRouter = require("./routes/cartRoute")
const authMiddleware = require("./middleware/authMiddleware")
const orderRouter = require("./routes/orderRoute")
const paymentRouter = require("./routes/paymentRoute")
const profileRouter = require('./routes/profileRoute')
const cors = require("cors");
const emailRouter = require("./routes/emailRoute");



dotenv.config();

connectDB()
const app = express()
app.use(cors({
    origin:" https://food-project-lac.vercel.app",
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}))


app.use(express.json())


app.use('/uploads', express.static('uploads'));



app.use("/api/user", userRouter)
app.use("/api", profileRouter)
app.use("/api/menu", menuRouter)
app.use("/api/restaurant", restaurantRouter);
app.use("/api/cart", cartRouter)
app.use("./api/order", orderRouter )
app.use("/api/payment", paymentRouter)
app.use("/api/email", emailRouter)





const port = process.env.PORT || 3000
app.listen(port, ()=> console.log(`You are listening on port ${port}`))