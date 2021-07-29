const User = require("../models/user");
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

//get user by id
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in image",
      });
    }

    const { name, email, password, profile_pic } = fields;
    if (file.profile_pic.size == 0) {
      return res.status(400).json({
        error: "Please include image",
      });
    }

    if (!name || !password || !email || profile_pic) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let user = fields;
    user = _.extend(user, fields);
    //handle file here
    if (file.profile_pic) {
      if (file.profile_pic.size > 5000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      user.profile_pic = fs.readFileSync(file.profile_pic.path);
      user.profile_pic.contentType = file.profile_pic.type;
    }
    User.user = user;
    User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: fields },
      { new: true, useFindAndModify: false }
    ).exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update user",
        });
      }

      res.json(user);
    });
  });
};
