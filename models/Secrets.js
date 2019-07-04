const mongoose = require("mongoose");

const SecretsSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name field is required"]
  },
  Secret: {
    type: String,
    required: [true, "Secret field is required"]
  },
  Description: {
    type: String,
    required: [true, "Description field is required"]
  }
});

const Secrets = mongoose.model("secrets", SecretsSchema);

module.exports = Secrets;
