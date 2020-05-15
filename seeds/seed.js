const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Users = require("../models/Users");

const testUser = {
  Firstname: "Test",
  Lastname: "User",
  Username: "testuser",
  Email: "test@user.com",
  Password: "password",
};

mongoose.connect("mongodb://localhost/secrets");

(async function seedDB() {
  await new Promise((res) => {
    Users.remove({}).then(() => {
      bcrypt.hash(testUser.Password, null, null, function (_err, hash) {
        testUser.Password = hash;
        Users.create(testUser).then(res);
      });
    });
  });
  mongoose.connection.close();
})();
