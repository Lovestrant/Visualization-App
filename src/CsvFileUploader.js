import React, { useState } from "react";

const CsvFileUploader = ({ onDataLoad }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    parseCsv(selectedFile);
  };

  const parseCsv = (csvFile) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split(/\r\n|\n/);
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const [latitude, longitude] = lines[i].split(",");
        if (!isNaN(latitude) && !isNaN(longitude)) {
          data.push({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
        }
      }

      onDataLoad(data);
    };

    reader.readAsText(csvFile);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {file && <p>Selected file: {file.name}</p>}
    </div>
  );
};

export default CsvFileUploader;
