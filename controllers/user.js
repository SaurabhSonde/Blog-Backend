const User = require("../models/user");
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { profile } = require("console");

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
  //restricting user who not admin to update his profile
  if (req.profile.role === 0) {
    return res.status(403).json({
      error:
        "Access Denied,You are an unauthorized user you can't update your profile.",
    });
  }

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in image",
      });
    }

    const { name, email, password, profile_pic, role } = fields;

    if (profile_pic) {
      if (file.profile_pic.size == 0) {
        return res.status(400).json({
          error: "Please include image",
        });
      }
    }

    if (!name || !password || !email || !profile_pic) {
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

    //generating salt to hash password
    const salt = await bcrypt.genSalt(10);
    //hashing user password
    user.password = await bcrypt.hash(user.password, salt);
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
