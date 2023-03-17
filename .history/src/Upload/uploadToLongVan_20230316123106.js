import AWS from "aws-sdk";
import { getFileSize, convertTime } from "../helper";

const CONFIG = {
  accessKey: "EUMTEDYNRU6NEV7CQ1P0",
  secretKey: "0xCTFBIzeanOPzACW8hWJ83q84EzLxllPY9u3BDp",
  endpoint: "s3-hcm-r1.longvan.net",
  bucket: "ant-music-bucket-test",
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

export const uploadToLongVan = (
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
    alert(
      `Hoàn thành trong ${convertTime(
        fileUploadInformation.startTime,
        endTime,
      )}`,
    );
    console.log(
      `LONGVAN: Hoàn thành trong ${convertTime(
        fileUploadInformation.startTime,
        new Date(),
      )} | Kích thước: ${getFileSize(fileUploadInformation.file.size)}`,
    );
  });
};
