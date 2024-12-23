import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createError } from "../error.js"

export const register = async (req, res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash
        })

        await newUser.save();

        res.status(201).json("User has been created");
    }
    catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) return next(createError(404, "User not found"))

        const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrectPassword) return next(createError(400, "Username or Password incorrect"));

        const token = jwt.sign({ id: user._id }, process.env.JWT)

        const { password, ...otherDetails } = user._doc;
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json({ details: { ...otherDetails }});
    }
    catch (err) {
        next(err)
    }
}