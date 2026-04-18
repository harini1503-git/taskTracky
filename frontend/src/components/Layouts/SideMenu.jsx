import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { getInitials, getRandomColor } from "../../utils/helper";

const SideMenu = ({ activeMenu, openSideMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);

  // console.log(SIDE_MENU_DATA);

  const navigate = useNavigate();
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
    return () => {};
  }, [user]);

  return (
    <>
      {openSideMenu && (
        <div className="w-80 h-[calc(100vh-61px)] bg-white border-r border-gray-200/60 sticky top-[61px] z-20 flex flex-col justify-between">
          <div className="px-5 pt-6">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative flex flex-col items-center gap-1">
                {/* Profile Circle */}
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-full text-white font-semibold text-xl shadow-sm"
                  style={{ backgroundColor: getRandomColor(user?.name) }}
                >
                  {getInitials(user?.name)}
                </div>

                {/* Name & Role */}
                <div className="mt-2 text-center flex flex-col justify-center items-center">
                  <div className="text-gray-900 font-medium text-base">
                    {user?.name || ""}
                  </div>
                  {user?.role === "admin" && (
                    <div className="w-25 text-xs text-white font-semibold uppercase tracking-wide bg-blue-600 py-1 px-2 rounded-md mt-1 mb-2">
                      Admin
                    </div>
                  )}
                  <p className="text-sm text-gray-600">{user?.email || ""}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-1">
              {sideMenuData.map((item, index) => (
                <button
                  key={`menu_${index}`}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 ease-in-out
                ${
                  activeMenu === item.label
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
                  onClick={() => handleClick(item.path)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-300 text-xs text-gray-700 text-center">
            © 2025 Made By Harini
          </div>
        </div>
      )}
    </>
  );
};

export default SideMenu;
