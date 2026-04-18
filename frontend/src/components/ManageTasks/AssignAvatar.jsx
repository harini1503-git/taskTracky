import React from "react";
import { getRandomColor } from "../../utils/helper";

function AssignAvatar({task}) {
  return (
    <>
      {/* 👇👇 INSERTED AVATAR HERE 👇👇 */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-semibold shadow"
          style={{
            backgroundColor: getRandomColor(task.assignedTo?.name),
          }}
        >
          {task.assignedTo?.name?.charAt(0).toUpperCase()}
        </div>

        <span className="text-sm font-medium text-gray-700">
          {task.assignedTo?.name}
        </span>
      </div>
      {/* ☝️☝️ AVATAR BLOCK ENDS HERE ☝️☝️ */}
    </>
  );
}
export default AssignAvatar;