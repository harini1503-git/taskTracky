import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { deleteUser, getUserById, getUsers } from "../controller/userController.js";

const router = express.Router();

//User Management Routes
router.get("/", protect, admin, getUsers);  //Get all users(Admin-Only)
router.get("/:id", protect, getUserById); //Get user by id
router.delete("/:id", protect, admin, deleteUser);  //Delete user by id(Admin-Only)

export default router;