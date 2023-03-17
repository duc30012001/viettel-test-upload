// ./src/App.tsx

import React, { useState, useEffect, useRef } from "react";
import { uploadFileToAzure } from "./Upload/uploadToAzure";
import { getFileSize } from "./helper";

const App = () => {
  const fileInput = useRef(null);
  const [files, setFiles] = useState({});
  const [distributor, setDistributor] = useState("");
  const [progress, setProgress] = useState(0);
  const handleChangeProgress = (value) => {
    setProgress(value);
  };

  const handleUpload = () => {
    if (!distributor) {
      alert("Vui lòng chọn cloud storage");
      return;
    }
    const startTime = new Date(); // Start time of the upload
  };

  const onChange = (e) => {
    console.log("onChange", e.target.files);
    setFiles(e.target.files?.[0] || {});
  };

  const onChangeDistributor = (e) => {
    console.log("onChangeDistributor", e);
  };

  return (
    <div>
      <input ref={fileInput} onChange={onChange} type="file" />

      <input
        onChange={onChangeDistributor}
        type="radio"
        id="VIETTEL"
        name="fav_language"
        value="VIETTEL"
      />
      <label for="VIETTEL">VIETTEL</label>
      <br />
      <input
        onChange={onChangeDistributor}
        type="radio"
        id="LONGVAN"
        name="fav_language"
        value="LONGVAN"
      />
      <label for="LONGVAN">LONGVAN</label>
      <br />
      <input
        onChange={onChangeDistributor}
        type="radio"
        id="AZURE"
        name="fav_language"
        value="AZURE"
      />
      <label for="AZURE">AZURE</label>
      <br />

      <h3>Tên file: {files.name || ""}</h3>
      <h4>Kích thước: {getFileSize(files.size || 0)}</h4>
      <h4>Tiến trình: {progress}%</h4>
      <radio></radio>
      <button onClick={handleUpload}>Tải lên</button>
    </div>
  );
};

export default App;
