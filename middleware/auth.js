const jwt = require("jsonwebtoken");

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token received:", token);

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Error:", err);
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  });
};
