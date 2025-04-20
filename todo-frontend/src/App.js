import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  // Todo一覧を取得
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get("http://localhost:8080/api/todos");
    setTodos(res.data);
  };

  // Todoを追加する
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo = {
      title: title,
      completed: false
    };


    try {
      await axios.post("http://localhost:8080/api/todos", newTodo);
      setTitle(""); // 入力欄をリセット
      fetchTodos(); // 最新のリストを再取得
    } catch (error) {
      console.error("追加に失敗しました", error);
    }
  };

  // Todoを削除する
    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:8080/api/todos/${id}`);
        fetchTodos(); // 最新のリストを再取得
      } catch (error) {
        console.error("削除に失敗しました", error);
      }
    };

    // Todoを更新する
    const handleToggle = async (todo) => {
        const updatedTodo = { ...todo, completed: !todo.completed };

        try {
            await axios.put(`http://localhost:8080/api/todos/${todo.id}`, updatedTodo);
            fetchTodos();
        } catch (error) {
            console.error("更新に失敗しました", error);
        }
    };

  return (
    <div className="App">
      <h1>📝 Todo アプリ</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="新しいTodoを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">追加</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
               type="checkbox"
               checked={todo.completed}
               onChange={() => handleToggle(todo)}
            />
            {todo.title} {todo.completed ? "✅" : "❌"}
            <button onClick={() => handleDelete(todo.id)}>🗑️ 削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;