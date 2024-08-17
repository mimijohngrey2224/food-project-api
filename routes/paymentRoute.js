const express  = require("express");
const authMiddleware = require("../middleware/authMiddleware")
const { initiatePayment, verifyPayment } = require("../controllers/paymentController")

const paymentRouter = express.Router();

paymentRouter.post("/initiate", authMiddleware, initiatePayment)
paymentRouter.get("/verify", authMiddleware, verifyPayment)

module.exports = paymentRouter
