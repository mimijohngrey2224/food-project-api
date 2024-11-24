// const jwt = require('jsonwebtoken');
// // const userModel = require('../models/user'); // Uncomment and adjust if you need user info

// const authMiddleware = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     console.log('Authorization Header:', authHeader);

//     if (!authHeader) {
//         return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
//     }

//     const token = authHeader.split(' ')[1];
//     console.log('Extracted Token:', token);

//     if (!token) {
//         return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
//     }

//     try {
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = { id: token_decode._id }; // Populate req.user with user ID
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(401).json({ success: false, message: "Error. Invalid Token" });
//         console.log('JWT Secret:', process.env.JWT_SECRET);
//     }
// }

// module.exports = authMiddleware;

// new 8th oct where i stop
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
// const User = require('../models/User');  // Ensure this is correct

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', token_decode);  // Log the decoded token
        req.user = { id: token_decode._id }; // Populate req.user with user ID
        console.log('User ID from Token:', req.user.id);  // Log the user ID from token
        
        // Check if the user exists in the database
        const user = await userModel.findById(req.user.id);
        if (!user) {
            console.log('User not found in database. User ID:', req.user.id);  // Log if user is not found
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // User found, proceed to the next middleware
        next();
    } catch (error) {
        console.log('Error decoding token:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
        }
        res.status(401).json({ success: false, message: "Error. Invalid Token" });
    }
};

module.exports = authMiddleware;





// const jwt = require('jsonwebtoken');
// // const userModel = require('../models/user'); // Adjust the path as necessar


// const authMiddleware = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     console.log('Authorization Header:', authHeader); 
//     if (!authHeader) {
//         return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
//     }

//     const token = authHeader.split(' ')[1]; //Added this to extract the token after 'Bearer' after the headache from bad:auth msg
//     console.log('Extracted Token:', token); 
//     if (!token) {
//         return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
//     }

//     try {
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = token_decode._id;
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(401).json({ success: false, message: "Error. Invalid Token" });
//         console.log('JWT Secret:', process.env.JWT_SECRET);
        
//     }
// }

// module.exports = authMiddleware;
