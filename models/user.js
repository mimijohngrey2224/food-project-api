const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")

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
    image: {
        type: String,  default: '/uploads/1723385268377_avensis.jpg'
    },
    address: {
        // type: String, maxLength: 255
        city: String,
        street: String,
        state: String,
        country: String,
    },
    verificationToken: {type: String},
    isVerified: {type: Boolean, default: false},
    cartData: {
        type: Array,
        default: []
    },
}, { minimize: false });


// userSchema.methods.generateToken = function () {
//     const token = jwt.sign({
//         id: this._id,
//     }, process.env.JWT_SECRET)
//     return token;
// }

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
