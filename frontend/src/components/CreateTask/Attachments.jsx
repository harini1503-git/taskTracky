import React from "react";
import { Paperclip, Trash2 } from "lucide-react";

function Attachments({handleFileChange, attachments, removeAttachment}) {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
          Attachments
        </h2>
        <div className="space-y-2"></div>
        <input type="file" multiple onChange={handleFileChange} />
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-all group"
          >
            <span className="flex-shrink-0 p-2 text-blue-500 bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
              <Paperclip className="w-4 h-4" />
            </span>
            <span className="flex-1 text-gray-600">{attachment.name}</span>
            <button
              type="button"
              onClick={() => removeAttachment(index)}
              className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
export default Attachments;
