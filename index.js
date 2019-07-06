const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const jwt = require("jsonwebtoken");
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
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS, PATCH"
  );
  next();
});

app.use(bodyParser.json());

app.post("/api/users", (req, res) => {
  jwt.verify(req.headers.authorization, "secrets", (err, decoded) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
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
    }
  });
});

app.post("/api/login", (req, res) => {
  console.log(req);
  Users.find({})
    .then(users => {
      let user = users.filter(user => user.Username === req.body.Username)[0];
      if (!user) {
        res.send({ error: "User does not exist" });
      }
      bcrypt.compare(req.body.Password, user.Password, (err, result) => {
        if (err) {
          res.send({ error: err });
        } else {
          let access = { result };
          if (result) {
            let token = jwt.sign({ Username: user.Username }, "secrets");
            access.token = token;
            access._id = user._id;
            access.firstname = user.Firstname;
          }
          res.send(access);
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.get("/api/secrets", (req, res) => {
  jwt.verify(req.headers.authorization, "secrets", (err, decoded) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      Secrets.find({})
        .then(secrets => {
          res.send(secrets);
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    }
  });
});

app.get("/api/secrets/:id", (req, res) => {
  jwt.verify(req.headers.authorization, "secrets", (err, decoded) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      Secrets.findOne({ _id: req.params.id })
        .then(secret => {
          res.send(secret);
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    }
  });
});

app.post("/api/secrets", (req, res) => {
  jwt.verify(req.headers.authorization, "secrets", (err, decoded) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      Secrets.find({}).then(secrets => {
        for (let secret of secrets) {
          if (secret.Name === req.body.Name) {
            res.send({ name: "This name has already been used!" });
            return;
          } else if (secret.Secret === req.body.Secret) {
            res.send({ name: "This secret already exists!" });
            return;
          }
        }
        Secrets.create(req.body)
          .then(secret => {
            res.send(secret);
            io.emit("new secret", secret);
          })
          .catch(err => {
            console.log(err);
            res.send(err);
          });
      });
    }
  });
});

app.put("/api/secrets/:id", (req, res) => {
  jwt.verify(req.headers.authorization, "secrets", (err, decoded) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      Secrets.find({})
        .then(secrets => {
          for (let secret of secrets) {
            if (
              secret.Name === req.body.Name &&
              secret._id.toString() !== req.params.id.toString()
            ) {
              res.send({ name: "This name has already been used!" });
              return;
            } else if (
              secret.Secret === req.body.Secret &&
              secret._id.toString() !== req.params.id.toString()
            ) {
              res.send({ name: "This secret already exists!" });
              return;
            }
          }
          Secrets.findOne({ _id: req.params.id })
            .then(secret => {
              if (
                secret.Name !== req.body.Name ||
                secret.Secret !== req.body.Secret ||
                secret.Description !== req.body.Description
              ) {
                Secrets.findByIdAndUpdate({ _id: req.params.id }, req.body)
                  .then(secret => {
                    let newSecret = { ...req.body };
                    newSecret._id = secret._id;
                    res.send(newSecret);
                    io.emit("update secret", newSecret);
                  })
                  .catch(err => {
                    console.log(err);
                    res.send(err);
                  });
              } else {
                res.send({ name: "No changes were detected!" });
              }
            })
            .catch(err => {
              console.log(err);
              res.send(err);
            });
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    }
  });
});

io.on("connect", client => {
  console.log(`Connected to ${client.id}`);
});

server.listen(3020);
