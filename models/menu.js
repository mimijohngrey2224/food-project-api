const mongoose = require("mongoose");


const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    featured: {type: Boolean, default: false},
    breakfast: {type: Boolean, default: false},
    naija: {type: Boolean, default: false},
    salad: {type: Boolean, default: false},
    signature: {type: Boolean, default: false},
})

const menuModel = mongoose.model("Menu", menuSchema)

module.exports = menuModel;