// ./src/App.tsx

import React, { useState, useRef } from "react";
import { uploadToAzure, uploadToViettel, uploadToLongVan } from "./Upload";
import { getFileSize } from "./helper";

const DISTRIBUTOR = ["LONGVAN", "AZURE", "VIETTEL"];

const App = () => {
  const fileInput = useRef(null);
  const [file, setFile] = useState({});
  const [distributor, setDistributor] = useState("");
  const [progress, setProgress] = useState(0);
  const handleChangeProgress = (value) => {
    setProgress(value);
  };

  const handleUpload = async () => {
    if (!distributor) {
      alert("Vui lòng chọn nơi lưu");
      return;
    }

    const fileUploadInformation = {
      startTime: new Date(),
      file: file,
      objKey: file.name,
      reader: new FileReader(),
    };

    if (distributor === "AZURE") {
      await uploadToAzure(fileUploadInformation, handleChangeProgress);
    } else if (distributor === "VIETTEL") {
      await uploadToViettel(fileUploadInformation, handleChangeProgress);
    } else {
      await uploadToLongVan(fileUploadInformation, handleChangeProgress);
    }
  };

  const onChange = (e) => {
    setFile(e.target.files?.[0] || {});
  };

  const onChangeDistributor = (e) => {
    setDistributor(e.target.value);
  };

  const handleResetConsole = () => {
    console.log(
      "-----------------------------------------------------------------------------------",
    );
    setFile({});
    handleChangeProgress(0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test tốc độ upload</h1>
      <input ref={fileInput} onChange={onChange} type="file" />
      <div>
        <h4 style={{ marginBottom: 0 }}>Nơi lưu</h4>

        {DISTRIBUTOR.map((item) => (
          <React.Fragment key={item}>
            <input
              onChange={onChangeDistributor}
              type="radio"
              id={item}
              name="fav_language"
              value={item}
            />
            <label htmlFor={item}>{item}</label>
            <br />
          </React.Fragment>
        ))}
      </div>

      <h3>Tên file: {file.name || ""}</h3>
      <h4>Kích thước: {getFileSize(file.size || 0)}</h4>
      <h4>Tiến trình: {progress}%</h4>
      <button onClick={handleUpload}>Tải lên</button>
      <button style={{ marginLeft: "20px" }} onClick={handleResetConsole}>
        Reset console
      </button>
    </div>
  );
};

export default App;
