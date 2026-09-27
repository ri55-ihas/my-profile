import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault(); 
    const text = input.trim();
    if (text === "") return; 
    setTasks([...tasks, { id: Date.now(), text, done: false }]);
    setInput(""); 
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <main className="max-w-2xl mx-auto mt-8 border border-stone-400 rounded-xl p-8">
      <h1 className="text-3xl text-stone-700 font-bold mb-2 tracking-wider">タスク管理</h1>
      <p className="text-stone-500 mb-6">日々のタスク管理をサポートします</p>

      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          className="border rounded-xl px-3 py-2 flex-1"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="新しいタスクを入力してください..."
        />
        <button
          type="submit"
          className="bg-stone-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-stone-600 hover:-translate-y-1"
        >
          追加
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center gap-2 bg-white border border-2 border-blue-600 rounded-lg shadow px-4 py-2 ${task.done ? "border-1 border-gray-500" : ""}`}
          >
            <span
              className={`flex-1 cursor-pointer text-xl ${task.done ? "line-through text-gray-400" : ""}`}
              onClick={() => toggleTask(task.id)}
            >
              {task.text}
            </span>
            <button
              className="bg-red-400 px-2 py-1 text-white rounded hover:bg-red-600 text-sm"
              onClick={() => deleteTask(task.id)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="text-center text-gray-400 mt-8">タスクがありません</p>
      )}
    </main>
  );
}

export default App;