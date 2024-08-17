const menuModel = require("../models/menu")
const fs = require('fs')



const addMenu = async (req, res) => {


    const menu = new menuModel ({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        featured: req.body.featured,
        breakfast: req.body.breakfast,
        naija: req.body.naija,
        salad: req.body.salad,
        signature: req.body.signature,
        img: req.file.filename
    })
    try {
        await menu.save();
        res.json({success: true, message: 'Menu Included'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Error'})
    }
}

const listMenu = async (req, res) => {

    try {
        const menus = await menuModel.find({});
        res.json({success: true, data: menus})
    } catch (error) {
       console.log(error); 
       res.json({success: false, message: 'Error'})
    }
}


const deleteMenu = async (req, res) => {
    try {
        // Find the menu item by ID
        const menu = await menuModel.findById(req.body.id);

        // Check if menu item exists
        if (!menu) {
            return res.json({ success: false, message: 'Menu item not found' });
        }

        // Remove the image file associated with the menu item
        if (menu.img) {
            fs.unlink(`uploads/${menu.img}`, (err) => {
                if (err) {
                    console.log('Error deleting image:', err);
                    return res.json({ success: false, message: 'Error deleting image' });
                }
            });
        }

        // Delete the menu item
        await menuModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: 'Menu item deleted successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error deleting menu item' });
    }
}



// const deleteMenu = async (req, res) => {
//     try {
//        const menu = await menuModel.findById(req.body.id);
//        fs.unlink(`uploads/${menu.img}`, ()=> {})

//        await menuModel.findByIdAndDelete(req.body.id);
//        res.json({success: true, message: 'Menu Delete'})
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: 'Error'})
//     }
// }

const featuredMenu = async(req, res)=>{
    try {
        const featured = await menuModel.find({featured: true})
        res.json({ success: true, data: featured})
    } catch (error) {
        res.json({message: error.message})
    }
}

const breakfastMenu = async(req, res)=>{
    try {
        const breakfast = await menuModel.find({breakfast: true}).exec();
        res.json({ success: true, data: breakfast})
    } catch (error) {
        res.json({message: error.message})
    }
}
const naijaMenu = async(req, res)=>{
    try {
        const naija = await menuModel.find({naija: true})
        res.json({ success: true, data: naija})
    } catch (error) {
        res.json({message: error.message})
    }
}
const saladMenu = async(req, res)=>{
    try {
        const salad = await menuModel.find({salad: true})
        res.json({ success: true, data: salad})
    } catch (error) {
        res.json({message: error.message})
    }
}
const signatureMenu = async(req, res)=>{
    try {
        const signature = await menuModel.find({signature: true})
        res.json({ success: true, data: signature})
    } catch (error) {
        res.json({message: error.message})
    }
}
module.exports = 
                    {addMenu,
                    listMenu,
                    deleteMenu,
                    featuredMenu,
                    breakfastMenu,
                    naijaMenu,
                    saladMenu,
                    signatureMenu}