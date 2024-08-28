const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
    },
    cartData: {
        type: Array,
        default: []
    },
}, { minimize: false });

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
