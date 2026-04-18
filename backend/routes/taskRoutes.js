import express from "express";
import { protect, admin} from "../middleware/authMiddleware.js";
import upload from "../middleware/Uploads.js";
import { getTasks, getTaskById, getDashboardData, getUserDashboardData, createTask, updateTask, deleteTask, updateTaskStatus, updateTodoStatus } from "../controller/taskController.js";

const router = express.Router();

//Task Management Routes

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); //Get all tasks
router.get("/:id", protect, getTaskById); //Get task by id
router.post("/", protect, admin, upload.array("attachments"), createTask); //Create task
router.put("/:id", protect, updateTask); //Update task by id
router.delete("/:id", protect, admin, deleteTask); //Delete task by id
router.put("/:id/status", protect, updateTaskStatus); //Update task status by id
router.put("/:id/todo", protect, updateTodoStatus); //Update todo status by id

export default router;