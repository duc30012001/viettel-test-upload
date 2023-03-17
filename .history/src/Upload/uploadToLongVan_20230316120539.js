import AWS from "aws-sdk";
import { getFileSize } from "./helper";

const CONFIG = {
  accessKey: "63048af01deccf617b4d",
  secretKey: "k2Wj7uoJ/QSw1GjMjZnboIoAPnlm+j6iQsXttv0z",
  endpoint: "s3-north.viettelidc.com.vn",
  bucket: "ant-music-trial-viettel",
};

let { accessKey, secretKey, endpoint, bucket } = CONFIG;

let s3 = new AWS.S3({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  endpoint: endpoint,
  s3ForcePathStyle: true,
  //signatureVersion: "v3",
  sslEnabled: true,
  httpOptions: {
    timeout: 1000 * 60000,
  },
});

export const uploadFile = (
  fileUploadInformation,
  handleChangeUploadProgress,
) => {
  const { file, objKey, startTime } = fileUploadInformation;
  console.log("===============================================");
  console.log("Bắt đầu tải lên file: ", file);
  console.log("===============================================");
  const params = {
    Body: file,
    Bucket: bucket,
    Key: objKey,
  };

  const managedUpload = new AWS.S3.ManagedUpload({
    partSize: file.size + 10 * 1024 * 1024,
    queueSize: 1,
    params: params,
    service: s3,
  });

  managedUpload.on("httpUploadProgress", (progress) => {
    const progressVariable = Math.round(
      (progress.loaded / progress.total) * 100,
    );
    handleChangeUploadProgress(progressVariable);
  });
  managedUpload.send((err, data) => {
    console.log("===============================================");
    if (err) {
      alert("File upload lỗi", err);
      return;
    } else {
      console.log("File upload thành công:", data);
      console.log("Hoàn tất tải lên file: ", file);
    }
    const endTime = new Date();
    var delta = (endTime - startTime) / 1000;
    console.log("Hoàn thành trong ", delta, "giây");
    console.log("===============================================");

    const size = getFileSize(file.size);
    alert("Tải file " + size + " trong " + delta + "giây");
  });
};