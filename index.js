const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");
const Users = require("./models/Users.js");
const Secrets = require("./models/Secrets.js");

mongoose.connect("mongodb://localhost/secrets");
mongoose.Promise = global.Promise;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS, PATCH"
  );
  next();
});

app.use(bodyParser.json());

app.post("/api/users", (req, res) => {
  bcrypt.hash(req.body.Password, null, null, function(err, hash) {
    req.body.Password = hash;
    Users.create(req.body)
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  });
});

app.post("/api/login", (req, res) => {
  Users.find({})
    .then(users => {
      let user = users.filter(user => user.userName === req.userName)[0];
      bcrypt.compare(req.body.Password, user.Password, (err, result) => {
        if (err) {
          res.send({ error: err });
        } else {
          res.send({ result });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.get("/api/secrets", (req, res) => {
  Secrets.find({})
    .then(secrets => {
      res.send(secrets);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.get("/api/secrets/:id", (req, res) => {
  Secrets.findOne({ _id: req.params.id })
    .then(secret => {
      res.send(secret);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.post("/api/secrets", (req, res) => {
  bcrypt.hash(req.body.Secret, null, null, function(err, hash) {
    req.body.Secret = hash;
    Secrets.create(req.body)
      .then(secret => {
        res.send(secret);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  });
});

app.listen(3020);
