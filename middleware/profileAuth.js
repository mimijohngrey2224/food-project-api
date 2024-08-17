// const jwt = require('jsonwebtoken')
// const userModel = require('../models/user')

// const profileAuth = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await userModel.findById(decoded.id);
//         if (!user) {
//             return res.status(401).json({ success: false, message: "User not found" });
//         }
//         req.user = user;           
//         next();
//     } catch (error) {
//         console.error(error);
//         res.status(401).json({ success: false, message: "Error. Invalid Token" });
//     }
// };

// module.exports = profileAuth;

const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const profileAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log the decoded token for verification
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Token Verification Error:', error); // Log detailed error information
        res.status(401).json({ success: false, message: "Error. Invalid Token" });
    }
};

module.exports = profileAuth;
