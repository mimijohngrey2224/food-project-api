const express = require('express')
const profileController = require('../controllers/profileController')
const profileAuth = require('../middleware/profileAuth')
const authMiddleware = require('../middleware/authMiddleware')
const multer = require('multer');


const profileRouter = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

profileRouter.get('/profile', profileAuth, profileController.getProfile);
profileRouter.post('/profile/update', profileAuth, upload.single('image'), profileController.updateProfile);

module.exports = profileRouter;