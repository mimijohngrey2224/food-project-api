const mongoose = require("mongoose");
// const menu = require("./menu");

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    anonymousId: { type: String },
    menus: [
        {
            menu: { type: mongoose.Schema.Types. ObjectId, ref: "Menu"},
            quantity: { type: Number, required: true, min: 1 },
            amount: { type: Number, required: true },
        },
    ],
});

module.exports = mongoose.model("Cart", cartSchema);