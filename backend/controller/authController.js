import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route  POST /api/auth/register
// @desc   Register user
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, adminInviteToken } = req.body;

    //Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    //Determine user role: Admin if correct token is provided, otherwise Member
    let userRole = "member";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      userRole = "admin";
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // sending the response of user data with jwt
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/auth/login
// @desc   Register user
// @access Public

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found or Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "User not found or Invalid credentials" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/auth/profile
// @desc   Get user profile
// @access private (Require jwt token)

export const getUserProfile = async (req, res) => {
  try{
    const user= await User.findById(req.user.id).select("-password");
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    res.json(user);
  }catch(error){
    res.status(500).json({message: "Server error", error: error.message});
  }
};

// @route  POST /api/auth/profile
// @desc   Update user profile
// @access private (Require jwt token)

export const updateUserProfile = async (req, res) => {
    try{
        const user= await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        user.name= req.body.name || user.name;
        user.email= req.body.email || user.email;

        if(req.body.password){
            const salt= await bcrypt.genSalt(10);
            hashedPassword= await bcrypt.hash(req.body.password, salt);
            user.password= hashedPassword;
        }
        const updatedUser= await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
};
