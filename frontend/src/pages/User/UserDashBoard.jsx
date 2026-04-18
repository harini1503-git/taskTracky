import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";

const UserDashBoard = () => {
    useUserAuth();
    return (
        <div>
            <h1>UserDashBoard</h1>
        </div>
    );
};

export default UserDashBoard;