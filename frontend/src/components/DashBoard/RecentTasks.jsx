import React from "react";
import { Calendar } from "lucide-react";
import {
  isOverdue,
  getPriorityColor,
  getStatusColor,
  formatDate,
  getRandomColor,
} from "../../utils/helper";
import {useNavigate} from "react-router-dom";


function RecentTasks({ dashboardData }) {

  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer" onClick={() => navigate('/admin/manageTasks')}>
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Task
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Priority
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Due Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Created
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                AssignedTo
              </th>
            </tr>
          </thead>
          <tbody>
            {console.log(dashboardData?.recentTasks || [])}
            {(dashboardData?.recentTasks || []).map((task) => (
              <tr
                key={task._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {task.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span
                      className={`text-sm ${
                        isOverdue(task.dueDate) && task.status !== "Completed"
                          ? "text-red-600 font-medium"
                          : "text-green-600"
                      }`}
                    >
                      {formatDate(task.dueDate)}
                    </span>
                    {isOverdue(task.dueDate) && task.status !== "Completed" && (
                      <span className="text-xs text-red-600 font-medium">
                        (Overdue)
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-700">
                    {formatDate(task.createdAt)}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {/* Avatar Circle */}
                    <div
                      className="w-7 h-7 flex items-center justify-center rounded-full text-white text-sm font-semibold shadow-sm"
                      style={{
                        backgroundColor: getRandomColor(task.assignedTo?.name),
                      }}
                    >
                      {task.assignedTo.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name */}
                    <span className="text-gray-800 font-medium text-sm">
                      {task.assignedTo.name}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentTasks;
