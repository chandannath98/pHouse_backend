const express = require("express");
const Platform = require("../models/Platform");

const router = express.Router();

// Get all predefined platforms
router.get("/", async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new platform (Admin only - optional)
router.post("/", async (req, res) => {
  try {
    const { platformId, platformName, platformLogo, platformColor } = req.body;
    const newPlatform = new Platform({ platformId, platformName, platformLogo, platformColor });
    await newPlatform.save();
    res.status(201).json(newPlatform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
