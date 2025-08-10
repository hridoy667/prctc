const UserModel = require("../models/Usermodel.js");
const bcrypt = require("bcrypt");
const { EncodeToken } = require("../utility/tokenHelper.js");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await UserModel.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Invalid request",
            error: error.toString(),
        });
    }
};

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        // finding user
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        // mathing password
        let isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            let token=EncodeToken(user.email,user._id.toString())
            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token:token,
            })
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        });
    }
}