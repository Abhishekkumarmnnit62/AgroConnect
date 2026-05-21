import express from "express";

import {
  addCrop,
  getAllCrops,
  getSingleCrop,
  updateCrop,
  deleteCrop,
} from "../controllers/crop.controller.js";

import {
  isAuthenticated,
} from "../middleware/auth.middleware.js";

const router = express.Router();


// ================= CROP ROUTES =================

// Add Crop
router.post(
  "/add",
  isAuthenticated,
  addCrop
);

// Get All Crops
router.get(
  "/all",
  getAllCrops
);

// Get Single Crop
router.get(
  "/:id",
  getSingleCrop
);

// Update Crop
router.put(
  "/update/:id",
  isAuthenticated,
  updateCrop
);

// Delete Crop
router.delete(
  "/delete/:id",
  isAuthenticated,
  deleteCrop
);

export default router;