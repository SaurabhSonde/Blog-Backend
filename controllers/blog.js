const Blog = require("../models/blog");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

// create blog
exports.createBlog = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in image",
      });
    }

    const { title, subTitle, markdown } = fields;
    if (file.blogImage.size == 0) {
      return res.status(400).json({
        error: "Please include image",
      });
    }

    if (!title || !subTitle || !markdown) {
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

//getBlogById
exports.getBlogById = (req, res, next, blogId) => {
  Blog.findById(blogId)
    .populate("userId", { name: 1, profile_pic: 1 })
    .exec((err, blog) => {
      if (err) {
        res.status(400).json({
          error: "Blog not found",
        });
      }
      req.blog = blog;
      next();
    });
};

exports.getBlog = (req, res) => {
  req.blog.userId.profile_pic = undefined;
  req.blog.blogImage = undefined;
  return res.json(req.blog);
};

//middleware
exports.blogImage = (req, res, next) => {
  if (req.blog.blogImage) {
    res.set("Content-Type", req.blog.blogImage.contentType);
    return res.send(req.blog.blogImage);
  }
  next();
};

exports.profilePic = (req, res, next) => {
  if (req.blog.userId.profile_pic) {
    res.set("Content-Type", req.blog.userId.profile_pic.contentType);
    return res.send(req.blog.userId.profile_pic);
  }
  next();
};

//update blog
exports.updateBlog = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in image",
      });
    }

    const { title, subTitle, blogBody } = fields;

    if (!title || !subTitle || !blogBody) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    fields.userId = req.profile._id;

    let blog = req.blog;
    blog = _.extend(blog, fields);
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
          error: "Failed to update blog",
        });
      }
      res.json(blog);
    });
  });
};

// getting all available blog
exports.getAllBlogs = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;

  Blog.find()
    .populate("userId", { name: 1, profile_pic: 1 })
    .select("-blogImage")
    .sort({ created_at: -1 })
    .limit(limit)
    .exec((err, blogs) => {
      if (err) {
        res.status(404).json({
          error: "No blogs found",
        });
      }

      res.json(blogs);
    });
};

// delete blog
exports.deleteBlog = (req, res, blogId) => {
  let blog = req.blog;

  blog.remove((err, deletedBlog) => {
    if (err) {
      res.status(400).json({
        error: "Failed to delete blog",
      });
    }

    res.json({
      message: "Blog deleted successfully",
      deletedBlog,
    });
  });
};
