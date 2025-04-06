const express = require('express')
const { addToCart,  updateCartItem, getCart, removeFromCart } = require('../controllers/cartController')
const authMiddleware = require("../middleware/authMiddleware")


const cartRouter = express.Router();

cartRouter.post('/api/add-to-cart', authMiddleware, addToCart);
cartRouter.get('/api/carts', authMiddleware, getCart);
cartRouter.put('/api/update-cart', authMiddleware, updateCartItem);
cartRouter.delete('/api/delete-cart', authMiddleware, removeFromCart);




module.exports = cartRouter;