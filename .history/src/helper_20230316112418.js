export const getFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  let k = 1024,
    dm = 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export function convertTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000); // Get the number of whole minutes
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0); // Get the number of seconds (with 0 decimal places)

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`; // Format the result as "mm:ss"
  return formattedTime;
}
