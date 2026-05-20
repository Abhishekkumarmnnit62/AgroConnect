import express from "express";

import {
  registerUser,
  loginUser,
  updateUserProfile,
} from "../controllers/user.controller.js";

import {
  isAuthenticated,
} from "../middleware/auth.middleware.js";

const router = express.Router();


// ================= AUTH ROUTES =================

// Register
router.post(
  "/register",
  registerUser
);

// Login
router.post(
  "/login",
  loginUser
);


// ================= PROFILE ROUTES =================

// Update Profile
router.put(
  "/profile/update",
  isAuthenticated,
  updateUserProfile
);


export default router;