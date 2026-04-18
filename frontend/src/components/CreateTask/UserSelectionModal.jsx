import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { getInitials, getRandomColor } from "../../utils/helper";

function UserSelectionModal({showUserModal, setShowUserModal, users, taskData, handleAssignToUser}) {
    return <>
        {showUserModal && (
                  <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
                    <div className="bg-white/95 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-in">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-gray-900">
                            Assign To User
                          </h3>
                          <button
                            onClick={() => setShowUserModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Select a team member to assign this task
                        </p>
                      </div>
                      <div className="p-4 overflow-y-auto max-h-[60vh]">
                        <div className="space-y-2">
                          {users.map((user) => (
                            <button
                              key={user._id}
                              onClick={() => handleAssignToUser(user)}
                              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors border-2 border-transparent hover:border-blue-200"
                            >
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                                style={{ backgroundColor: getRandomColor(user?.name) }}
                              >
                                {getInitials(user.name)}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-semibold text-gray-900">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                              {taskData?.assignedTo?._id === user._id && (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
    </>
}

export default UserSelectionModal;