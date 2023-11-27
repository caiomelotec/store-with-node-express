const User = require("../models/user");

exports.getLogin = (req, res) => {
  // const cookieString = req.get("Cookie");
  // const isAuth = cookieString?.split("=")[1];
  // console.log(isAuth);
  console.log(req.session.isAuth);
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isAuth: req.session.isAuth,
  });
};

exports.postLogin = (req, res) => {
  User.findById("6562e11c104e1410408d23b8")
    .then((user) => {
      req.session.isAuth = user;
      req.session.user = user;
      // console.log(req.session.user);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
