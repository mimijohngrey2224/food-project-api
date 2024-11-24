// const {v4: uuidv4} = require("uuid")

// const handlerAnonymousCart = (req, res, next)=>{
//     if (!req.cookies.cartId) {
//         const cartId = uuidv4()
//         res.cookie("cartId", cartId, {expires: new Date.now() + 30 * 24 * 60* 60* 1000})
//         req.cartId = cartId
//     }else{
//         req.cartId = req.cookes.cartId
//     }

//     next();
// };

// module.exports = handlerAnonymousCart