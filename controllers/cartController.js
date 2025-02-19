const userModel = require('../models/user');
const Cart = require("../models/cart");
const Product = require("../models/menu")

// const addToCart = async(req, res) =>{
//     try {
                                                     
//         let userData = await userModel.findOne({_id: req.body.userId});
//         let cartData = await userData.cartData;
//         if (!cartData [req.body.itemId]) {

//             cartData[req.body.itemId] = 1;
//         }
//         else{
//             cartData[req.body.itemId] += 1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId, {cartData});
//         res.json({success: true, message: "Added To Cart"});
        
//         await Cart.save(); // i added this 18th november
//         res.json(Cart) // and this also 18th november
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: "Error"})
//     }
    
// }


// old one to test new 21 november
// const addToCart = async (req, res) => {     //testing upadted codes 18th november
//   try {
//     const { productId, quantity } = req.body;

//     // Validate input
//     if ( !productId || typeof quantity !== "number" || quantity <= 0) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });   
      
//     }
//     // Add to cart logic here
//     res.status(200).json({ success: true, message: "Item added to cart" });
    
//     // Find the user by ID
//     const user = await userModel.findById(productId);
//     if (!productId) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Initialize or update the cart
//     let cart = user.cart || []; // Assuming cart is an array in the user model

//     const itemIndex = cart.findIndex((item) => item.productId === productId);

//     if (itemIndex >= 0) {
//       // Update quantity if product exists in the cart
//       cart[itemIndex].quantity += quantity;
//     } else {
//       // Add new product to cart
//       cart.push({ productId, quantity });
//     }

//     // Save the updated user cart
//     user.cart = cart;
//     await user.save();

//     res.status(200).json({ success: true, cart });
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }

//   // const UserSchema = new mongoose.Schema({
//   //   // Other fields...
//   //   cart: [
//   //     {
//   //       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//   //       quantity: { type: Number, default: 1 },
//   //     },
//   //   ],
//   // });
  
// };

// now 21 november to test the guest logic and the authenticated user 22 november
// const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     // Validate input
//     if (!productId || typeof quantity !== "number" || quantity <= 0) {
//       return res.status(400).json({ success: false, message: "Invalid input. Product ID and quantity are required." });
//     }

//     // Retrieve the authenticated user (assuming user ID is available in req.user)
//     const userId = req.user.id;
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     // Initialize or retrieve user's cart
//     let cart = Array.isArray(user.cart) ? user.cart : [];

//     // Check if the product already exists in the cart
//     const itemIndex = cart.findIndex((item) => item.productId.toString() === productId);

//     if (itemIndex >= 0) {
//       // Update quantity if product already exists
//       cart[itemIndex].quantity += quantity;
//     } else {
//       // Add new product to the cart
//       cart.push({ productId, quantity });
//     }

//     // Save the updated cart to the user document
//     user.cart = cart;
//     await user.save();

//     // Respond with the updated cart
//     res.status(200).json({ success: true, cart });
//   } catch (error) {
//     console.error("Error adding to cart:", error.message);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// };

const addToCart = async (req, res) => {
  console.log("recieving request")
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input. Product ID and quantity are required." });
    }
    

    // Retrieve the authenticated user (assuming user ID is available in req.user)
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Initialize or retrieve user's cart
    let cart = Array.isArray(user.cart) ? user.cart : [];

    // Check if the product already exists in the cart
    const itemIndex = cart.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex >= 0) {
      // Update quantity if product already exists
      cart[itemIndex].quantity += quantity;
    } else {
      // Add new product to the cart
      cart.push({ productId, quantity });
    }

    // Save the updated cart to the user document
    user.cart = cart;
    await user.save();

    // Respond with the updated cart
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};





// exports.addToCart = async (req, res) => {    //this method will give access to anonymousId to add to cart, and also authenticated user
//   const { productId, quantity } = req.body;
//   const userId = req.user ? req.user.id : null;
//   const cartId = req.cartId;

//   try {
//       let cart;
//       if (userId) {
//           cart = (await Cart.findOne({ user: userId })) || (await Cart.findOne({ anonymousId: cartId }));
//       }else {
//           cart = await Cart.findOne({ anonymousId: cartId});

//       }

//       if (!cart) {
//           cart = new Cart({ user: userId, anonymousId: userId ? null : cartId});
//       }

//       const productExist = cart.products.find((item) => item.product.toString() === productId);

//       if (productExist) {
//           productExist.quantity += quantity; productExist.amount = await CalculateAmount(productId, quantity);

//       } else {
//           const amount = await CalculateAmount(productId, quantity);
//           cart.products.push({ product: productId, quantity, amount });
//       }

//       await cart.save();
//       res.json(cart);
//   } catch (error) {
//       console.log(error);
//       res.json({ error: error.message });

//   }
// };

// const removeFromCart = async (req, res)=>{
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;

//         if (cartData [req.body.itemId] > 0) {
//             cartData[req.body.itemId] -= 1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId, {cartData});
//         res.json({success: true, message:"Removed From Cart"})
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message:"Error"})
//     }

// }


// const deleteFromCart = async (req, res) => {
//     try {
        
//         let userData = await userModel.findById(req.body.userId);
//         if (!userData) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // Extract the cart data
//         let cartData = userData.cartData;

