// 

const { v4: uuidv4 } = require('uuid');
const Cart = require('../models/cart');
const Order = require('../models/order');
const fetch = require('node-fetch');

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

exports.initiatePayment = async (req, res) => {
  try {
    const { amount, currency, firstName, lastName, phone, email, address, cart } = req.body;
    
    // Validate input
    if (!amount || !email || !phone || !cart?.menus?.length) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields or empty cart"
      });
    }

    const orderId = uuidv4();
    const paymentData = {
      tx_ref: orderId,
      amount,
      currency: currency || "NGN",
      email,
      phone_number: phone,
      redirect_url: `${process.env.FRONTEND_URL}/thanks`,
      customer: {
        email,
        phonenumber: phone,
        name: `${firstName} ${lastName}`,
      },
      customizations: {
        title: "Food Order Payment",
        description: `Payment for ${cart.menus.length} items`,
      },
      meta: {
        firstName,
        lastName,
        phone,
        email,
        address,
        userId: req.user.id,
        cartId: cart._id
      }
    };

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();

    if (data.status === "success") {
      res.json({
        success: true,
        link: data.data.link,
        orderId
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.message || "Payment initiation failed"
      });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const { transaction_id, orderId } = req.body;
    
    // Validate required fields
    if (!transaction_id || !orderId) {
      return res.status(400).json({
        success: false,
        error: "Transaction ID and Order ID are required"
      });
    }

    // Check if order already exists with this transaction ID or order ID
    const existingOrder = await Order.findOne({ 
      $or: [
        { transactionId: transaction_id },
        { orderId: orderId }
      ]
    }).populate('menus.menu'); // Populate here as well for consistency

    if (existingOrder) {
      return res.json({
        success: true,
        order: existingOrder,
        message: "Order already exists"
      });
    }

    // Verify with Flutterwave
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` }
      }
    );

    const verificationData = await response.json();

    if (verificationData.status !== "success") {
      return res.status(400).json({
        success: false,
        error: "Payment verification failed"
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("menus.menu")
      .populate("user");

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found"
      });
    }

    // Create order (don't chain populate here - it won't work)
    const order = new Order({
      user: req.user.id,
      orderId,
      firstName: verificationData.data.customer.name.split(" ")[0],
      lastName: verificationData.data.customer.name.split(" ")[1] || "",
      phone: verificationData.data.customer.phone_number,
      email: verificationData.data.customer.email,
      address: verificationData.data.meta.address,
      menus: cart.menus.map(item => ({
        menu: item.menu._id,
        quantity: item.quantity
      })),
      amount: verificationData.data.amount,
      status: "processing",
      transactionId: transaction_id,
      paid: true
    });

    // Save with duplicate check
    try {
      const savedOrder = await order.save();
      
      // Now populate the saved order
      const populatedOrder = await Order.findById(savedOrder._id)
        .populate('menus.menu')
        .populate('user');

      // Clear cart only after successful order creation
      await Cart.deleteOne({ _id: cart._id });

      res.json({
        success: true,
        order: populatedOrder,
        message: "Payment verified and order created successfully"
      });

    } catch (err) {
      if (err.code === 11000) { // MongoDB duplicate key error
        const existing = await Order.findOne({ orderId }).populate('menus.menu');
        return res.json({
          success: true,
          order: existing,
          message: "Order already exists"
        });
      }
      throw err;
    }

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};