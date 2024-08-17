const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const userModel= require("../models/user")
const orderModel = require("../models/order")


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


const placeOrder = async (req, res) =>{
    try {
        const { customerData, items, amount, address } = req.boby;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const newOrder = new orderModel({
            userId: userId,
            items,
            amount,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email,
            phone: customerData.phone,
            address,

        })
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({sucess: true, order: newOrder})

    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Server Error"})
    }
}

const userOrders = async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log("Fetching orders for user ID", req.body.userId);
        const orders = await orderModel.find({userId})
        res.json({success: true, data: orders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}


module.exports = {placeOrder, userOrders}