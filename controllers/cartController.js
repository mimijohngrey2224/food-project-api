// const userModel = require('../models/user');

// // Helper function to ensure cartData is initialized
// const initializeCartData = (cartData) => {
//   return cartData || []; // Ensure cartData is an array
// };

// const addToCart = async (req, res) => {
//   try {
//     const { userId, itemId } = req.body;
    
//     // Check if user exists
//     const userData = await userModel.findById(userId);
//     if (!userData) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
    
//     let cartData = initializeCartData(userData.cartData);
    
//     // Update cart data
//     if (!cartData[itemId]) {
//       cartData[itemId] = 1;
//     } else {
//       cartData[itemId] += 1;
//     }
    
//     // Save updated cart data
//     await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
//     res.json({ success: true, message: 'Added to cart' });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: 'Error' });
//   }
// };

// const deleteFromCart = async (req, res) => {
//   try {
//     const { userId, itemId } = req.body;
    
//     // Check if user exists
//     const userData = await userModel.findById(userId);
//     if (!userData) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
    
//     let cartData = initializeCartData(userData.cartData);
    
//     // Update cart data
//     if (cartData[itemId] > 0) {
//       cartData[itemId] -= 1;
      
//       // Remove item if quantity is zero
//       if (cartData[itemId] === 0) {
//         delete cartData[itemId];
//       }
      
//       // Save updated cart data
//       await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
//       res.json({ success: true, message: 'Deleted from cart' });
//     } else {
//       res.status(400).json({ success: false, message: 'Item not in cart' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: 'Error' });
//   }
// };

// const showCart = async (req, res) => {
//   try {
//     const { userId } = req.body;
    
//     // Check if user exists
//     const userData = await userModel.findById(userId);
//     if (!userData) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
    
//     let cartData = initializeCartData(userData.cartData);
//     res.json({ success: true, cartData });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: 'Error' });
//   }
// };

// module.exports = { addToCart, deleteFromCart, showCart };



// const { ObjectId } = require('mongoose').Types;

// // Helper function to ensure cartData is initialized
// const initializeCartData = (cartData) => {
//   return cartData || []; // Initialize cartData as an object
// };

// // Function to check if a string is a valid MongoDB ObjectId
// const isValidObjectId = (id) => {
//   return ObjectId.isValid(id);
// };

// const addToCart = async (req, res) => {
//   try {
//     const { userId, itemId } = req.body;

//     // Validate ObjectId
//     if (!isValidObjectId(userId)) {
//       return res.status(400).json({ success: false, message: 'Invalid user ID' });
//     }

//     // Check if user exists
//     const userData = await userModel.findById(userId);
//     if (!userData) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     let cartData = initializeCartData(userData.cartData);

//     // Update cart data
//     if (!cartData[itemId]) {
//       cartData[itemId] = 1;
//     } else {
//       cartData[itemId] += 1;
//     }

//     // Save updated cart data
//     await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
//     res.json({ success: true, message: 'Item added to cart' });
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

// const deleteFromCart = async (req, res) => {
//   try {
//     const { userId, itemId } = req.body;

//     // Validate ObjectId
//     if (!isValidObjectId(userId)) {
//       return res.status(400).json({ success: false, message: 'Invalid user ID' });
//     }

//     // Check if user exists
//     const userData = await userModel.findById(userId);
//     if (!userData) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     let cartData = initializeCartData(userData.cartData);

//     // Update cart data
//     if (cartData[itemId] > 0) {
//       cartData[itemId] -= 1;

//       // Remove item if quantity is zero
//       if (cartData[itemId] === 0) {
//         delete cartData[itemId];
//       }

//       // Save updated cart data
//       await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
//       res.json({ success: true, message: 'Item removed from cart' });
//     } else {
//       res.status(400).json({ success: false, message: 'Item not in cart' });
//     }
//   } catch (error) {
//     console.error('Error deleting from cart:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

// const showCart = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // Validate ObjectId
//     if (!isValidObjectId(userId)) {
//       return res.status(400).json({ success: false, message: 'Invalid user ID' });
//     }

//     // Check if user exists
//     const userData = await userModel.findById(userId);
//     if (!userData) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     let cartData = initializeCartData(userData.cartData);
//     res.json({ success: true, cartData });
//   } catch (error) {
//     console.error('Error showing cart:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

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
