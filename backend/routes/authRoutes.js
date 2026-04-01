// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/authController");

// router.post("/register", authController.register);
// router.post("/login", authController.login);

// module.exports = router;

import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router; // <-- ESM export
