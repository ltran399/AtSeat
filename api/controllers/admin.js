import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newAdmin = new Admin({
            ...req.body,
            password: hash
        });

        await newAdmin.save();
        res.status(201).json("Admin has been created");
    }
    catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    console.log("Login request received");
    console.log("Request body:", req.body);
    
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        console.log("Admin found:", admin);

        if (!admin) {
            console.log("No admin found with this username");
            return next(createError(404, "Admin not found"));
        }

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            admin.password
        );
        console.log("Password check result:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log("Password incorrect");
            return next(createError(400, "Wrong password or username"));
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET
        );

        res.cookie("access_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json({ 
            details: { 
                ...otherDetails,
                isAdmin: true  // Make sure this is included
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        next(err);
    }
};