const express = require("express")
const {registerUser, loginUser } = require("../controllers/userController")

const userRouter = express.Router();

userRouter.post("/api/user/register", registerUser);
userRouter.post("/api/user/login", loginUser);

module.exports = userRouter;