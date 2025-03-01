export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div>
      <a href="#" onClick={() => setActiveTab("Главная")}>🏠 Главная</a>
      <a href="#" onClick={() => setActiveTab("Задачи")}>✅ Задачи</a>
      <a href="#" onClick={() => setActiveTab("Состав")}>👥 Состав</a>
      <a href="#" onClick={() => setActiveTab("Рабочий график")}>📅 Рабочий график</a>
      <a href="#" onClick={() => setActiveTab("Экспорт")}>⬇️ Экспорт</a>
      <a href="#" onClick={() => setActiveTab("О нас")}>ℹ️ О нас</a>
    </div>
  );
}