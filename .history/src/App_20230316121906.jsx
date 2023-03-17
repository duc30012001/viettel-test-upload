// ./src/App.tsx

import React, { useState, useRef } from "react";
import { uploadToAzure, uploadToViettel, uploadToLongVan } from "./Upload";
import { getFileSize, convertTime } from "./helper";

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
    const startTime = new Date(); // Start time of the upload
    const fileUploadInformation = {
      startTime: new Date(),
      file: file,
      objKey: file.name,
      reader: new FileReader(),
    };
    if (distributor === "AZURE") {
      await uploadToAzure(file, handleChangeProgress);
    } else if (distributor === "VIETTEL") {
      await uploadToViettel(fileUploadInformation, handleChangeProgress);
    } else {
      await uploadToLongVan(fileUploadInformation, handleChangeProgress);
    }
    const endTime = new Date();
    alert(`Hoàn thành trong ${convertTime(startTime, endTime)}`);
  };

  const onChange = (e) => {
    console.log("onChange", e.target.files);
    setFile(e.target.files?.[0] || {});
  };

  const onChangeDistributor = (e) => {
    console.log("onChangeDistributor", e.target.value);
    setDistributor(e.target.value);
  };

  return (
    <div>
      <input ref={fileInput} onChange={onChange} type="file" />
      <div>
        <h4 style={{ marginBottom: 0 }}>Nơi lưu</h4>
        <input
          onChange={onChangeDistributor}
          type="radio"
          id="VIETTEL"
          name="fav_language"
          value="VIETTEL"
        />
        <label htmlFor="VIETTEL">VIETTEL</label>
        <br />
        <input
          onChange={onChangeDistributor}
          type="radio"
          id="LONGVAN"
          name="fav_language"
          value="LONGVAN"
        />
        <label htmlFor="LONGVAN">LONGVAN</label>
        <br />
        <input
          onChange={onChangeDistributor}
          type="radio"
          id="AZURE"
          name="fav_language"
          value="AZURE"
        />
        <label htmlFor="AZURE">AZURE</label>
        <br />
      </div>

      <h3>Tên file: {file.name || ""}</h3>
      <h4>Kích thước: {getFileSize(file.size || 0)}</h4>
      <h4>Tiến trình: {progress}%</h4>
      <radio></radio>
      <button onClick={handleUpload}>Tải lên</button>
    </div>
  );
};

export default App;
