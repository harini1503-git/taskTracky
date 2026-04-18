import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashBoardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  // console.log(user);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div>
      <Navbar
        activeMenu={activeMenu}
        toggleSideMenu={() => setOpenSideMenu(!openSideMenu)}
        openSideMenu={openSideMenu}
      />
      {user && (
        <div className="flex">
          <div>
            <SideMenu activeMenu={activeMenu} openSideMenu={openSideMenu}/>
          </div>
          <div className="grow transition-all duration-300">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoardLayout;
