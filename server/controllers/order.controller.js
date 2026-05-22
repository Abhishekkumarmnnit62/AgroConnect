import mongoose from "mongoose";

import Order from "../models/order.model.js";
import Crop from "../models/crop.model.js";



// ================= CREATE ORDER =================

export const createOrder = async (
  req,
  res
) => {
  try {

    const {
      cropId,
      quantity,
      deliveryAddress,
      phoneNumber,
    } = req.body;

    // validate crop id
    if (
      !mongoose.Types.ObjectId.isValid(
        cropId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Crop ID",
      });
    }

    // find crop
    const crop = await Crop.findById(
      cropId
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // check quantity
    if (quantity > crop.available) {
      return res.status(400).json({
        success: false,
        message:
          "Not enough crop available",
      });
    }

    // total amount
    const totalAmount =
      quantity * crop.price;

    // create order
    const order = await Order.create({
      buyer: req.user.id,
      farmer: crop.reportedBy,
      crop: crop._id,

      quantity,

      pricePerKg: crop.price,

      totalAmount,

      deliveryAddress,

      phoneNumber,
    });

    // reduce crop quantity
    crop.available =
      crop.available - quantity;

    await crop.save();

    return res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      order,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= BUYER ORDERS =================

export const getMyOrders = async (
  req,
  res
) => {
  try {

    const orders = await Order.find({
      buyer: req.user.id,
    })
      .populate("crop")
      .populate(
        "farmer",
        "name email mobileNo"
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



// ================= FARMER ORDERS =================

export const getFarmerOrders =
  async (req, res) => {
    try {

      const orders = await Order.find({
        farmer: req.user.id,
      })
        .populate("crop")
        .populate(
          "buyer",
          "name email mobileNo"
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



// ================= UPDATE ORDER STATUS =================

export const updateOrderStatus =
  async (req, res) => {
    try {

      const { status } = req.body;

      // validate order id
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid Order ID",
        });
      }

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // only farmer can update
      if (
        order.farmer.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      order.orderStatus = status;

      await order.save();

      return res.status(200).json({
        success: true,
        message:
          "Order status updated",
        order,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };