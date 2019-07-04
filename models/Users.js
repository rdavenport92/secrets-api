const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: [true, "Username field is required"]
  },
  Password: {
    type: String,
    required: [true, "Password field is required"]
  }
});

const Users = mongoose.model("users", UsersSchema);

module.exports = Users;