//         // Check if the item exists in the cart
//         if (cartData[req.body.itemId] > 0) {
//             // Remove the item from the cart
//             delete cartData[req.body.itemId];
            
//             // Update the user's cart in the database
//             await userModel.findByIdAndUpdate(req.body.userId, { cartData });
//             res.json({ success: true, message: "Removed from cart" });
//         } else {
//             res.json({ success: false, message: "Item not found in cart" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Error removing item from cart" });
//     }
// }



// const getCart = async (req, res)=>{
//     try {
//         console.log("userId",req.body.userId)
//         // let userData = await userModel.findById(req.body.userId);
//         // Find the user by userId
//         let userData = await userModel.findById(req.body.userId).lean();
//         const cartDatas = userData.cartData;
//         console.log("Cart data:", cartDatas);
//         res.json({success: true, cartDatas})
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: "Error"})
//     }
// }

// const syncCartItems = async (req, res) => {
//     try {
//         const { userId, cartItems } = req.body;
//         const userData = await userModel.findById(userId);
//         if (!userData) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         let serverCart = userData.cartData || {};

//         for (const itemId in cartItems) {
//             if (cartItems.hasOwnProperty(itemId)) {
//                 serverCart[itemId] = (serverCart[itemId] || 0) + cartItems[itemId];
//             }
//         }

//         await userModel.findByIdAndUpdate(userId, { cartData: serverCart });
//         res.json({ success: true, cartData: serverCart });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Error syncing cart items" });
//     }
// };




// class work
const addToCarts = async (req, res) => {
    const { productId, quantity } = req.body;
    console.log("running 1")
    try {
        console.log("UserId", req.user.id);
      let cart = await Cart.findOne({ user: req.user.id });
  
      console.log("running 2")
      if (!cart) {
        cart = new Cart({ user: req.user.id, menus: [] });
      }
  
      const menu = await Product.findById(productId);
      if (!menu) {
        return res.status(400).json("Product not found");
      }
  
      const menuIndex = cart.menus.findIndex(
        (item) => item.menu.toString() === productId
      );
  
      if (menuIndex !== -1) {
        cart.menus[menuIndex].quantity += quantity;
        cart.menus[menuIndex].amount =
          menu.price * cart.menus[menuIndex].quantity;
      } else {
        cart.menus.push({
          menu: productId,
          quantity,
          amount: menu.price * quantity,
        });
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.json(error.message);
    }
  };

  
  const getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id }).populate(
        "menus.menu"
      );
      if (!cart) {
        return res.json({ success: false, message: "Cart not found"});
      }
  
      console.log(cart)
      return res.json({ success: true, message: "users cart", data: cart});
    } catch (error) {
      res.json("Server Error", error);
    }
  };

  const updateQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
  
    try {
      // Find the cart associated with the user
      const cart = await Cart.findOne({ user: req.user.id }).populate("menus.menu");
  
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
      }
  
      // Find the cart item based on the productId
      const cartItem = cart.menus.find((item) => item.menu._id.toString() === productId);
      console.log("first", cartItem)
      // Find the product in the Product collection
      const menu = await Product.findById(productId);
  
      if (!menu) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      // If the item is found in the cart, update its quantity and amount
      if (cartItem) {
        cartItem.quantity += quantity;
        if (cartItem.quantity <= 0) {
          cart.menus = cart.menus.filter(item => item.menu._id.toString() !== productId); // Remove the item if quantity is zero or negative
        } else {
          cartItem.amount = menu.price * cartItem.quantity; // Update the amount based on the new quantity
        }
        // cartItem.quantity = quantity;
        // cartItem.amount = menu.price * cartItem.quantity;
  
        // Save the updated cart
        await cart.save();
  
        // Return the updated cart item (and optionally the entire updated cart)
        return res.status(200).json({
          success: true,
          message: "Cart updated successfully",
          data: cartItem,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Product not found in the cart",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  
  // const updateQuantity = async (req, res) => { 
  //   const { productId, quantity } = req.body;
  //   try {
  //     const cart = await Cart.findOne({ user: req.user.id }).populate(
  //       "menus.menu"
  //     );;
  //     const cartItem = cart.menus.find(
  //       (item) => item.menu.toString() === productId
  //     );
  //     const menu = await Product.findById(productId);
  //     if(!menu) return res.status(404).json({success: false, message: "Product not found"});
  //     // console.log(menu)
  
  //     if (cartItem) {
  //       cartItem.quantity = quantity;
  //       cartItem.amount = menu.price * cartItem.quantity;
  //       await cart.save().populate(
  //         "menus.menu"
  //       );
  //       return res.status(200).json({ success: true, message: "cart updated successfully", data: cartItem});
  //     } 
  //   } catch (error) {
  //     return res.status(500).json({ success: false, message: "internal server error"});
  //   }
  // };

  // const updatedCart = await Cart.findOne({ user: req.user.id }).populate(
        //   "menus.menu"
        // );
  
  const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
      const cart = await Cart.findOne({ user: req.user.id });
      cart.menus = cart.menus.filter(
        (item) => item.menu.toString() !== productId
      );
      await cart.save();
      const updatedProduct = await Cart.findOne({ user: req.user.id }).populate(
        "menus.menu"
      );
      res.json(updatedProduct);
    } catch (error) {
      res.json("server error");
    }
  };



module.exports = { addToCart,addToCarts, updateQuantity, getCart, removeFromCart };




  
