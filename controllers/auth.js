exports.getLogin = (req, res) => {
  const cookieString = req.get("Cookie");
  const isAuth = cookieString.split("=")[1];
  console.log(isAuth);
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isAuth: isAuth,
  });
};

exports.postLogin = (req, res) => {
  req.isAuth = true;
  res.setHeader("Set-Cookie", "isAuth=true");
  res.redirect("/");
};
