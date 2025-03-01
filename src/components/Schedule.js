import { useState, useEffect } from "react";
import axios from "axios";

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [newShift, setNewShift] = useState({ employee_id: "", shift: "" });
  const [editShiftId, setEditShiftId] = useState(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/schedule");
      setSchedule(response.data);
    } catch (error) {
      console.error("Ошибка загрузки расписания:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShift({ ...newShift, [name]: value });
  };

  const handleAddShift = async () => {
    try {
      await axios.post("http://localhost:5000/api/schedule", newShift);
      fetchSchedule();
      setNewShift({ employee_id: "", shift: "" });
    } catch (error) {
      console.error("Ошибка добавления смены:", error);
    }
  };

  const handleEditShift = async () => {
    try {
      await axios.put(`http://localhost:5000/api/schedule/${editShiftId}`, newShift);
      fetchSchedule();
      setEditShiftId(null);
      setNewShift({ employee_id: "", shift: "" });
    } catch (error) {
      console.error("Ошибка редактирования смены:", error);
    }
  };

  const handleDeleteShift = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/schedule/${id}`);
      fetchSchedule();
    } catch (error) {
      console.error("Ошибка удаления смены:", error);
    }
  };

  const startEditing = (shift) => {
    setEditShiftId(shift.id);
    setNewShift({ employee_id: shift.employee_id, shift: shift.shift });
  };

  return (
    <div className="schedule-container">
      <h1 className="text-xl font-bold mb-4">Рабочий график</h1>
      <div className="table-container">
        <table className="schedule-table w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-600 p-2">Сотрудник</th>
              <th className="border border-gray-600 p-2">Смена</th>
              <th className="border border-gray-600 p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((entry) => (
              <tr key={entry.id} className="text-center bg-gray-900 hover:bg-gray-700 text-white">
                <td className="border border-gray-600 p-2">{entry.name}</td>
                <td className="border border-gray-600 p-2">{entry.shift}</td>
                <td className="border border-gray-600 p-2">
                  <button 
                    className="action-button edit-button mr-2"
                    onClick={() => startEditing(entry)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="action-button delete-button"
                    onClick={() => handleDeleteShift(entry.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 add-shift-form">
        <h2 className="text-lg font-bold mb-2">
          {editShiftId ? "Редактировать смену" : "Добавить новую смену"}
        </h2>
        <input 
          className="input-field"
          type="text" 
          name="employee_id" 
          placeholder="ID сотрудника" 
          value={newShift.employee_id} 
          onChange={handleInputChange} 
        />
        <input 
          className="input-field"
          type="text" 
          name="shift" 
          placeholder="Смена" 
          value={newShift.shift} 
          onChange={handleInputChange} 
        />
        {editShiftId ? (
          <button 
            className="action-button add-button"
            onClick={handleEditShift}
          >
            Сохранить
          </button>
        ) : (
          <button 
            className="action-button add-button"
            onClick={handleAddShift}
          >
            Добавить
          </button>
        )}
      </div>
    </div>
  );
}