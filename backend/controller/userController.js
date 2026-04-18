import Task from "../models/Task.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @route  GET /api/users
// @desc   Get all users
// @access private (Require jwt token)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({role: "member"}).select("-password");

        //Add task counts for each user
        const userWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks= await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending"
                });
                const inProgressTasks= await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress"
                });
                const completedTasks= await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed"
                });
                return {
                    ...user._doc,  //Includes all existing user data (except password)
                    pendingTasks,
                    inProgressTasks,
                    completedTasks
                };
            })
        )
        res.json(userWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route  GET /api/users/:id
// @desc   Get user by id
// @access private (Require jwt token)
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @route  DELETE /api/users/:id
// @desc   Delete user by id
// @access private (Require jwt token)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await Task.deleteMany({ user: req.params.id });
        await user.deleteOne({ _id: req.params.id });
        res.json({ message: "User Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};