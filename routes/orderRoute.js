const express = require('express')
const { placeOrder, userOrders } = require("../controllers/orderController")
const authMiddleware = require("../middleware/authMiddleware")


const orderRouter = express.Router();

orderRouter.post("/place-order", authMiddleware, placeOrder )
orderRouter.post("/user-order", authMiddleware, userOrders )


module.exports = orderRouter;