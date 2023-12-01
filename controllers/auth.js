const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../util/email");

exports.getLogin = (req, res) => {
  if (req.session.isAuth) {
    res.redirect("/");
  } else {
    res.render("auth/login", {
      path: "/login",
      docTitle: "Login",
      errorMessage: req.flash("error"),
    });
  }
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid email");
      return res.redirect("/login");
    }

    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        const { password, ...otherInfo } = user.toObject();
        if (doMatch) {
          req.session.isAuth = true;
          req.session.user = otherInfo;
          return req.session.save(() => {
            res.redirect("/");
          });
        }
        req.flash("error", "Invalid password");
        res.redirect("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Sign up",
    errorMessage: req.flash("error"),
  });
};

exports.postSignup = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email is already registered");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPass) => {
          const user = new User({
            username: username,
            email: email,
            password: hashedPass,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          return res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/login");
  });
};

exports.getResetPassword = (req, res) => {
  res.render("auth/resetPassword", {
    path: "/reset",
    docTitle: "Reset Password",
    errorMessage: req.flash("error"),
  });
};

exports.postResetPassword = (req, res) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    // generate a random reset token
    const token = buf.toString("hex");
    // check if user email is already registered
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email not found");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then((user) => {
          res.redirect("/");
          // send token back to user email
          const resetUrl = `${req.protocol}://${req.get(
            "host"
          )}/reset/${token}`;
          const message = `We have received a password reset request.\n
            Please  use the bellow to set a new password \n\n
            ${resetUrl}\n\n 
            this password reset link will be valid for 1h`;
          sendEmail({
            email: user.email,
            subject: "Password reset",
            message: message,
          }).catch((error) => {
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            req.flash(
              "error",
              "There was an error sending the password reset mail, please try again later."
            );
            user.save({ validateBeforeSave: false });

            return res.redirect("/reset");
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getSetNewPassword = (req, res) => {
  const token = req.params.token;
  res.render("auth/setNewPassword", {
    path: "/reset/:token",
    docTitle: "Reset Password",
    errorMessage: req.flash("error"),
    token: token,
  });
};

exports.patchResetPassword = (req, res) => {
  const token = req.params.token;
  // check user with the given token and token has not expired
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      // if the given user is not valid throw an error
      if (!user) {
        req.flash("error", "User not found or token expired");
        return res.redirect(`/reset/${token}`);
      }

      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;

      // check the password and then change it
      if (password.toString() === confirmPassword.toString()) {
        bcrypt.hash(password, 12).then((hashedPass) => {
          user.password = hashedPass;
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;
          user.save();
        });
        return res.redirect("/login");
      } else {
        req.flash("error", "Password doesn't match, please try again.");
        return res.redirect(`/reset/${token}`);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
};
