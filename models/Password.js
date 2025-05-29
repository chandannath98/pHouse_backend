const mongoose = require("mongoose");

const PasswordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  platformId: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }, // Later, encrypt this field
  type: {type:String, required:true}
}, { timestamps: true });

module.exports = mongoose.model("Password", PasswordSchema);
