import express from "express";

import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

import { isAuthenticated }
from "../middleware/auth.middleware.js";

const router = express.Router();



// ================= GET CART =================

router.get(
  "/getCartItems",
  isAuthenticated,
  getCart
);



// ================= ADD ITEM =================

router.post(
  "/addItem/:cropId",
  isAuthenticated,
  addToCart
);



// ================= REMOVE ITEM =================

router.delete(
  "/removeItem/:cropId",
  isAuthenticated,
  removeFromCart
);



// ================= CLEAR CART =================

router.delete(
  "/clearItems",
  isAuthenticated,
  clearCart
);

export default router;