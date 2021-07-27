const express = require("express");
const router = express.Router();
const { updateUser, getUserById, getUser } = require("../controllers/user");
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");

//params
router.param("userId", getUserById);

//get user
router.get("/user/:userId", isSignedIn, isAuthenticated, isAdmin, getUser);

//updateUser
router.put(
  "/user/update/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateUser
);

module.exports = router;
