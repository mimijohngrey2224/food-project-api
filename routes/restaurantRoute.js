const express = require ('express')
const { addRestaurant, removeRestaurant, listRestaurant } = require ('../controllers/restaurantController')
const multer = require ('multer')

const restaurantRouter = express.Router();


const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()} ${file.originalname}`)
    }
})

const upload = multer({storage:storage})

restaurantRouter.post("/adds", upload.single("image"), (req, res, next) => {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);
    next();
  }, addRestaurant);
restaurantRouter.get("/list", listRestaurant)
restaurantRouter.delete("/remove", removeRestaurant);



module.exports = restaurantRouter;