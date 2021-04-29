//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

console.log(process.env.API_KEY);
console.log("Secret is "+process.env.SECRET);

//const _ = require('lodash');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));


//mongoose.connect("mongodb://localhost:27107/userDB", {useNewUrlParser:true});
// mongoose.connect("mongodb://localhost:27107/userDB", {useNewUrlParser:true,useUnifiedTopology: true})
// .then(() => console.log("Connected"))
// .catch(err => console.log("Connection error is "+err));

//alternate connection

mongoose.connect("mongodb://localhost/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected"))
  .catch(err => console.log("Connection error is " + err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  // console.log(req.body.username);
  // console.log(req.body.password);

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log("this is the error" + err);
    } else {
      res.render("secrets");
    }
  });

});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  console.log(password);

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err){
      console.log("The found user error is "+err);
    }else{
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }

  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
