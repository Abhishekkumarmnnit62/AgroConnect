import express from "express";

import {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import { isAuthenticated }
from "../middleware/auth.middleware.js";

const router = express.Router();



// ================= CREATE ORDER =================

router.post(
  "/create",
  isAuthenticated,
  createOrder
);



// ================= BUYER ORDERS =================

router.get(
  "/my-orders",
  isAuthenticated,
  getMyOrders
);



// ================= FARMER ORDERS =================

router.get(
  "/farmer-orders",
  isAuthenticated,
  getFarmerOrders
);



// ================= UPDATE STATUS =================

router.put(
  "/update-status/:id",
  isAuthenticated,
  updateOrderStatus
);

export default router;