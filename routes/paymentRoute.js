const express  = require("express");
const authMiddleware = require("../middleware/authMiddleware")
const { initiatePayment, verifyPayment } = require("../controllers/paymentController")

const paymentRouter = express.Router();

// paymentRouter.post("/initiate", authMiddleware, initiatePayment);
paymentRouter.post("/api/payment/initiate", authMiddleware, initiatePayment); //testing december 3rd

paymentRouter.post("/api/payment/verify", authMiddleware, verifyPayment);

module.exports = paymentRouter
