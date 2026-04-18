import React from "react";
import {CheckCircle,Clock,AlertCircle,TrendingUp,Calendar,Filter,} from "lucide-react";

function StatisticsCard({dashboardData}) {
    return <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                Total Tasks
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.statistics?.totalTasks || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                Pending
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.statistics?.pendingTasks || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                In Progress
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.statistics?.inProgressTasks || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                Completed
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.statistics?.completedTasks || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                Overdue
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.statistics?.overdueTasks || 0}
              </p>
            </div>
          </div>
    </>
}

export default StatisticsCard;