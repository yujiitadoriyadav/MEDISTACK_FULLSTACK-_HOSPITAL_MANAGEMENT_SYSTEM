import validator from "validator";
import bycrypt from "bcrypt";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctor.js";
import { v2 as cloudinary } from "cloudinary";
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" });
        }

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: "invalid details" });
        }
    }
    catch {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getAlldocList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(["-Docpass", "-DocEmail"]);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const UserProfile = async (req, res) => {
    try {
        const userId = req.UserId;

        if (!userId) {
            return res.json({ success: false, message: "User id not found" });
        }

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.UserId;
        const { name, phone, gender, dob } = req.body;
        const imageFile = req.file;

        if (!userId) {
            return res.json({ success: false, message: "User id not found" });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (gender !== undefined) updateData.gender = gender;
        if (dob !== undefined) updateData.dob = dob;

        if (req.body.address !== undefined) {
            let parsedAddress = req.body.address;

            if (typeof parsedAddress === "string") {
                try {
                    parsedAddress = JSON.parse(parsedAddress);
                } catch {
                    parsedAddress = { line1: "", line2: "" };
                }
            }

            updateData.address = {
                line1: parsedAddress?.line1 || "",
                line2: parsedAddress?.line2 || "",
            };
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            updateData.image = imageUpload.secure_url;
        }

        const user = await userModel.findByIdAndUpdate(userId, updateData, {
            new: true,
        }).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, message: "Profile Updated", user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, getAlldocList, UserProfile, updateUserProfile };

