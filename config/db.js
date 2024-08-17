const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB...");
    } catch (error) {
        console.log("Could not establish a connection", error);
    }

}

const crypto = require('crypto');

const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString('hex'); // Generate 32 bytes of random data and convert to hex string
};

console.log(generateJWTSecret());


module.exports = connectDB