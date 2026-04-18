import React from "react";
import {PieChart,Pie,Cell,BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,} from "recharts";

function Charts({dashboardData}) {

    const taskDistributionData = [
        {
          name: "Pending",
          value: dashboardData.charts?.taskDistribution.Pending || 0,
          color: "#ef4444",
        },
        {
          name: "In Progress",
          value: dashboardData.charts?.taskDistribution.InProgress || 0,
          color: "#f59e0b",
        },
        {
          name: "Completed",
          value: dashboardData.charts?.taskDistribution.Completed || 0,
          color: "#04a46fff",
        },
      ].filter((item) => item.value > 0);
    
      const priorityDistributionData = [
        {
          name: "Low",
          value: dashboardData.charts?.priorityDistribution.low || 0,
          fill: "#04a46fff",
        },
        {
          name: "Medium",
          value: dashboardData.charts?.priorityDistribution.medium || 0,
          fill: "#f59e0b",
        },
        {
          name: "High",
          value: dashboardData.charts?.priorityDistribution.high || 0,
          fill: "#ef4444",
        },
      ];

    return(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Task Distribution
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={taskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    innerRadius={90}
                  >
                    {taskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Priority Distribution
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={priorityDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {priorityDistributionData.map((entry, index) => (
                      <Cell fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
    )
}

export default Charts;