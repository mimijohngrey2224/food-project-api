const express = require('express')
const { addToCart, updateQuantity, getCart, removeFromCart } = require('../controllers/cartController')
const authMiddleware = require("../middleware/authMiddleware")


const cartRouter = express.Router();

cartRouter.post('/api/add-to-cart', authMiddleware, addToCart);
// cartRouter.post("/sync", authMiddleware, syncCartItems)
cartRouter.get('/api/carts', authMiddleware, getCart);
cartRouter.put('/api/update-cart', authMiddleware, updateQuantity);
cartRouter.delete('/api/delete-cart', authMiddleware, removeFromCart);


module.exports = cartRouter;