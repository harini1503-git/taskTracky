import React from "react";
import { Calendar, User } from "lucide-react";
import { getRandomColor, getInitials } from "../../utils/helper";

function BasicInformation({taskData, handleInputChange, assignedUser, setShowUserModal}) {
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
        Basic Information
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleInputChange}
          placeholder="Enter task title..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
        />
      </div>

      {/* Description */}
      <div className="mt-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={taskData.description}
          onChange={handleInputChange}
          placeholder="Describe the task in detail..."
          rows="4"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all resize-none"
        />
      </div>

      {/* Priority, Status, Due Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Priority */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            name="priority"
            value={taskData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={taskData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all bg-white"
          >
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Due Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="datetime-local"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Assigned To */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 mt-5">
          Assign To <span className="text-red-500">*</span>
        </label>
        {assignedUser ? (
          <div className="flex items-center justify-between p-4 border-2 border-blue-200 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{
                  backgroundColor: getRandomColor(taskData.assignedTo?.name),
                }}
              >
                {getInitials(taskData.assignedTo?.name)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {taskData.assignedTo?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {taskData.assignedTo?.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowUserModal(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUserModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 font-medium">Select User</span>
          </button>
        )}
      </div>
    </>
  );
}

export default BasicInformation;
