import React, { useEffect, useRef, useState } from "react";
import DashBoardLayout from "../../components/Layouts/DashBoardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
  toDateTimeInputValue,
  getRandomColor,
} from "../../utils/helper";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Edit,
  Trash2,
  X,
  User,
  Circle,
  CircleAlert,
  Trash,
} from "lucide-react";
import AssignAvatar from "../../components/ManageTasks/AssignAvatar";
import { ObjectId } from "bson";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterUsers, setFilterUsers] = useState("all");
  const [UpdateTaskModal, setUpdateTaskModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    priority: "low",
    status: "Pending",
    dueDate: "",
    todos: [],
    text: "",
    todoStatus: "Pending",
  });
  // const [todos, setTodos] = useState([]);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(null);

  const openModal = () => {
    setUpdateTaskModal(true);
    setSelectedTask(null);
    setIsTodoModalOpen(true);
  };

  const handleUpdateTodo = async (task_id, todo_id, newStatus)  => {
    try{
      const updatedTodos = formData.todos.map((todo) =>
        todo._id === todo_id ? { ...todo, todoStatus: newStatus } : todo
      );

      setSelectedTask((prev) => ({
        ...prev,
        todos: updatedTodos,
      }));

      setTasks((prev) =>
        prev.map((task) =>
          task._id === task_id ? { ...task, todos: updatedTodos } : task
        )
      );
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_STATUS(task_id),
        { todos: updatedTodos }
      );
      console.log("Updated successfully:", response.data);
    }catch(error){
      console.log(error);
    }
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    const newTodo = {
      text: formData.text,
      todoStatus: formData.todoStatus,
      _id: new ObjectId().toString(),
    };
    // console.log(newTodo);
    setFormData((prev) => ({
      ...prev,
      todos: [...prev.todos, newTodo],
      text: "",
      todoStatus: "Pending",
    }));
    const response = await axiosInstance.put(
      API_PATHS.TASKS.UPDATE_TODO_STATUS(formData._id),
      { todos: [...formData.todos, newTodo ] }
    );
    // console.log(response.data);
    if (response.data) {
      setIsTodoModalOpen(false);
      setUpdateTaskModal(true);
      // getTasks();
    }
  };
  const getTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      if (response.data) {
        setTasks(response.data);
      }
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    const userMatch = filterUsers === "all" || task.assignedTo._id === filterUsers;
    const priorityMatch =
      filterPriority === "all" || task.priority === filterPriority;
    return statusMatch && priorityMatch && userMatch;
  });

  const handleUpdate = async (task_id, e) => {
    try {
      // console.log(task_id);
      console.log(e);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const response = await axiosInstance.put(
      API_PATHS.TASKS.UPDATE_TASK(formData._id),
      formData
    );
    // console.log(response.data);
    if (response.data) {
      setUpdateTaskModal(false);
      getTasks();
    }
  };

  const handleDelete = async (task_id, e) => {
    try {
      //   console.log(task_id);

      const response = await axiosInstance.delete(
        API_PATHS.TASKS.DELETE_TASK(task_id)
      );
      setSelectedTask(null);
      setTasks(tasks.filter((task) => task._id !== task_id));

      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTodoStatus = async (task_id, todo_id, newStatus) => {
    try {
      const updatedTodos = selectedTask.todos.map((todo) =>
        todo._id === todo_id ? { ...todo, todoStatus: newStatus } : todo
      );

      setSelectedTask((prev) => ({
        ...prev,
        todos: updatedTodos,
      }));

      setTasks((prev) =>
        prev.map((task) =>
          task._id === task_id ? { ...task, todos: updatedTodos } : task
        )
      );
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_STATUS(task_id),
        { todos: updatedTodos }
      );
      console.log("Updated successfully:", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
        console.log(response.data);
        if (response.data) {
          setUsers(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    getTasks();
    getAllUsers();
    console.log("useEffect called");
    return () => {};
  }, []);

  return (
    <DashBoardLayout activeMenu="Manage Tasks">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="max-w-7xl mx-10 px-4 sm:px-6 lg:px-8 py-6">
              <h1 className="text-3xl font-bold text-gray-900">Manage Tasks</h1>
              <p className="text-gray-600 mt-1">
                Track your projects efficiently and manage tasks with ease.
              </p>
            </div>
            <div className="mt-2 ml-7">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mt-2 ml-7">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="mt-2 ml-7">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned User
              </label>
              <select
                value={filterUsers}
                onChange={(e) => setFilterUsers(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
                
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ml-5 mr-5 ">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => {
                setSelectedTask(task);
              }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-blue-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {task.title}
                </h3>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      console.log("update clicked");
                      console.log(task.assignedTo?.name);
                      setUpdateTaskModal(true);
                      setFormData(task);
                    }}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Update task"
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                  </button>

                  <button
                    onClick={(e) => {
                      handleDelete(task._id);
                      e.stopPropagation();
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {task.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="flex">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {task.completedTasks}/{task.allTasks} tasks completed
                  </span>
                  <AssignAvatar task={task} />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(task.completedTasks / task.allTasks) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or create a new task
            </p>
          </div>
        )}

        {/* Task Detail Modal */}
        {/* {console.log(selectedTask)} */}
        {selectedTask && (
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setSelectedTask(null);
            }}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedTask.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedTask.status
                      )}`}
                    >
                      {selectedTask.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        selectedTask.priority
                      )}`}
                    >
                      {selectedTask.priority} priority
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    getTasks();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">{selectedTask.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Due Date
                    </h3>
                    <p className="text-gray-600">
                      {formatDate(selectedTask.dueDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assigned To
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <AssignAvatar task={selectedTask} />
                      <p className="text-gray-600 text-sm truncate ml-1">
                        <span>(</span> {selectedTask.assignedTo.email}{" "}
                        <span>)</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Todo Items ({selectedTask.completedTasks}/
                    {selectedTask.allTasks})
                  </h3>
                  <div className="space-y-2">
                    {selectedTask.todos.map((todo) => (
                      <div
                        key={todo._id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`flex-shrink-0 ${
                            todo.todoStatus === "Completed"
                              ? "text-green-600"
                              : todo.todoStatus === "In Progress"
                              ? "text-yellow-600"
                              : "text-red-400"
                          }`}
                        >
                          {todo.todoStatus === "Completed" ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              todo.todoStatus === "Completed"
                                ? "line-through text-green-500"
                                : "text-gray-700"
                            }`}
                          >
                            {todo.text}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                              todo.todoStatus === "Completed"
                                ? "bg-green-100 text-green-700"
                                : todo.todoStatus === "In Progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-200 text-red-700"
                            }`}
                          >
                            {todo.todoStatus}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {/* {console.log(selectedTask._id)} */}
                          <button
                            onClick={() =>
                              handleTodoStatus(
                                selectedTask._id,
                                todo._id,
                                "Completed"
                              )
                            }
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleTodoStatus(
                                selectedTask._id,
                                todo._id,
                                "In Progress"
                              )
                            }
                            className="text-yellow-600 hover:text-yellow-700 transition-colors"
                          >
                            <Circle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleTodoStatus(
                                selectedTask._id,
                                todo._id,
                                "Pending"
                              )
                            }
                            className="text-red-600 hover:text-gray-700 transition-colors"
                          >
                            <CircleAlert className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTask.attachments &&
                  selectedTask.attachments.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Attachments
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700"
                          >
                            📎 {att.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setUpdateTaskModal(true);
                      setSelectedTask(null);
                      setFormData(selectedTask);
                    }}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Update Task
                  </button>
                  <button
                    onClick={(e) => {
                      handleDelete(selectedTask._id);
                    }}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Task Modal */}
        {UpdateTaskModal && formData && (
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              getTasks();
            }}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmitUpdate} className="p-6 space-y-5">
                <div className="sticky top-0 bg-white border-gray-200 pt-3 pl-3 flex justify-between items-start z-10">
                  <div className="flex-1">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full rounded-lg px-3 py-2 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-2 text-2xl"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-5">
                      {/* <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          formData.status
                        )}`}
                      >
                        {formData.status}
                      </span> */}

                      <div>
                        <label className="block text-1xl font-semibold text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-40 h-13 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-1xl font-semibold text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-40 h-13 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all bg-white"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-1xl font-semibold text-gray-700 mb-2">
                          Due Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="datetime-local"
                            name="dueDate"
                            value={toDateTimeInputValue(formData.dueDate)}
                            onChange={handleInputChange}
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUpdateTaskModal(false);
                      setSelectedTask(null);
                      getTasks();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="pl-6 space-y-6">
                  <div>
                    <h3 className="text-1xl font-semibold text-gray-700 mb-2">
                      Description
                    </h3>
                    <textarea
                      type="text"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full rounded-lg text-sm px-3 py-2 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Due Date
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(formData.dueDate)}
                      </p>
                    </div> */}

                    <div>
                      <h3 className="text-1xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assigned To
                      </h3>
                      <div className="flex">
                        <p className="text-gray-600 text-sm truncate ml-6">
                          {formData.assignedTo?.name}
                        </p>
                        <p className="text-gray-600 text-sm truncate ml-1">
                          <span>(</span> {formData.assignedTo?.email}{" "}
                          <span>)</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-1xl font-semibold text-gray-700 mb-3 flex justify-between gap-2">
                      <div className="flex">
                        <CheckCircle2 className="w-4 h-4 mr-3" />
                        Todo Items ({formData.completedTasks}/
                        {formData.allTasks})
                      </div>
                      <button
                        onClick={openModal}
                        aria-label="Add todo"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white text-2xl shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        ＋
                      </button>
                    </h3>
                    <div className="space-y-2">
                      {formData.todos.map((todo) => (
                        <div
                          key={todo._id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`flex-shrink-0 ${
                              todo.todoStatus === "Completed"
                                ? "text-green-600"
                                : todo.todoStatus === "In Progress"
                                ? "text-yellow-600"
                                : "text-red-400"
                            }`}
                          >
                            {todo.todoStatus === "Completed" ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                todo.todoStatus === "Completed"
                                  ? "line-through text-green-500"
                                  : "text-gray-700"
                              }`}
                            >
                              {todo.text}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                                todo.todoStatus === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : todo.todoStatus === "In Progress"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-200 text-red-700"
                              }`}
                            >
                              {todo.todoStatus}
                            </span>
                          </div>
                          <div className="flex gap-2">

                            {/* Edit and Delete buttons can be added here if needed */}
                            <button
                              onClick={() =>{
                                console.log("todo update clicked");
                                setIsTodoModalOpen(true);
                                setEditingTodoId(todo._id);
                                setFormData((prev) => ({
                                   ...prev,
                                  todos: prev.todos.filter((t => t._id !== todo._id)),
                                  text: todo.text,
                                  todoStatus: todo.todoStatus,
                                }))
                                console.log("editingTodoId:", editingTodoId);
                              }}
                              className="text-green-600 hover:text-green-700 transition-colors"
                            >
                              <Edit className="w-5 h-5 text-blue-600" />
                            </button>

                            <button
                              onClick={() =>{
                                console.log("todo delete clicked");
                                setFormData((prev) => ({
                                  ...prev,
                                  todos: prev.todos.filter((t => t._id !== todo._id))
                                }))}
                              }
                              className="text-green-600 hover:text-green-700 transition-colors"
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {formData.attachments && formData.attachments.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Attachments
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700"
                          >
                            📎 {att.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      onClick={(e) => {
                        setSelectedTask(null);
                      }}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-5 h-5" />
                      Update Task
                    </button>
                    {/* <button
                      onClick={(e) => {
                        handleDelete(formData._id);
                      }}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Task
                    </button> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Todo Modal */}
        {isTodoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div
              className="w-full max-w-md bg-white rounded-lg shadow-lg p-6"
              role="dialog"
              aria-modal="true"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Add Todo
              </h3>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Todo
                  </label>
                  <input
                    value={formData.text}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }
                    placeholder="Write a new todo..."
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.todoStatus}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        todoStatus: e.target.value,
                      }));
                    }}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTodoModalOpen(false);
                      setFormData(formData);
                      setUpdateTaskModal(true);
                      console.log("Assignee name", formData.assignedTo?.name);
                      console.log("due date", formData.dueDate);
                    }}
                    className="rounded-md px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashBoardLayout>
  );
};

export default ManageTasks;
