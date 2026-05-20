import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import cloudinary from "../utils/cloudinary.js";


// ================= REGISTER USER =================

export const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,
      location,
      mobileNo,
    } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // image upload
    let imageUrl = "";

    // if (req.file) {

    //   const result =
    //     await cloudinary.uploader.upload(
    //       req.file.path,
    //       {
    //         folder: "users",
    //         resource_type: "auto",
    //       }
    //     );

    //   imageUrl = result.secure_url;
    // }

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      mobileNo,
    
    });

    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
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



// ================= LOGIN USER =================

export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
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



// ================= UPDATE PROFILE =================

export const updateUserProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      name,
      role,
      location,
      mobileNo,
    } = req.body;

    // update fields
    if (name) user.name = name;

    if (role) user.role = role;

    if (location) user.location = location;

    if (mobileNo) user.mobileNo = mobileNo;


    // // upload image
    // if (req.file) {

    //   const result =
    //     await cloudinary.uploader.upload(
    //       req.file.path,
    //       {
    //         folder: "users",
    //         resource_type: "auto",
    //       }
    //     );

    //   user.imageUrl = result.secure_url;
    // }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
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