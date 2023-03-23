import "./App.css";
import TodoList from "./components/todolist/todolist";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    document.body.className = theme;
    }, [theme]);

  return (
    <div className="app">
      <div>
        <label className="switch">
          <input onClick={toggleTheme} type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
      <TodoList />
    </div>
    
  )
}

export default App;
