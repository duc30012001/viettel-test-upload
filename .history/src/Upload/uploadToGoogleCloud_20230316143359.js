import { Storage } from "@google-cloud/storage";

const PROJECT_ID = "unique-machine-380806";
const KEY_FILE_NAME = "/unique-machine-380806-cf8757d2b717.json";

const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: KEY_FILE_NAME,
});

// Generate signed URL
async function getSignedUrl(file) {
  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 60 * 60 * 1000, // Link expires in 1 hour
    contentType: file.type, // Set content type according to your file type
  };
  const [url] = await storage
    .bucket("YOUR_BUCKET_NAME")
    .file(file.name)
    .getSignedUrl(options);
  return url;
}

// Handle form submission
export function uploadToGoogleCloud(file) {
  const fileName = file.name;

  // Get signed URL
  getSignedUrl(fileName)
    .then((url) => {
      // Upload file to Google Cloud Storage
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      })
        .then(() => {
          console.log("File uploaded successfully!");
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}
