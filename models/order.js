const mongoose = require('mongoose')



const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
}, {_id: false});


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    phone: { type: String},
    items: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: addressSchema
    },
    status: {
        type: String,
        default: "Order Processing"
    },
    date: {
        type: Date,
        default: Date.now()
    },
    payment: {
        type: Boolean,
        default: false
    }
        
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

module.exports = orderModel