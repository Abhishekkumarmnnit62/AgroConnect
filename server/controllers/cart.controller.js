import mongoose from "mongoose";

import Cart from "../models/cart.model.js";
import Crop from "../models/crop.model.js";



// ================= GET CART =================

export const getCart = async (
  req,
  res
) => {
  try {

    const cart = await Cart.findOne({
      buyer: req.user.id,
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= ADD TO CART =================

export const addToCart = async (
  req,
  res
) => {
  try {

    const { quantity } = req.body;

    const { cropId } = req.params;

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

    // find cart
    let cart = await Cart.findOne({
      buyer: req.user.id,
    });

    // create cart if not exists
    if (!cart) {
      cart = await Cart.create({
        buyer: req.user.id,
        items: [],
      });
    }

    // check existing item
    const existingItem =
      cart.items.find(
        (item) =>
          item.cropId.toString() ===
          cropId
      );

    if (existingItem) {

      existingItem.quantity +=
        quantity || 1;

    } else {

      cart.items.push({
        cropId: crop._id,
        name: crop.name,
        price: crop.price,
        imageUrl: crop.imageUrl,
        available: crop.available,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message:
        "Item added to cart",
      cart,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= REMOVE ITEM =================

export const removeFromCart =
  async (req, res) => {
    try {

      const { cropId } = req.params;

      const cart =
        await Cart.findOne({
          buyer: req.user.id,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      cart.items =
        cart.items.filter(
          (item) =>
            item.cropId.toString() !==
            cropId
        );

      await cart.save();

      return res.status(200).json({
        success: true,
        message:
          "Item removed from cart",
        cart,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };



// ================= CLEAR CART =================

export const clearCart = async (
  req,
  res
) => {
  try {

    const cart = await Cart.findOne({
      buyer: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};