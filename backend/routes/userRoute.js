import express from "express"
import {
	registerUser,
	loginUser,
	getAlldocList,
	UserProfile,
	updateUserProfile,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";


const userRouter = express.Router();


userRouter.post("/signup",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/getDoclist",getAlldocList);
userRouter.get("/getuserProfile", authUser, UserProfile);
userRouter.put("/updateuserProfile", authUser, upload.single("image"), updateUserProfile);
export default userRouter;