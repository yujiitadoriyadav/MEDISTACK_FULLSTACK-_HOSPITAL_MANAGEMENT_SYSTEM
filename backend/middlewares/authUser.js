import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    req.body = req.body || {};
    req.body.userId = tokenDecode._id || tokenDecode.id;
    req.UserId = tokenDecode._id || tokenDecode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
