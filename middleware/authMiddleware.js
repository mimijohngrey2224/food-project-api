// const jwt = require("jsonwebtoken");

// const authMiddleware = async (req, res, next) => {
//   const token = req.headers.authorization; // Assuming token is passed as "Bearer <token>"
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Unauthorized, Please Login Again" });
//   }

//   try {
//     const tokenDecode = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Splitting token to get actual token part
//     req.user = { id: tokenDecode.id }; // Assuming your token has user ID in 'id' field
//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return res.status(401).json({ success: false, message: "Token verification failed" });
//   }
// };

// module.exports = authMiddleware;


const jwt = require('jsonwebtoken');
// const userModel = require('../models/user'); // Adjust the path as necessar


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader); 
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
    }

    const token = authHeader.split(' ')[1]; //Added this to extract the token after 'Bearer' after the headache from bad:auth msg
    console.log('Extracted Token:', token); 
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Error. Invalid Token" });
        console.log('JWT Secret:', process.env.JWT_SECRET);
        
    }
}

module.exports = authMiddleware;
