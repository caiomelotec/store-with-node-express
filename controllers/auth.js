const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
