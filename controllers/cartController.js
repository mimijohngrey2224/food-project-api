const userModel = require('../models/user');
const Cart = require("../models/cart");
const Product = require("../models/menu");

const getCart = async (req, res) => {
  try {
    // For authenticated users
    if (req.user?.id) {
      const cart = await Cart.findOne({ user: req.user.id }).populate("menus.menu");
      if (!cart) {
        return res.json({ success: true, data: { menus: [] } }); // Return empty cart if none exists
      }
      return res.json({ success: true, data: cart });
    }
    // For anonymous users (if implemented)
    return res.json({ success: true, data: { menus: [] } });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  try {
    // Validate input
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    // Find product
    const menu = await Product.findById(productId);
    if (!menu) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, menus: [] });
    }

    // Check if product already in cart
    const existingItem = cart.menus.find(item => item.menu.toString() === productId);
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      existingItem.amount = menu.price * existingItem.quantity;
    } else {
      // Add new item
      cart.menus.push({
        menu: productId,
        quantity,
        amount: menu.price * quantity
      });
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Find item
    const itemIndex = cart.menus.findIndex(item => item.menu.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    // Find product for price
    const menu = await Product.findById(productId);
    if (!menu) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update or remove item
    if (quantity <= 0) {
      cart.menus.splice(itemIndex, 1); // Remove if quantity 0 or less
    } else {
      cart.menus[itemIndex].quantity = quantity;
      cart.menus[itemIndex].amount = menu.price * quantity;
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.menus = cart.menus.filter(item => item.menu.toString() !== productId);
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};

