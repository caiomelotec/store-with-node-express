exports.pageNotFound = (req, res, next) => {
  res.status(404).render("page-not-found", { docTitle: "Page not Found" });
}