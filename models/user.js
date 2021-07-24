const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 30,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  encry_password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
