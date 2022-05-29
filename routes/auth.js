const express = require("express");
const router = express.Router();
const {
  registerView,
  registerController,
  loginView,
  loginController,
  logoutController,
  updateUserController,
} = require("../controllers/auth");

router.get("/register", registerView);

router.post("/register", registerController);

router.post("/update-user", updateUserController);

router.get("/login", loginView);

router.post("/login", loginController);

router.get("/logout", logoutController);

module.exports = router;
