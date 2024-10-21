const userModel = require("../models/user");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validator = require("validator");
const transporter = require("../config/nodemailer");
const { v4: uuidv4 } = require("uuid");




const registerUser = async (req, res) => {
    // const { firstName, lastName, email, password, address, confirmPassword } = req.body;
    const { firstName, lastName, email, password, street, city, country, state } = req.body;
    const address = { street, city, country, state };

    console.log(`Received password: ${password}`);
    // console.log(`Received confirmPassword: ${confirmPassword}`);
    console.log(`Password length: ${password.length}`);

    // if(password !== confirmPassword){
    //     return res.status(400).json({ message: "Invalid Password or mismatched password"})
    // }

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please use a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = uuidv4();
        // firstName, lastName, email, password, street, city, country, state 
        const newUser = new userModel({
            firstName,
            lastName,
            email,
            address,
            password: hashedPassword,
            verificationToken,
            isVerified: true
            // isVerified: false
        });



        const user = await newUser.save();
    
        const token = createToken(user._id);
        console.log(token);
        


        const verificationUrl = `${process.env.FRONTEND_URL}/api/email/verify/?token=${token}`;
        console.log( "verify url", verificationUrl)
        console.log( "verify uuid", verificationToken)
        console.log( "verify token", token)
        try {
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Email Verification',
                text: `Please verify your email by clicking the link: ${verificationUrl}`
            };
            // console.log(mailOptions)
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully!..")
        } catch (error) {
            console.log("Could not send verification email")
        }


        res.json({ success: true, token });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: "Error registering user" });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        // Create a token
        const token = createToken(user._id);
        
        // Respond with success and user data
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                // Add more user fields if necessary
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

module.exports = { registerUser, loginUser }
