const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  gender: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
