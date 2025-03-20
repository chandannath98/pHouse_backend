const mongoose = require("mongoose");

const PasswordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true } // Later, encrypt this field
}, { timestamps: true });

module.exports = mongoose.model("Password", PasswordSchema);
