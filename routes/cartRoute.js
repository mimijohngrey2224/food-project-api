const express = require('express')
const { addToCart, deleteFromCart, getCart, removeFromCart, syncCartItems} = require('../controllers/cartController')
const authMiddleware = require("../middleware/authMiddleware")


const cartRouter = express.Router();

cartRouter.post('/add', authMiddleware, addToCart);
cartRouter.post("/sync", authMiddleware, syncCartItems)
cartRouter.delete('/delete', authMiddleware, deleteFromCart);
cartRouter.get('/get', authMiddleware, getCart);
cartRouter.post('/remove', authMiddleware, removeFromCart);

module.exports = cartRouter;