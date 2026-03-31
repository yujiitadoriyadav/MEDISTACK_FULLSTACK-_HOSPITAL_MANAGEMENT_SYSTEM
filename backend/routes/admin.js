import express from "express"

import { AddDoc, adminLogin, getDocList, getCurrentAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/login",adminLogin)
adminRouter.get("/currentAdmin", authAdmin, getCurrentAdmin)
adminRouter.post("/add-doctor", authAdmin, upload.single("DocImage") ,AddDoc)
adminRouter.get("/doc-list", authAdmin, getDocList);

export default adminRouter;