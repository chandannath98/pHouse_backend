const mongoose = require("mongoose");

const UnchangeablePasswordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ciphertext:{ type: String, required: true },
  iv:{ type: String, required: true },
  salt:{ type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("UnchangeablePassword", UnchangeablePasswordSchema);
