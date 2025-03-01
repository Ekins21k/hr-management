import { useState, useEffect } from "react";
import axios from "axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", completed: false });
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((task) => task.id === id);
    task.completed = !task.completed;
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, task);
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async () => {
    try {
      await axios.post("http://localhost:5000/api/tasks", newTask);
      fetchTasks();
      setNewTask({ title: "", completed: false });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onDragStart = (index) => {
    setDraggedTaskIndex(index);
  };

  const onDragOver = (index) => {
    const draggedOverTask = tasks[index];
    if (draggedOverTask === tasks[draggedTaskIndex]) {
      return;
    }
    const tasksCopy = [...tasks];
    const [draggedTask] = tasksCopy.splice(draggedTaskIndex, 1);
    tasksCopy.splice(index, 0, draggedTask);
    setDraggedTaskIndex(index);
    setTasks(tasksCopy);
  };

  const onDragEnd = async () => {
    setDraggedTaskIndex(null);
    try {
      await axios.put("http://localhost:5000/api/tasks/reorder", tasks);
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };

  return (
    <div className="task-container">
      <h1 className="text-xl font-bold mb-4">Список задач</h1>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li 
            key={task.id}
            className={`task-item ${task.completed ? "completed" : ""}`} 
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={() => onDragOver(index)}
            onDragEnd={onDragEnd}
            onClick={() => toggleTask(task.id)}
          >
            {task.title}
            <button 
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task.id);
              }}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 add-task-form">
        <h2 className="text-lg font-bold mb-2">Добавить новую задачу</h2>
        <input 
          className="input-field"
          type="text" 
          name="title" 
          placeholder="Название задачи" 
          value={newTask.title} 
          onChange={handleInputChange} 
        />
        <button 
          className="action-button add-button"
          onClick={handleAddTask}
        >
          Добавить
        </button>
      </div>
    </div>
  );
}