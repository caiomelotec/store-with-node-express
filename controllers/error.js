exports.pageNotFound = (req, res, next) => {
  res.status(404).render("page-not-found", {
    docTitle: "Page not Found",
    path: "/404",
    isAuth: req.session.isAuth,
  });
};
