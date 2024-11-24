// old 6 november
// const jwt = require('jsonwebtoken');
// const userModel = require('../models/user');

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
//         console.log('Decoded Token:', decoded); // Log the decoded token for verification
//         const user = await userModel.findById(decoded.id);
//         if (!user) {
//             return res.status(401).json({ success: false, message: "User not found" });
//         }
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Token Verification Error:', error); // Log detailed error information
//         res.status(401).json({ success: false, message: "Error. Invalid Token" });
//     }
// };

// module.exports = profileAuth;


// handling expired token

const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const profileAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
    }

    const token = authHeader.split(' ')[1];  // Get the token part from the Authorization header
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log the decoded token for verification

        // Fetch the user based on the decoded ID
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;  // Attach the user object to the request
        next();  // Continue to the next middleware or route handler
    } catch (error) {
        console.error('Token Verification Error:', error); // Log detailed error information

        // Handle specific error for expired token
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }

        // For any other token-related errors (invalid signature, etc.)
        return res.status(401).json({ success: false, message: "Error. Invalid Token" });
    }
};

module.exports = profileAuth;

// In your login endpoint
// const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });  // Short expiration
// const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });  // Longer expiration

// // Send both tokens to the client
// res.json({ accessToken, refreshToken });
// // Refresh token endpoint
// app.post('/refresh-token', (req, res) => {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//         return res.status(403).json({ success: false, message: "Refresh token is required" });
//     }

//     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ success: false, message: "Invalid refresh token" });
//         }

//         const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.json({ accessToken: newAccessToken });
//     });
// });





// 1st november new update
// const jwt = require('jsonwebtoken');
// const userModel = require('../models/user');

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
//         console.log('Decoded Token:', decoded); // Log the decoded token for verification
//         const user = await userModel.findById(decoded.id);
//         if (!user) {
//             return res.status(401).json({ success: false, message: "User not found" });
//         }
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Token Verification Error:', error); // Log detailed error information
//         res.status(401).json({ success: false, message: "Error. Invalid Token" });
//     }
// };

// module.exports = profileAuth;

// 1st november with expiring alert message
// const jwt = require('jsonwebtoken');
// const userModel = require('../models/user');

// const profileAuth = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ success: false, message: "Not Authorized. Token not found." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded Token:', decoded);

//         const user = await userModel.findById(decoded.id);
//         if (!user) {
//             return res.status(401).json({ success: false, message: "User not found" });
//         }
        
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Token Verification Error:', error);
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
//         }
//         return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
//     }
// };

// module.exports = profileAuth;
