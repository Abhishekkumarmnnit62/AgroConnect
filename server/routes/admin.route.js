import { Router } from "express";

import {
  blockUnblockUser,
  getAdminAllOrders,
  getAdminAllUsers,
} from "../controllers/admin.controller.js";

import { isAuthenticated }
from "../middleware/auth.middleware.js";

import { isAdmin }
from "../middleware/admin.middleware.js";

const adminRouter = Router();



// ================= ALL USERS =================

adminRouter.get(
  "/getAllUsers",
  isAuthenticated,
  isAdmin,
  getAdminAllUsers
);



// ================= ALL ORDERS =================

adminRouter.get(
  "/getAllOrders",
  isAuthenticated,
  isAdmin,
  getAdminAllOrders
);



// ================= BLOCK / UNBLOCK =================

adminRouter.patch(
  "/block-unblock/:Id",
  isAuthenticated,
  isAdmin,
  blockUnblockUser
);

export default adminRouter;