export default function Export() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/path-to-your-excel-file.xlsx'; // Replace with your actual file path
    link.download = 'all_data.xlsx';
    link.click();
  };

  return (
    <div className="export-container">
      <div className="export-content">
        <h1 className="export-title">Экспорт данных</h1>
        <p className="export-description">
          Нажмите кнопку ниже, чтобы скачать все данные в формате Excel.
        </p>
        <button className="download-button" onClick={handleDownload}>
          Скачать
        </button>
      </div>
    </div>
  );
}