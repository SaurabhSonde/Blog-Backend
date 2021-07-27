const express = require("express");
const router = express.Router();
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");
const { createBlog, blogImage } = require("../controllers/blog");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);

//create routes
router.post(
  "/blog/post/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createBlog
);

module.exports = router;
