import validator from "validator";
import bycrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import doctorModel from "../models/doctor.js";
import jwt from "jsonwebtoken";

const getDocList = async (req,res) => {
    try{
        const data = await doctorModel.find({}).select("-password");
         res.json({ success: true, data });
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message });
    }
}

const getCurrentAdmin = async(req,res)=>{
    try{
        const adminEmail = req.DocId;
        if (adminEmail === process.env.ADMIN_EMAIL) {
            const user = { email: adminEmail, role: 'admin' }
            res.json({ success: true, user });
        } else {
            res.json({ success: false, message: "Not authorized" });
        }
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message });
    }
}


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" });
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email: email }, process.env.JWT_SECRET)
            const user = { email: email, role: 'admin' }
            res.json({ success: true, message: "Login Success" , token, user})
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
const AddDoc = async (req, res) => {
    try {
        const { DocName, Docpass, DocEmail, DocExperience, DocFee, DocSpecility, DocEducation, Docaddress, Docabout } = req.body;
        const ImgFile = req.file;
        if (!DocName || !Docpass || !DocEmail || !ImgFile || !DocExperience || !DocFee || !DocSpecility || !DocEducation || !Docaddress || !Docabout) {
            return res.json({ success: false, message: "Missing Details" });
        }
        //validate the email
        if (!validator.isEmail(DocEmail)) {
            return res.json({ success: false, message: "enter a valid email" });
        }

        // validating strong password
        if (Docpass.length < 8) {
            return res.json({ success: false, message: "enter a strong password" });
        }

        // hashing user password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(Docpass, salt);

        const ImgUploadCloud = await cloudinary.uploader.upload(ImgFile.path,{
            resource_type:"image"
        });

        const IMGURI = ImgUploadCloud.secure_url;

        const DocData = {
            DocName,
            Docpass: hashedPassword,
            DocEmail,
            DocImage:IMGURI,
            DocExperience,
            DocFee,
            DocSpecility,
            DocEducation,
            Docaddress:JSON.parse(Docaddress),
            Docabout,
            DocDate:Date.now()
        };

        const newDoctor = new doctorModel(DocData);
        const Doctor = await newDoctor.save();
        res.json({success:true,message:"Doctor Added"})
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message });
    }

}

export { AddDoc, getDocList, adminLogin, getCurrentAdmin };