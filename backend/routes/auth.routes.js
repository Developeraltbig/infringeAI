import express from "express";
import {
  loginUser,
  checkAuth,
  refreshToken,
} from "../controllers/auth.controller.js";
import protect from "../middleware/protect.middleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

// protect is now ENABLED — it verifies the JWT and sets req.user
// before checkAuth reads it and returns the user object
router.get("/check", protect, checkAuth);

export default router;
