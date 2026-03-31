import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const atoken = req.headers.atoken || req.headers.token;

    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET);

    const tokenEmail = tokenDecode.email;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (tokenEmail !== adminEmail) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    req.DocId = tokenEmail;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
