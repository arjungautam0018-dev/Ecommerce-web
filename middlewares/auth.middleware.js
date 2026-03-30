function isAuthenticated(req, res, next) {
    console.log("Auth Middleware: Checking authentication...");
    console.log("Checking authentication for userId:", req.session.userId);
  if (req.session.userId) {
    return next();
  }

  res.status(401).json({
    message: "Unauthorized. Please log in.",
    type: "error",
    redirectUrl: "/login",
    redirectIn: 5000, // ms
  });
}

module.exports = { isAuthenticated };