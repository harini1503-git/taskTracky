import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import CreateTask from "./pages/Admin/CreateTask";
import DashBoard from "./pages/Admin/DashBoard";
import ManageTasks from "./pages/Admin/ManageTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
import MyTasks from "./pages/User/MyTasks";
import UserDashBoard from "./pages/User/UserDashBoard";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoutes";
import { UserContext} from "./context/userContext";
import {UserProvider} from "./context/userContext";
import { Outlet } from "react-router-dom";

function App() {
  return (
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/createTask" element={<CreateTask />} />
              <Route path="/admin/dashboard" element={<DashBoard />} />
              <Route path="/admin/manageTasks" element={<ManageTasks />} />
              <Route path="/admin/manageUsers" element={<ManageUsers />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/myTasks" element={<MyTasks />} />
              <Route path="/user/userDashboard" element={<UserDashBoard />} />
              <Route
                path="/user/viewTaskDetails"
                element={<ViewTaskDetails />}
              />
            </Route>

            <Route path='/' element={<Root />} />
          </Routes>
        </Router>
      </UserProvider>
  );
}

export default App;

const Root= ()=>{
  const {user, loading}= useContext(UserContext);

  if(loading) return <Outlet />;
  if(!user) {
    return <Navigate to='/login' />
  }

  return user.role=== "admin"? <Navigate to='/admin/dashboard' />:<Navigate to='/user/userDashboard' />;
}
