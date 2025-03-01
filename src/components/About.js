export default function About() {
  return (
    <div className="about-container">
      <h1 className="text-xl font-bold mb-4">О нас</h1>
      <p className="about-description">
        Добро пожаловать в нашу систему управления персоналом! Мы команда профессионалов, 
        увлеченных созданием удобных и эффективных решений для управления сотрудниками. 
        Наши ключевые ценности включают качество, инновации и внимание к деталям.
      </p>
      <div className="team-section">
        <h2 className="text-lg font-bold mb-2">Наша команда</h2>
        <ul className="team-list">
          <li className="team-member">zxc - Менеджер</li>
          <li className="team-member">lol - Разработчик</li>
          <li className="team-member">kek - Тестировщик</li>
          <li className="team-member">mem - Аналитик</li>
          <li className="team-member">troll- HR-менеджер</li>
        </ul>
      </div>
      <div className="social-links">
        <h2 className="text-lg font-bold mb-2">Наши социальные сети</h2>
        <a href="https://www.instagram.com/ek1nsq/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://twitter.com/ek1nsQ" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://t.me/ek1nsq" target="_blank" rel="noopener noreferrer">Telegram</a>
        <a href="https://github.com/Ekins21k" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <p className="contact-info">
        Для бизнес предложений: <a href="mailto:ekinsbusinessq@gmail.com">ekinsbusinessq@gmail.com</a>
      </p>
    </div>
  );
}