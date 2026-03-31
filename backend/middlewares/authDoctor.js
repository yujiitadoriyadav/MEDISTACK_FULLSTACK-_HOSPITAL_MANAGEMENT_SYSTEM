import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const dtoken = req.headers.dtoken || req.headers.token;

    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRET);

    req.body = req.body || {};
    req.body.docId = tokenDecode.id || tokenDecode._id || req.body.docId;
    req.DocId = tokenDecode.email || req.DocId;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
