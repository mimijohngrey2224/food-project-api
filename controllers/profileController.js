const profileModel = require('../models/profile');
const userModel = require('../models/user');


const getProfile = async (req, res) => {
    try {
        const user = req.user;
        const userDetails = await userModel.findById(user._id);

        if (!userDetails) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let profile = await profileModel.findOne({ userId: user._id });

        if (!profile) {
            profile = new profileModel({
                userId: user._id,
                firstName: userDetails.name,
                email: userDetails.email,
                address: userDetails.address
            });
            await profile.save();
        }
        res.json({
            success: true,
            profile: {
                ...profile.toObject(),
                image: profile.image
            },
            userDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { firstName, lastName, phone, address } = req.body;

        let image = req.file ? req.file.filename : null;

        let profile = await profileModel.findOne({ userId: user._id });

        if (profile) {
            profile.firstName = firstName || profile.firstName;
            profile.lastName = lastName || profile.lastName;
            profile.phone = phone || profile.phone;
            profile.address = address || profile.address;
            if (image) {
                profile.image = image;
            }
            await profile.save();
        } else {
            profile = new profileModel({
                userId: user._id,
                firstName,
                lastName,
                phone,
                image,
                address
            });
            await profile.save();
        }

        res.json({ success: true, profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


  
module.exports = { getProfile, updateProfile };

