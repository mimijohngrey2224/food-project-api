const mongoose = require('mongoose')



const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
}, {_id: false});


const orderSchema = new mongoose.Schema({
    // userId: {
    //     type: String,
    //     require: true
    // },
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    orderId: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    phone: { type: String},
    transactionId: {type: String, required: true},
    // items: {
    //     type: Array,
    //     required: true
    // },
    menus: [{
        menu: {type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true},
        quantity: {type: Number, required: true}
    }],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    },
    status: {
        type: String,
        default: "Order Processing"
    },
    date: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: false
    }
        
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

module.exports = orderModel