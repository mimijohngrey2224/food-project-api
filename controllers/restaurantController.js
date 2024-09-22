const restaurantModel = require("../models/restaurantModel.js");
const fs = require ('fs')


const addRestaurant = async (req, res) => {

    let image_filename = `${req.file.filename}`
     
    const restaurant = new restaurantModel({
     name: req.body.name,
     menu: req.body.menu,
     address:req.body.address,
     operating_hours: req.body.operating_hours,
     operating_days: req.body.operating_days,
     image: image_filename
    })
    try {
         await restaurant.save();
         res.json({success: true, message: "Restaurant Added"})
    } catch (error) {
         console.log(error);
         res.json({success: false, message: "Error"})
    }
 }


 const listRestaurant = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({});
        const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
        const restaurantsWithImages = restaurants.map(restaurant => ({
            ...restaurant.toObject(),
            image: baseUrl + restaurant.image // Construct the full URL
        }));
        res.json({ success: true, data: restaurantsWithImages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}



const removeRestaurant = async (req, res)=> {
        try {
            const restaurant = await restaurantModel.findById(req.body.id);
            fs.unlink(uploads/`${restaurant.image}`, ()=> {})

            await restaurantModel.findByIdAndDelete(req.body.id);
            res.json({success: true, message: "Restaurant Removed"})
        } catch (error) {
            console.log(error);
            res.json({success: false, message: "Error"});            
        }
}

module.exports = {addRestaurant, listRestaurant, removeRestaurant}