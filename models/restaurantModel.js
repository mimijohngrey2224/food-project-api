const mongoose = require('mongoose')


const restaurantSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    menu: {
        type: Array,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    operating_hours: {
        type: Array,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    
    operating_days: {
        type: Array,
        required: true
    }
})



const restaurantModel = mongoose.model("restaurant", restaurantSchema)

module.exports = restaurantModel;