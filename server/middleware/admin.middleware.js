export const isAdmin = async (
  req,
  res,
  next
) => {
  try {

    // check user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // check role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Admin only",
      });
    }

    next();

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};