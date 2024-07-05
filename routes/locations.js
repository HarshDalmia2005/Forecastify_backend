const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const {User} = require('../models/User');

// Add new location
router.post('/add', async (req, res) => {
  const { city, weatherData, userId } = req.body;

  try {
    const newLocation = new Location({ city, weatherData, createdBy: userId });

    const duplicate= await Location.findOne({city:city})
    if(duplicate)return res.status(409).json({message:"Location already saved"})

    const savedLocation = await newLocation.save();

    await User.findByIdAndUpdate(userId, { $push: { savedLocations: savedLocation._id } });
    
    res.status(201).json({message: "saved sucessfully!!"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/get/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
      const user = await User.findById(userId).populate('savedLocations');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.savedLocations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Delete a location
router.delete('/delete/:id', async (req, res) => {
  const locationId = req.params.id;
  try {
    const location = await Location.findByIdAndDelete(locationId);
    await User.findByIdAndUpdate(location.createdBy, { $pull: { savedLocations: locationId } });
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
