const express = require("express");
const router = express.Router();
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");
const {
  createBlog,
  getBlogById,
  getBlog,
  updateBlog,
  getAllBlogs,
  deleteBlog,
  blogImage,
} = require("../controllers/blog");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("blogId", getBlogById);

//create routes
router.post(
  "/blog/post/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createBlog
);

//get routes
router.get("/blog/:blogId", getBlog);
router.get("/blog/blogimage/:blogId", blogImage);

//update routes
router.put(
  "/blog/update/:blogId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateBlog
);

//get all available blog
router.get("/blogs", getAllBlogs);

//delete blog
router.delete(
  "/blog/delete/:blogId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteBlog
);

module.exports = router;
