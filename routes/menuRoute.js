const express = require('express')
const {addMenu, listMenu, deleteMenu, featuredMenu, breakfastMenu, naijaMenu, saladMenu, signatureMenu} = require('../controllers/menuController');
const multer = require('multer');




const menuRouter = express.Router();


const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()} ${file.originalname}`)
    }
    
})

const upload = multer({storage: storage})

menuRouter.post("/adds", upload.single("img"), (req, res, next) => {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);
    next();
  }, addMenu)
menuRouter.get('/list', listMenu)
menuRouter.delete('/delete', deleteMenu)
menuRouter.get('/featured', featuredMenu )
menuRouter.get('/breakfast', breakfastMenu )
menuRouter.get('/naija', naijaMenu )
menuRouter.get('/salad', saladMenu )
menuRouter.get('/signature', signatureMenu )


module.exports = menuRouter;