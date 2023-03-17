import { BlobServiceClient } from "@azure/storage-blob";
import { getFileSize, convertTime } from "../helper";

export const uploadToAzure = async (fileUploadInformation, setProgress) => {
  const { file } = fileUploadInformation;
  const containerName = "uploaded";
  const connectionString =
    "BlobEndpoint=https://antmusicdemo.blob.core.windows.net/;QueueEndpoint=https://antmusicdemo.queue.core.windows.net/;FileEndpoint=https://antmusicdemo.file.core.windows.net/;TableEndpoint=https://antmusicdemo.table.core.windows.net/;SharedAccessSignature=sv=2021-12-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2023-03-16T11:29:14Z&st=2023-03-16T03:29:14Z&spr=https&sig=o8MVlJ%2F45IHkzLmqR6WjuiMXJNNm%2FW6XZQ3bFEWURNQ%3D";
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(file.name);

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
    alert(
      `Hoàn thành trong ${convertTime(
        fileUploadInformation.startTime,
        endTime,
      )}`,
    );
    console.log(
      `AZURE: Hoàn thành trong ${convertTime(
        fileUploadInformation.startTime,
        new Date(),
      )} | Kích thước: ${getFileSize(fileUploadInformation.file.size)}`,
    );
    return endTime;
  } catch (error) {
    console.error("Failed to upload file", error);
  }
};
