import {LuLayoutDashboard, LuUsers, LuClipboardCheck, LuSquarePlus, LuLogOut} from "react-icons/lu";

export const SIDE_MENU_DATA= [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/admin/dashboard"
    },
    {
        id: "02",
        label: "Manage Tasks",
        icon: LuClipboardCheck,
        path: "/admin/manageTasks"
    },
    {
        id: "03",
        label: "Create Task",
        icon: LuSquarePlus,
        path: "/admin/createTask"
    },
    {
        id: "04",
        label: "Team Members",
        icon: LuUsers,
        path: "/admin/manageUsers"
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut,
        path: "/logout"
    }
];

export const SIDE_MENU_USER_DATA= [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/user/dashboard"
    },
    {
        id: "02",
        label: "My Tasks",
        icon: LuClipboardCheck,
        path: "/user/tasks"
    },
    {
        id: "03",
        label: "Logout",
        icon: LuLogOut,
        path: "/logout"
    }
];

export const PRIORITY_DATA= [
    {label: "High", value: "high"},
    {label: "Medium", value: "medium"},
    {label: "Low", value: "low"}
]
export const STATUS_DATA= [
    {label: "Pending", value: "Pending"},
    {label: "In Progress", value: "InProgress"},
    {label: "Completed", value: "Completed"}
]