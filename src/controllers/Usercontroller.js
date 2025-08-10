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
        // matching password
        let isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            let token=EncodeToken(user.email,user._id.toString());

            let option={
                maxAge:process.env.cookie_expire_time,
                httpOnly:true,
                secure:true,
                sameSite:"none",
            }
            //set cookie

            res.cookie("token",token,option)

            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                user:{
                    name:user.name,
                    email:user.email,
                }
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

exports.updateUserName = async (req, res) => {
    try {
      const { name } = req.body;
      const userId = req.params.id; // get user id from URL param
  
      if (!name) {
        return res.status(400).json({ success: false, message: "Name is required" });
      }
  
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { name },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "User name updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      const deletedUser = await UserModel.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  