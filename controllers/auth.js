const User = require("../models/user");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const e = require("express");

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  //generating salt to hash password
  const salt = await bcrypt.genSalt(10);

  //hashing user password
  user.password = await bcrypt.hash(user.password, salt);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

//signin
exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const body = req.body;
  const user = await User.findOne({ email: body.email });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      //creating jwt token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //putting token in cookie
      res.cookie("token", token, { expire: new Date() + 9999 });

      //sending response to frontend
      const { _id, name, email, blogs, role } = user;
      return res.json({ token, user: { _id, name, email, blogs, role } });
    } else {
      res.status(400).json({ error: "Invalid Password or Email" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
};

//signout
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout succesfully",
  });
};

//checking if user is signed in or not
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

//custom middlewares retricting user to view other user profile
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access Denied",
    });
  }
  next();
};
