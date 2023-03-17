import URLSearchParams from "url-search-params";
import { logMessage } from "../helper";

const ENDPOINT = "http://localhost:4000/get-signed-url";

export const uploadToGoogleCloud = (
  fileUploadInformation,
  handleChangeProgress,
) => {
  const params = {
    fileName: fileUploadInformation.file.name,
    contentType: fileUploadInformation.file.type,
  };
  const searchParams = new URLSearchParams(params).toString();
  const url = `${ENDPOINT}?${searchParams}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success") {
        uploadFile(fileUploadInformation, result.url, handleChangeProgress);
      } else {
        console.log("result", result);
      }
    });
};

async function uploadFile(
  fileUploadInformation,
  signedUrl,
  handleChangeProgress,
) {
  const { file } = fileUploadInformation;
  // const response = await fetch(signedUrl, {
  //   method: "PUT",
  //   headers: {
  //     "Content-Type": file.type,
  //   },
  //   body: file,
  // });
  // console.log("response", response);
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", signedUrl, true);

  xhr.upload.onprogress = (event) => {
    const percentComplete = ((event.loaded / event.total) * 100).toFixed(2);
    handleChangeProgress(percentComplete);
    // console.log(`Upload progress: ${percentComplete}%`);
    // Update the UI with the progress
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      // console.log("Upload succeeded");
      // console.log("Server response:", xhr.response);
      // Handle successful completion of the upload
      logMessage(fileUploadInformation);
    } else {
      // console.error("Upload failed");
      // Handle upload failure
    }
  };

  xhr.send(file);
}
