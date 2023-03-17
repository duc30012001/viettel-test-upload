import AWS from "aws-sdk";
import { convertTime } from "../helper";

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

// ========================== UPLOAD MULTI PART ===========================
const PART_SIZE = 5 * 1024 * 1024;

export const uploadToViettel = (
  fileUploadInformation,
  handleChangeUploadProgress,
  distributor,
) => {
  // setDefaultValue(distributor);
  console.log(
    "🚀 ~ file: UploadForm.js:120 ~ uploadFile ~ file:",
    fileUploadInformation.file,
  );
  // fileUploadInformation.objKey = fileUploadInformation.file.name;
  const params = {
    Bucket: bucket,
    Key: fileUploadInformation.objKey,
    ContentType: fileUploadInformation.file.type,
    ACL: "public-read",
  };

  // const managedUpload = s3.upload(params);
  s3.createMultipartUpload(params, (mpErr, multipart) => {
    if (mpErr) {
      console.log("createMultipartUpload Error: ", mpErr);
      return;
    }
    // console.log('createMultipartUpload Got upload: ', multipart);
    uploadPart(
      s3,
      multipart,
      1,
      0,
      fileUploadInformation,
      handleChangeUploadProgress,
    );
  });
};

function uploadPart(
  s3,
  multipart,
  partNum,
  rangeStart,
  fileUploadInformation,
  handleChangeUploadProgress,
) {
  // console.log('Uploading part: #', partNum, ',Range start: ', rangeStart);
  // console.log('file size: ', fileUploadInformation.file.size);

  let progress = ((rangeStart / fileUploadInformation.file.size) * 100).toFixed(
    2,
  );
  if (progress > 100) progress = 100;
  handleChangeUploadProgress(progress);

  if (fileUploadInformation.file.size <= rangeStart) {
    getETag(multipart.UploadId, partNum - 1, fileUploadInformation);
    return;
  }

  fileUploadInformation.reader.readAsArrayBuffer(
    fileUploadInformation.file.slice(rangeStart, rangeStart + PART_SIZE),
  );
  fileUploadInformation.reader.onload = function startUploadAPart() {
    let byte2Upload = null;
    byte2Upload = fileUploadInformation.reader.result;
    const partParams = {
      Body: byte2Upload,
      Bucket: bucket,
      Key: fileUploadInformation.objKey,
      PartNumber: String(partNum),
      UploadId: multipart.UploadId,
    };

    s3.uploadPart(partParams, (multiErr, mData) => {
      if (multiErr) {
        console.log("multiErr, upload part error: ", multiErr);
        return;
      }
      // console.log('Completed part: ', this.request?.params?.PartNumber);
      byte2Upload = null;
      uploadPart(
        s3,
        multipart,
        partNum + 1,
        rangeStart + PART_SIZE,
        fileUploadInformation,
        handleChangeUploadProgress,
      );
    });
  };
}

function getETag(uploadId, totalPart, fileUploadInformation) {
  console.log("Completing upload...");
  var listPartParams = {
    Bucket: bucket,
    Key: fileUploadInformation.objKey,
    UploadId: uploadId,
    MaxParts: totalPart,
    PartNumberMarker: 0,
  };
  s3.listParts(listPartParams, (err, data) => {
    if (err) {
      console.log("🚀 ~ file: UploadForm.js:187 ~ s3.listParts ~ err:", err);
      return;
    }

    // console.log('list part data', data);
    var multipartMap = {
      Parts: [0],
    };
    for (let i = 0; i < data.Parts.length; i++) {
      let aPart = data.Parts[i];
      // console.log('etag', aPart.ETag);
      multipartMap.Parts[i] = {
        ETag: aPart.ETag,
        PartNumber: Number(aPart.PartNumber),
      };
    }

    var doneParams = {
      Bucket: bucket,
      Key: fileUploadInformation.objKey,
      MultipartUpload: multipartMap,
      UploadId: uploadId,
    };
    completeMultipartUpload(s3, doneParams, fileUploadInformation);
  });
}

function completeMultipartUpload(s3, doneParams, fileUploadInformation) {
  s3.completeMultipartUpload(doneParams, (err, data) => {
    console.log("competeMultiPartUpload param", doneParams);
    if (err) {
      console.log("An error occurred while competing the multipart upload");
      console.log(err);
    } else {
      // var delta = (new Date() - fileUploadInformation.startTime) / 1000;
      // console.log('COmpeted upload in ', delta, 'seconds');
      // console.log('Final upload data: ', data);

      // const size = getFileSize(fileUploadInformation.file.size);
      // alert('Tải file ' + size + ' trong ' + delta + 'giây');
      // return new Date();
      alert(
        `Hoàn thành trong ${convertTime(
          fileUploadInformation.startTime,
          new Date(),
        )}`,
      );
      console.log(
        `VIETTEL: Hoàn thành trong ${convertTime(
          fileUploadInformation.startTime,
          new Date(),
        )}`,
      );
    }
  });
}
