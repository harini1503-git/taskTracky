import React from "react";
import { Plus, ListTodo, Trash2 } from "lucide-react";

function TodoListCard({currentTodo, addTodo, todos, setCurrentTodo, removeTodo, SetTodoStatus}) {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
          Todo List
        </h2>

        {/* Add Todo Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={currentTodo}
            onChange={(e) => setCurrentTodo(e.target.value)}
            placeholder="Add a new todo item..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
          />
          <button
            type="button"
            onClick={addTodo}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>

        {/* Todo Items */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No todos added yet. Add your first todo above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-all group"
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                {console.log(todo._id)}
                <span
                  className={`flex-1 ${
                    todo.todoStatus === "Completed"
                      ? "line-through text-green-600"
                      : "text-red-800"
                  }`}
                >
                  {todo.text}
                </span>
                <label>
                  Status:{" "}
                  <select
                    value={todo.todoStatus}
                    onChange={(e) => SetTodoStatus(todo._id, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => removeTodo(todo._id)}
                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
export default TodoListCard;