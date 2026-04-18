import React, { useEffect, useState } from "react";
import DashBoardLayout from "../../components/Layouts/DashBoardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ListTodo
} from "lucide-react";
// import { use } from "react";
import BasicInformation from "../../components/CreateTask/BasicInformation";
import TodoListCard from "../../components/CreateTask/TodoListCard";
import Attachments from "../../components/CreateTask/Attachments";
import UserSelectionModal from "../../components/CreateTask/UserSelectionModal";
import { ObjectId } from "bson";

const CreateTask = () => {
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "Pending",
    assignedTo: {
      name: "",
      email: "",
    },
  });

  const [todos, setTodos] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [assignedUser, setAssignedUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            data: reader.result, // Base64 string
          },
        ]);
      };
    });
  };

  const removeAttachment = (index) => {
    const updatedAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(updatedAttachments);
    setTaskData((prev) => ({
      ...prev,
      attachments: updatedAttachments,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("Called handle submit");

      // console.log(taskData);
      // 🧠 Simple validation
      if (!taskData.title) return console.log("Title is required");
      if (!taskData.dueDate) return console.log("Due date is required");
      if (!taskData.assignedTo) return console.log("Assignee is required");

      // console.log(taskData);

      // ✅ Create taskData object before API call
      const finalTaskData = {
        ...taskData,
        todos,
        attachments,
      };

      const response = await axiosInstance.post(
        API_PATHS.TASKS.CREATE_TASK,
        finalTaskData
      );

      if (response.data) {
        toast.success("Task created successfully");
        navigate("/admin/manageTasks");
      }

      // reset form fields
      setTimeout(() => {
        setTaskData({
          title: "",
          description: "",
          dueDate: "",
          priority: "low",
          status: "Pending",
          assignedTo: {
            name: "",
            email: "",
          },
        });
        setTodos([]);
        setAttachments([]);
        setAssignedUser(false);
      }, 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setTaskData({
      title: "",
      description: "",
      dueDate: "",
      priority: "low",
      status: "Pending",
      assignedTo: {
        name: "",
        email: "",
      },
    });
    setTodos([]);
    setAttachments([]);
    setAssignedUser(false);
    navigate("/admin/manageTasks");
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
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const addTodo = () => {
    // console.log(currentTodo);
    if (currentTodo.trim()) {
      setTodos((prev) => [
        ...prev,
        {
          text: currentTodo,
          todoStatus: "Pending",
          _id: new ObjectId(),
        },
      ]);
      setCurrentTodo("");
    }
  };

  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo._id !== id));
  };

  const SetTodoStatus = (id, newStatus) => {
    setTodos((prev) => prev.map((todo) => (todo._id === id ? { ...todo, todoStatus: newStatus } : todo)));
    console.log(todos);
  };

  const handleAssignToUser = (user) => {
    console.log(user);
    setTaskData((prev) => ({ ...prev, assignedTo: user }));
    setShowUserModal(false);
    setAssignedUser(true);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashBoardLayout activeMenu="Create Task">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* User Selection Modal */}
        <UserSelectionModal showUserModal={showUserModal} setShowUserModal={setShowUserModal} users={users} taskData={taskData} handleAssignToUser={handleAssignToUser}/>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-2 py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-b from-green-500 to-emerald-600 rounded-xl">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <div className="ml-5">
                <h1 className="text-3xl font-bold text-gray-900">
                  Create New Task
                </h1>
                <p className="text-gray-600 mt-1">
                  Fill in the details to create a new task
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <BasicInformation taskData={taskData} handleInputChange={handleInputChange} assignedUser={assignedUser} setShowUserModal={setShowUserModal}/>

              {/* Todo List Card */}
              <TodoListCard currentTodo={currentTodo} addTodo={addTodo} todos={todos} setCurrentTodo={setCurrentTodo} removeTodo={removeTodo} SetTodoStatus={SetTodoStatus}/>
              {/* Attachments */}
              <Attachments handleFileChange={handleFileChange} attachments={attachments} removeAttachment={removeAttachment}/>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => handleCancel()}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-b from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Create Task
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default CreateTask;
