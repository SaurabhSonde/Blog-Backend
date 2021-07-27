const Blog = require("../models/blog");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.createBlog = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in image",
      });
    }

    const { title, subTitle, blogBody } = fields;
    if (file.blogImage.size == 0) {
      return res.status(400).json({
        error: "Please include image",
      });
    }

    if (!title || !subTitle || !blogBody) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    fields.userId = req.profile._id;

    const blog = new Blog(fields);
    //handle file here
    if (file.blogImage) {
      if (file.blogImage.size > 5000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      blog.blogImage = fs.readFileSync(file.blogImage.path);
      blog.blogImage.contentType = file.blogImage.type;
    }
    blog.save((err, blog) => {
      if (err) {
        res.status(400).json({
          error: "Failed to save blog",
        });
      }
      res.json(blog);
    });
  });
};

//middleware
exports.blogImage = (req, res, next) => {
  if (req.blog.blogImage.data) {
    res.set("Content-Type", req.blog.blogImage.contentType);
    return res.send(req.blog.blogImage.data);
  }
  next();
};
