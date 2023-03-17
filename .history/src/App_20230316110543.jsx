// ./src/App.tsx

import React, { useState, useEffect, useRef } from "react";
import { BlobServiceClient } from "@azure/storage-blob";

const containerName = "uploaded";
const connectionString =
  "BlobEndpoint=https://antmusicdemo.blob.core.windows.net/;QueueEndpoint=https://antmusicdemo.queue.core.windows.net/;FileEndpoint=https://antmusicdemo.file.core.windows.net/;TableEndpoint=https://antmusicdemo.table.core.windows.net/;SharedAccessSignature=sv=2021-12-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2023-03-16T11:29:14Z&st=2023-03-16T03:29:14Z&spr=https&sig=o8MVlJ%2F45IHkzLmqR6WjuiMXJNNm%2FW6XZQ3bFEWURNQ%3D";

const App = () => {
  const fileInput = useRef(null);
  const [files, setFiles] = useState({});
  const [progress, setProgress] = useState(0);

  function convertTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000); // Get the number of whole minutes
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0); // Get the number of seconds (with 0 decimal places)

    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`; // Format the result as "mm:ss"
    return formattedTime;
  }

  const getFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    let k = 1024,
      dm = 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const uploadFile = async () => {
    if (fileInput.current.files.length === 0) {
      alert("No file chosen");
      return;
    }
    const file = fileInput.current.files[0];
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.name);

    const startTime = new Date(); // Start time of the upload

    try {
      await blockBlobClient.uploadBrowserData(file, {
        onProgress: (currentProgress) => {
          let newProgress = (
            (currentProgress.loadedBytes / file.size) *
            100
          ).toFixed(2);
          if (newProgress > 100) newProgress = 100;
          setProgress(newProgress);
        },
      });
      const endTime = new Date(); // End time of the upload
      const timeDiff = convertTime(endTime - startTime); // Time difference in milliseconds
      const fileSize = getFileSize(file.size);
      alert(`File ${fileSize} uploaded in ${timeDiff} ms`);
      console.log("file: ", file);
    } catch (error) {
      console.error("Failed to upload file", error);
    }
  };

  const onChange = (e) => {
    console.log("onChange", e.target.files);
    setFiles(e.target.files?.[0] || {});
  };

  return (
    <div>
      <input ref={fileInput} onChange={onChange} type="file" />
      <h3>File name: {files.name || ""}</h3>
      <h4>File size: {getFileSize(files.size || 0)}</h4>
      <h4>Progress: {progress}%</h4>
      <button onClick={uploadFile}>upload</button>
    </div>
  );
};

export default App;
