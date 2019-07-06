const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  Firstname: {
    type: String,
    required: [true, "Firstname field is required"]
  },
  Lastname: {
    type: String,
    required: [true, "LastName field is required"]
  },
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
