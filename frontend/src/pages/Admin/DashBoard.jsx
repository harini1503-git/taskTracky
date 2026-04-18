import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashBoardLayout from "../../components/Layouts/DashBoardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import StatisticsCard from "../../components/DashBoard/StatisticsCard";
import Charts from "../../components/DashBoard/Charts";
import RecentTasks from "../../components/DashBoard/RecentTasks";

const DashBoard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({});

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      // console.log(response.data);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    console.log("Dashboard data updated:", dashboardData);
  }, [dashboardData]);

  useEffect(() => {
    // console.log(user);
    if (!user || !user._id) return;
    getDashboardData();
    // console.log("Dashboard data updated:", dashboardData);

    return () => {};
  }, [user]);

  return (
    <DashBoardLayout activeMenu="Dashboard">
      {/* {JSON.stringify(dashboardData)} */}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="mx-15">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Greetings {user?.name} !!
            </h1>
            <p className="text-gray-600">
              Track and manage your tasks efficiently
            </p>
          </div>

          {/* Statistics Cards */}
          <StatisticsCard dashboardData={dashboardData} />

          {/* Charts Section */}
          <Charts dashboardData={dashboardData} />

          {/* Recent Tasks */}
          <RecentTasks dashboardData={dashboardData} />
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default DashBoard;
