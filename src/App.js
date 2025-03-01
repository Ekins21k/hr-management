import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Tasks from "./components/Tasks";
import Roster from "./components/Roster";
import Schedule from "./components/Schedule";
import Export from "./components/Export";
import About from "./components/About";
import { Menu } from "lucide-react";
import "./styles.css";
import logo from "./assets/logo.svg";

export default function App() {
  const [activeTab, setActiveTab] = useState("Главная");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isHighlightEnabled, setIsHighlightEnabled] = useState(true);

  const closeSidebar = (e) => {
    if (isSidebarOpen && !e.target.closest(".sidebar")) {
      setIsSidebarOpen(false);
    }
  };

  const toggleHighlight = () => {
    setIsHighlightEnabled(!isHighlightEnabled);
    document.body.classList.toggle("no-highlight");
  };

  return (
    <div className="app" onClick={closeSidebar}>
      {/* Background grid */}
      <div className="grid-container">
        {Array.from({ length: 96 }).map((_, index) => (
          <div key={index} className={`square ${isHighlightEnabled ? "" : "no-highlight"}`}></div>
        ))}
      </div>

      {/* Header */}
      <div className="header">
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("Главная");
          }}
          className="logo-link"
        >
          <img
            src={logo}
            alt="EkinsApp Logo"
            className="header-logo"
            style={{ width: "50px", height: "50px" }}
          />
        </button>
        <div className="header-buttons">
          <button
            className="highlight-toggle-button"
            onClick={toggleHighlight}
          >
            {isHighlightEnabled ? "Отключить подсветку" : "Включить подсветку"}
          </button>
        </div>
        <span className="header-title">EkinsApp</span>
        <div className="header-right">
          <a
            href="https://github.com/Ekins21k/hr-management.git"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            GitHub
          </a>
          <span className="version">v1.0</span>
          <button
            className="menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="sidebar-footer">
          <a href="/privacy-policy" className="privacy-policy-link">
            Privacy Policy
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="content">
        {activeTab === "Главная" && (
          <div className="main-container" onClick={() => setShowButtons(true)}>
            <h1 className="welcome-text">
              Добро пожаловать в систему управления персоналом!
            </h1>
            <p className="welcome-description">
              Управляйте задачами, сотрудниками и рабочим графиком легко и удобно.
            </p>
            {showButtons && (
              <div className="buttons-container show">
                <button
                  className="transparent-button"
                  onClick={() => setActiveTab("Задачи")}
                >
                  Задачи
                </button>
                <button
                  className="transparent-button"
                  onClick={() => setActiveTab("Состав")}
                >
                  Состав
                </button>
                <button
                  className="transparent-button"
                  onClick={() => setActiveTab("Рабочий график")}
                >
                  Рабочий график
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === "Задачи" && <Tasks />}
        {activeTab === "Состав" && <Roster />}
        {activeTab === "Рабочий график" && <Schedule />}
        {activeTab === "Экспорт" && <Export />}
        {activeTab === "О нас" && <About />}
      </div>
    </div>
  );
}
