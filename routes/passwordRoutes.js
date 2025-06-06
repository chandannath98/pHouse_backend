const express = require("express");
const Password = require("../models/Password");
const Platform = require("../models/Platform");
const authMiddleware = require("../middleware/authMiddleware");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// Add a password entry

/**
 * @swagger
 * /api/passwords:
 *   get:
 *     summary: Get all passwords for the logged-in user
 *     description: Fetch all saved passwords for the authenticated user.
 *     tags:
 *       - Passwords
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved passwords.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   platformId:
 *                     type: string
 *                   username:
 *                     type: string
 *                   password:
 *                     type: string
 *                   platformDetails:
 *                     type: object
 *                     properties:
 *                       platformId:
 *                         type: string
 *                       platformName:
 *                         type: string
 *                       platformLogo:
 *                         type: string
 *                       platformColor:
 *                         type: string
 *       401:
 *         description: Unauthorized, token missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { platformId, platformName, username, password,type, ciphertext, iv, salt } = req.body;

    // If platformId is "0", create a new platform
    if (platformId === "0") {
      if (!platformName) return res.status(400).json({ message: "Platform name is required" });

      const newPlatform = new Platform({
        platformId: new Date().getTime().toString(), // Unique ID
        platformName,
        platformLogo: "https://passwords.google/static/img/key-google-hero.svg", // Default image
        platformColor: "#FFFFFF" // Default color
      });

      await newPlatform.save();
      platformId = newPlatform.platformId; // Use the new platform's ID
    }

    const newPassword = new Password({ user: req.user.id, platformId: platformId, username, password,type,  ciphertext, iv, salt });
    await newPassword.save();
    res.status(201).json({
        message:"Password Saved Successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user-specific passwords
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); 
    const passwords = await Password.aggregate([
      {
        $match: { user: userId }, // Fetch only passwords of the logged-in user
      },
      {
        $lookup: {
            from: "platforms",
            localField: "platformId",
            foreignField: "platformId",
            as: "platformDetails"
          }
      },
      {
        $unwind: {
          path: "$platformDetails",
          preserveNullAndEmptyArrays: true, // Keep passwords even if platform is missing
        },
      },
      {
        $addFields: {
          platformDetails: {
            $ifNull: [
              "$platformDetails",
              {
                platformId: "custom",
                platformName: "Custom Platform",
                platformLogo: "https://via.placeholder.com/100",
                platformColor: "#FFFFFF",
              },
            ],
          },
        },
      },
      {
        $project: {
          user: 0, // Exclude user field from response
        },
      },
    ]);

    res.status(200).json({
        "data":passwords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit a password entry
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { username, password,type,platformId, ciphertext, iv, salt } = req.body;
    const updatedPassword = await Password.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { username, password,type,platformId, ciphertext, iv, salt },
      { new: true }
    );

    if (!updatedPassword) return res.status(404).json({ message: "Password entry not found" });

    res.status(200).json({
        message:"Updated Successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a password entry
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedPassword = await Password.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!deletedPassword) return res.status(404).json({ message: "Password entry not found" });

    res.status(200).json({ message: "Password entry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
