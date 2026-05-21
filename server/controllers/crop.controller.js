import Crop from "../models/crop.model.js";



// ================= ADD CROP =================

export const addCrop = async (req, res) => {
  try {

    const {
      name,
      category,
      productionYear,
      description,
      price,
      location,
      available,
    } = req.body;

    // logged in user
    const userId = req.user.id;

    // create crop
    const crop = await Crop.create({
      name,
      category,
      productionYear,
      description,
      price,
      location,
      available,
      reportedBy: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Crop added successfully",
      crop,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= GET ALL CROPS =================

export const getAllCrops = async (req, res) => {
  try {

    const crops = await Crop.find()
      .populate("reportedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: crops.length,
      crops,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= GET SINGLE CROP =================

export const getSingleCrop = async (req, res) => {
  try {

    const crop = await Crop.findById(
      req.params.id
    ).populate(
      "reportedBy",
      "name email role"
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    return res.status(200).json({
      success: true,
      crop,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= UPDATE CROP =================

export const updateCrop = async (req, res) => {
  try {

    const crop = await Crop.findById(
      req.params.id
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // only owner can update
    if (
      crop.reportedBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedCrop =
      await Crop.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Crop updated successfully",
      updatedCrop,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= DELETE CROP =================

export const deleteCrop = async (req, res) => {
  try {

    const crop = await Crop.findById(
      req.params.id
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // only owner can delete
    if (
      crop.reportedBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await crop.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Crop deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};