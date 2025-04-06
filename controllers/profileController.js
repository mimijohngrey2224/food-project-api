const profileModel = require('../models/profile');
const userModel = require('../models/user');


const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let profile = await profileModel.findOne({ userId: user.id });
    
    if (!profile) {
      // Create default profile if none exists
      profile = new profileModel({
        userId: user.id,
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        image: ''
      });
      await profile.save();
    }

    res.json({ 
      success: true, 
      profile: {
        ...profile.toObject(),
        image: profile.image // Ensure image field is included
      } 
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    console.log("User",user)
    const { firstName, lastName, phone, address } = req.body;
    const image = req.file ? req.file.filename : undefined;

    let profile = await profileModel.findOne({ userId: user.id });

    if (profile) {
      // Update existing profile
      profile.firstName = firstName || profile.firstName;
      profile.lastName = lastName || profile.lastName;
      profile.phone = phone || profile.phone;
      profile.address = address || profile.address;
      if (image) profile.image = image;
      await profile.save();
    } else {
      // Create new profile if none exists
      profile = new profileModel({
        userId: user.id,
        firstName,
        lastName,
        phone,
        address,
        image
      });
      await profile.save();
    }

    res.json({ 
      success: true, 
      profile: {
        ...profile.toObject(),
        image: profile.image
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



  
module.exports = { getProfile, updateProfile };
