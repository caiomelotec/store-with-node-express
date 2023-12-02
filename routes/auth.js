const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.post(
  "/login",

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject("Email address is not registered.");
        }
      });
    })
    .normalizeEmail(),
  authController.postLogin
);
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
      })
      .normalizeEmail(),

    check("password", "Please enter a password with at least 6 characters")
      .isLength({
        min: 6,
      })
      .trim(),
    check("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);
router.get("/reset", authController.getResetPassword);
router.post("/reset", authController.postResetPassword);
router.get("/reset/:token", authController.getSetNewPassword);
router.post("/reset/:token", authController.patchResetPassword);

module.exports = router;
