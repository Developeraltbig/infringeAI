import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/**
 * protect middleware — verifies the JWT and attaches the full user
 * document to req.user so that checkAuth can return it.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 1. Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    } catch (err) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: Invalid or expired token",
        });
    }

    // 2. Find the user in the DB
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: User no longer exists",
        });
    }

    // 3. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error in auth" });
  }
};

export default protect;
