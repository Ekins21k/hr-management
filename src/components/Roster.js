import { useState, useEffect } from "react";
import axios from "axios";

export default function Roster() {
  const [employees, setEmployees] = useState([]);
  const [isAscending, setIsAscending] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "",
    skills: "",
    team: ""
  });
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roster");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSort = (col) => {
    const sortedEmployees = [...employees].sort((a, b) => {
      if (a[col] < b[col]) return isAscending ? -1 : 1;
      if (a[col] > b[col]) return isAscending ? 1 : -1;
      return 0;
    });
    setEmployees(sortedEmployees);
    setIsAscending(!isAscending);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post("http://localhost:5000/api/roster", newEmployee);
      fetchEmployees();
      setNewEmployee({
        name: "",
        position: "",
        department: "",
        skills: "",
        team: ""
      });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleEditEmployee = async () => {
    try {
      await axios.put(`http://localhost:5000/api/roster/${editEmployeeId}`, newEmployee);
      fetchEmployees();
      setEditEmployeeId(null);
      setNewEmployee({
        name: "",
        position: "",
        department: "",
        skills: "",
        team: ""
      });
    } catch (error) {
      console.error("Error editing employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/roster/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const startEditing = (employee) => {
    setEditEmployeeId(employee.id);
    setNewEmployee({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      skills: employee.skills,
      team: employee.team
    });
  };

  return (
    <div className="roster-container">
      <h1 className="text-xl font-bold mb-4">Состав сотрудников</h1>
      <div className="table-container">
        <table className="roster-table w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-600 p-2 cursor-pointer" onClick={() => handleSort("name")}>Имя</th>
              <th className="border border-gray-600 p-2 cursor-pointer" onClick={() => handleSort("position")}>Должность</th>
              <th className="border border-gray-600 p-2 cursor-pointer" onClick={() => handleSort("department")}>Отдел</th>
              <th className="border border-gray-600 p-2 cursor-pointer" onClick={() => handleSort("skills")}>Навыки</th>
              <th className="border border-gray-600 p-2 cursor-pointer" onClick={() => handleSort("team")}>Команда</th>
              <th className="border border-gray-600 p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="text-center bg-gray-900 hover:bg-gray-700 text-white">
                <td className="border border-gray-600 p-2">{employee.name}</td>
                <td className="border border-gray-600 p-2">{employee.position}</td>
                <td className="border border-gray-600 p-2">{employee.department}</td>
                <td className="border border-gray-600 p-2">{employee.skills}</td>
                <td className="border border-gray-600 p-2">{employee.team}</td>
                <td className="border border-gray-600 p-2">
                  <button 
                    className="action-button edit-button mr-2"
                    onClick={() => startEditing(employee)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="action-button delete-button"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 add-employee-form">
        <h2 className="text-lg font-bold mb-2">
          {editEmployeeId ? "Редактировать сотрудника" : "Добавить нового сотрудника"}
        </h2>
        <input 
          className="input-field"
          type="text" 
          name="name" 
          placeholder="Имя" 
          value={newEmployee.name} 
          onChange={handleInputChange} 
        />
        <input 
          className="input-field"
          type="text" 
          name="position" 
          placeholder="Должность" 
          value={newEmployee.position} 
          onChange={handleInputChange} 
        />
        <input 
          className="input-field"
          type="text" 
          name="department" 
          placeholder="Отдел" 
          value={newEmployee.department} 
          onChange={handleInputChange} 
        />
        <input 
          className="input-field"
          type="text" 
          name="skills" 
          placeholder="Навыки" 
          value={newEmployee.skills} 
          onChange={handleInputChange} 
        />
        <input 
          className="input-field"
          type="text" 
          name="team" 
          placeholder="Команда" 
          value={newEmployee.team} 
          onChange={handleInputChange} 
        />
        {editEmployeeId ? (
          <button 
            className="action-button add-button"
            onClick={handleEditEmployee}
          >
            Сохранить
          </button>
        ) : (
          <button 
            className="action-button add-button"
            onClick={handleAddEmployee}
          >
            Добавить
          </button>
        )}
      </div>
    </div>
  );
}