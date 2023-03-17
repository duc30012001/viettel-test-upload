const express = require("express");
const cors = require("cors");
// Imports the Google Cloud Node.js client library
const { Storage } = require("@google-cloud/storage");
const fetch = require("node-fetch");

const app = express();
const port = 4000;

app.use(cors());

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = "your-unique-bucket-name";

// The contents that you want to upload
const contents = "these are my contents";

// The new ID for your GCS file
const destFileName = "your-new-file-name";

// Creates a client
const storage = new Storage();

async function uploadWithoutAuthenticationSignedUrlStrategy() {
  const file = storage.bucket(bucketName).file(destFileName);

  // Use signed URLs to manually start resumable uploads.
  // Authenticating is required to get the signed URL, but isn't
  // required to start the resumable upload
  const options = {
    version: "v4",
    action: "resumable",
    expires: Date.now() + 30 * 60 * 1000, // 30 mins
  };
  //auth required
  const [signedUrl] = await file.getSignedUrl(options);

  // no auth required
  const resumableSession = await fetch(signedUrl, {
    method: "POST",
    headers: {
      "x-goog-resumable": "start",
    },
  });

  // Endpoint to which we should upload the file
  const location = resumableSession.headers.location;

  // Passes the location to file.save so you don't need to
  // authenticate this call
  await file.save(contents, {
    uri: location,
    resumable: true,
    validation: false,
  });

  console.log(`${destFileName} uploaded to ${bucketName}`);
}

app.get("/", (req, res) => {
  uploadWithoutAuthenticationSignedUrlStrategy().catch(console.error);
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
