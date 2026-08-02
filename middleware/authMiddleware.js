const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token"
      });
    }

    const jwtToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token Failed"
    });
  }
};

module.exports = protect;