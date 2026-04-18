import Task from "../models/Task.js";
import User from "../models/User.js";
import fs from "fs";

// @route  GET /api/tasks
// @desc   Get all tasks
// @access private (Require jwt token)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email _id");

    const taskCounts = tasks.map((task) => {
      let pendingTasks = 0;
      let inProgressTasks = 0;
      let completedTasks = 0;
      let allTasks = 0;

      // Iterate over the todos array inside this task
      task.todos.map((todo) => {
        allTasks++;
        if (todo.todoStatus === "Pending") pendingTasks++;
        else if (todo.todoStatus === "In Progress") inProgressTasks++;
        else if (todo.todoStatus === "Completed") completedTasks++;
      });

      return {
        ...task._doc, // includes all task details
        allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      };
    });
    res.json(taskCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/tasks/:id
// @desc Get task by id
// @access private (Require jwt token)
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    let pendingTasks = 0;
    let inProgressTasks = 0;
    let completedTasks = 0;
    let allTasks = 0;

    // Iterate over the todos array inside this task
    task.todos.map((todo) => {
      allTasks++;
      if (todo.todoStatus === "Pending") pendingTasks++;
      else if (todo.todoStatus === "In Progress") inProgressTasks++;
      else if (todo.todoStatus === "Completed") completedTasks++;
    });

    res.json({
      ...task._doc, // includes all task details
      allTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/tasks
// @desc   Create a task
// @access private (Require jwt token)
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, todos, attachments } =
      req.body;
    const dueDate = Date.now();

    let user = await User.findOne({ email: assignedTo.email });

    // const attachments = req.files?.map((file) => ({
    //   data: fs.readFileSync(file.path),
    //   contentType: file.mimetype,
    // })) || [];

    // if(!Array.isArray(assignedTo)){
    //     return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
    // }
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: user._id, //assignedTo is the id of the user to whom the task is assigned
      createdBy: req.user._id,
      todos,
    });

     if (attachments && attachments.length > 0) {
      task.attachments = attachments.map((att) => ({
        name: att.name,
        type: att.type,
        data: Buffer.from(att.data.split(",")[1], "base64"), // strip base64 header
      }));
    }

    await task.save();
    // // Delete temporary files from local storage
    // req.files?.forEach((file) => fs.unlinkSync(file.path));

    const populatedTask = await Task.findById(task._id).populate("assignedTo", "name email ")
    // console.log(populatedTask);

    res.status(201).json({ message: "Task created successfully", task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@route PUT /api/tasks/:id
// @desc   Update a task
// @access private (Require jwt token)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.title = req.body.title;
    task.description = req.body.description;
    task.status = req.body.status;
    task.priority = req.body.priority;
    task.dueDate = req.body.dueDate;
    task.assignedTo = req.body.assignedTo;
    task.attachments = req.body.attachments;
    task.todos = req.body.todos;

     if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        data: fs.readFileSync(file.path),
        contentType: file.mimetype,
        filename: file.originalname,
      }));
      task.attachments.push(...newAttachments);
      req.files.forEach(file => fs.unlinkSync(file.path));
    }

    const updatedTask = await task.save();
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@route DELETE /api/tasks/:id
// @desc   Delete a task
// @access private (Require jwt token)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne({ _id: req.params.id });
    res.json({ message: `Task: ${task.title} is Successfully Deleted` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/tasks/:id/status
// @desc   Update task status
// @access private (Require jwt token)
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    // console.log(req.params.id);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@route PUT /api/tasks/:id/todo
// @desc   Update todo status
// @access private (Require jwt token)
export const updateTodoStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    console.log(req.body.todos);
    task.todos = req.body.todos;

    if (!task.todos) {
      return res.status(404).json({ message: "Task not found" });
    }
    // todo.text = req.body.text || todo.text;
    // todo.todoStatus = req.body.todoStatus || todo.todoStatus;

    const updatedTask = await task.save();

    res.json({
      message: "Todo updated successfully",
      todos: updatedTask.todos,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@route GET /api/tasks/dashboard-data
// @desc   Get dashboard data
// @access private (Require jwt token)
export const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const inProgressTasks = await Task.countDocuments({
      status: "In Progress",
    });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    //Ensure all possible status are included
    const taskStatus = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatus.reduce((acc, status) => {
      const formattedKey = status.replace(/\s/g, ""); //remove spaces for response keys
      const found = taskDistributionRaw.find((t) => t._id === status);
      acc[formattedKey] = found ? found.count : 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    //Ensure all priorities are included
    const taskPriorities = ["low", "medium", "high"];
    const priorityDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const priorityDistribution = taskPriorities.reduce((acc, priority) => {
      const formattedKey = priority.replace(/\s/g, ""); //remove spaces for response keys
      const found = priorityDistributionRaw.find((t) => t._id === priority);
      acc[formattedKey] = found ? found.count : 0;
      return acc;
    }, {});

    //Fetch the recent 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title description status priority dueDate createdAt")
      .populate("assignedTo", "name");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        priorityDistribution,
      },
      recentTasks,
    });
    // const tasks = await Task.find({ user: req.user._id });
    // res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/tasks/user-dashboard-data
// @desc   Get user dashboard data
// @access private (Require jwt token)
export const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);

    const totalTasks = await Task.countDocuments({assignedTo: userId});
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
    const inProgressTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "In Progress",
    });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    //Ensure all possible status are included
    const taskStatus = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatus.reduce((acc, status) => {
      const formattedKey = status.replace(/\s/g, ""); //remove spaces for response keys
      const found = taskDistributionRaw.find((t) => t._id === status);
      acc[formattedKey] = found ? found.count : 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    //Ensure all priorities are included
    const taskPriorities = ["low", "medium", "high"];
    const priorityDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const priorityDistribution = taskPriorities.reduce((acc, priority) => {
      const formattedKey = priority.replace(/\s/g, ""); //remove spaces for response keys
      const found = priorityDistributionRaw.find((t) => t._id === priority);
      acc[formattedKey] = found ? found.count : 0;
      return acc;
    }, {});

    //Fetch the recent 10 tasks
    const recentTasks = await Task.find({assignedTo: userId})
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt assignedTo");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        priorityDistribution,
      },
      recentTasks,
    });
    // const tasks = await Task.find({ user: req.user._id });
    // res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
