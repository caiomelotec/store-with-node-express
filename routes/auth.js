const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check } = require("express-validator");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email is already registered");
          }
        });
      }),
    check(
      "password",
      "Please enter a password with at least 6 characters"
    ).isLength({
      min: 6,
    }),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.get("/reset", authController.getResetPassword);
router.post("/reset", authController.postResetPassword);
router.get("/reset/:token", authController.getSetNewPassword);
router.post("/reset/:token", authController.patchResetPassword);

module.exports = router;
