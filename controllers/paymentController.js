const { v4: uuidv4 } = require("uuid");
const userModel = require("../models/user");
const orderModel = require("../models/order");
const Cart = require("../models/cart")
const fetch = require("node-fetch");
const cart = require("../models/cart");

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
// const frontend_URI = "https://food-project-lac.vercel.app";
const frontend_URI = "https://food-project-lac.vercel.app";

exports.initiatePayment = async (req, res) => {
  const { user } = req;
  const { amount, currency, firstName, lastName, phone, address, email } = req.body;

  console.log('Received payment initiation request:', req.body);

  // Check if cart data is empty
  // if (!cart || cart.length === 0) {
  //   return res.json({ success: false, error: "Your cart is empty" });
  // }

  try {
    const orderId = uuidv4();

    // Make sure to include the email in the customer field
    const paymentData = {
      tx_ref: orderId,
      amount,
      currency,
      email,
      redirect_url: `${frontend_URI}/thanks`,
      customer: {
        email: email, // Ensure email is correctly assigned here
        name: `${firstName} ${lastName}`,
      },
      meta: {
        firstName,
        lastName,
        phone,
        email,
        address,
      },
      customizations: {
        title: "Food Delivery",
        description: "Payment for items in cart",
      },
    };

    console.log('Payment data being sent to Flutterwave:', paymentData);

    const response = await fetch("https://api.flutterwave.com/v3/payments/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    console.log('Response from Flutterwave:', data);

    if (data.status === "success") {
      console.log('Sending successful response to frontend:', { link: data.data.link, orderId });
      res.json({ link: data.data.link, orderId });
    } else {
      console.log('Sending error response to frontend:', { error: data.message || "Failed to initiate payment" });
      res.json({  error: data.message || "Failed to initiate payment" });
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


// exports.verifyPayment = async (req, res) => {
//   const { userId } = req;
//   const { transaction_id, orderId } = req.body;
  
//   console.log(userId)
//   try {
//     const response = await fetch(
//       `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${FLW_SECRET_KEY}`,
//         },
//       }
//     );

//     const data = await response.json();
//     if (data.status === "success") {
//       const cart = await orderModel.findOne({ userId: req.user.id }).populate("menus.menu", "user");
//       console.log(cart)


//       const order = new orderModel({
//         user: req.user.id,
//         orderId,
//         firstName: data.data.meta.firstName,
//         lastName: data.data.meta.lastName,
//         phone: data.data.meta.phone,
//         address: data.data.meta.address,
//         menus: cart.menus,
//         amount: data.data.amount,
//         status: "completed",
//         transactionId: transaction_id,
//       });

//       await order.save();
//       console.log("order",order)
//       // await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });
//       await Cart.findOneAndDelete({ user: req.user.id });

//       console.log(order)
//       return res.json({ msg: "Payment Successful", order });
//     } else {
//       return res.json({ error: "Payment verification failed" });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


exports.verifyPayment = async (req, res) => {
  const { userId } = req;
  const { transaction_id, orderId } = req.body;
  
  console.log(userId);
  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    console.log("data", data)
    console.log("response", response)
    if (data.status === "success") {
      const cart = await Cart
        .findOne({ user: req.user.id })
        .populate("menus.menu")  // Populate the menu name and price, or any fields you need
        .populate("user"); // Populate user details like name, email, phone

      console.log("My user cart", cart);

      const order = new orderModel({
        user: req.user.id,
        orderId,
        firstName: data.data.meta.firstName,
        lastName: data.data.meta.lastName,
        phone: data.data.meta.phone,
        address: data.data.meta.address,
        menus: cart.menus,
        amount: data.data.amount,
        status: "completed",
        transactionId: transaction_id,
      });

      console.log("Cart menu", cart.menus)

      console.log("Order", order)

      const neworder = await order.save();
      console.log("order main", neworder);

      // Remove the cart data after order completion
      await Cart.findOneAndDelete({ user: req.user.id });

      console.log(neworder);
      return res.json({ msg: "Payment Successful", order });
    } else {
      return res.json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Server error" });
  }
};
