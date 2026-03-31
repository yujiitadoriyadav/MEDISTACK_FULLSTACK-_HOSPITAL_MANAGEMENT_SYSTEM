import bycrypt from "bcrypt";
import doctorModel from "../models/doctor.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const docLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await doctorModel.findOne({DocEmail:email});
        if (data) {
            const isMatch = await bycrypt.compare(password, data.Docpass);
            if (isMatch) {
                const token = jwt.sign({ email: data.DocEmail }, process.env.JWT_SECRET)
                const user = {
                  _id: data._id,
                  DocName: data.DocName,
                  DocEmail: data.DocEmail,
                  DocImage: data.DocImage,
                  role: 'doctor'
                }
                res.json({ success: true, message: "Login Success", token, user })
            }
            else {
                res.json({ success: false, message: "Invalid credentials" });
            }
        }
        else
        {
            res.json({ success: false, message: "Invalid credentials" });
        }

    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}
const UpdateDocProfile = async (req,res) =>{
  try{
    const { docId, DocFee, DocAvailable } = req.body;
    const imageFile = req.file;

    let parsedAddress = req.body.Docaddress;
    if (typeof parsedAddress === "string") {
      try {
        parsedAddress = JSON.parse(parsedAddress);
      } catch {
        parsedAddress = { line1: "", line2: "" };
      }
    }

    const updateData = {
      DocFee,
      Docaddress: {
        line1: parsedAddress?.line1 || "",
        line2: parsedAddress?.line2 || "",
      },
      DocAvailable,
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.DocImage = imageUpload.secure_url;
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(docId, updateData, {
      new: true,
    }).select("-Docpass");

    res.json({ success: true, message: "Profile Updated", user: updatedDoctor });
  }
  catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

const getCurrentDoc = async (req, res) => {
  try {
    const userEmail = req.DocId;

    if (!userEmail) {
      return res.json({ success: false, message: "Email not found" });
    }

    const user = await doctorModel.findOne({ DocEmail: userEmail }).select("-Docpass");

    if (!user) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
export {docLogin, getCurrentDoc, UpdateDocProfile};