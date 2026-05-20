import jwt from "jsonwebtoken";

export const isAuthenticated = async (
  req,
  res,
  next
) => {
  try {

    const authHeader =
      req.headers.authorization;

    // check token exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Bearer token
    const token =
      authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // store user data in req
    req.user = decoded;

    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};