const mongoose = require("mongoose");

const PlatformSchema = new mongoose.Schema({
  platformId: { type: String, required: true, unique: true },
  platformName: { type: String, required: true },
  platformLogo: { type: String, required: true }, // URL to logo image
  platformColor: { type: String, required: true } // Hex or RGB color code
}, { timestamps: true });

module.exports = mongoose.model("Platform", PlatformSchema);
