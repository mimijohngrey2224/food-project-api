const userModel = require('../models/user');


const addToCart = async(req, res) =>{
    try {
                                                     
        let userData = await userModel.findOne({_id: req.body.userId});
        let cartData = await userData.cartData;
        if (!cartData [req.body.itemId]) {

            cartData[req.body.itemId] = 1;
        }
        else{
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message: "Added To Cart"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}


const removeFromCart = async (req, res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;

        if (cartData [req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message:"Removed From Cart"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message:"Error"})
    }

}


const deleteFromCart = async (req, res) => {
    try {
        
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Extract the cart data
        let cartData = userData.cartData;

        // Check if the item exists in the cart
        if (cartData[req.body.itemId] > 0) {
            // Remove the item from the cart
            delete cartData[req.body.itemId];
            
            // Update the user's cart in the database
            await userModel.findByIdAndUpdate(req.body.userId, { cartData });
            res.json({ success: true, message: "Removed from cart" });
        } else {
            res.json({ success: false, message: "Item not found in cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing item from cart" });
    }
}



const getCart = async (req, res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success: true, cartData})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

const syncCartItems = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let serverCart = userData.cartData || {};

        for (const itemId in cartItems) {
            if (cartItems.hasOwnProperty(itemId)) {
                serverCart[itemId] = (serverCart[itemId] || 0) + cartItems[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData: serverCart });
        res.json({ success: true, cartData: serverCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error syncing cart items" });
    }
};






module.exports = { addToCart, deleteFromCart, getCart, removeFromCart, syncCartItems };
