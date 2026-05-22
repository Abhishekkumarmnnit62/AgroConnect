import mongoose from "mongoose";

import User from "../models/user.model.js";
import Order from "../models/order.model.js";



// ================= GET ALL USERS =================

export const getAdminAllUsers =
  async (req, res) => {
    try {

      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        total: users.length,
        users,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };



// ================= GET ALL ORDERS =================

export const getAdminAllOrders =
  async (req, res) => {
    try {

      const orders = await Order.find()
        .populate(
          "buyer",
          "name email"
        )
        .populate(
          "farmer",
          "name email"
        )
        .populate(
          "crop",
          "name price"
        )
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        total: orders.length,
        orders,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };



// ================= BLOCK / UNBLOCK USER =================

export const blockUnblockUser =
  async (req, res) => {
    try {

      const { Id } = req.params;

      // validate user id
      if (
        !mongoose.Types.ObjectId.isValid(
          Id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid User ID",
        });
      }

      const user =
        await User.findById(Id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // toggle block status
      user.isBlocked =
        !user.isBlocked;

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          user.isBlocked
            ? "User blocked"
            : "User unblocked",

        user,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };