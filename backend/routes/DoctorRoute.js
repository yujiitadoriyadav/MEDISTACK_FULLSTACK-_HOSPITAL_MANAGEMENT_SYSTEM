import express from "express";
import {
	docLogin,
	getCurrentDoc,
	UpdateDocProfile,
} from "../controllers/DoctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
import upload from "../middlewares/multer.js";
const DoctorRoute = express.Router();

DoctorRoute.post("/login",docLogin);
DoctorRoute.get("/currentDoc", authDoctor, getCurrentDoc);
DoctorRoute.put("/update-profile", authDoctor, upload.single("DocImage"), UpdateDocProfile);

export default DoctorRoute;