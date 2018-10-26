const NodeWebCam = require("node-webcam");
const AWS = require("aws-sdk");
const uuid = require("uuid/v4");
const config = {
  Bucket: process.env["BUCKET"],
  Region: process.env["AWS_DEFAULT_REGION"] || "eu-west-1"
};

const opts = {
  width: 1280,
  height: 720,
  quality: 100,
  delay: 0,
  saveShots: true,
  output: "jpeg",
  device: false,
  callbackReturn: "base64",
  verbose: false
};

const WebCam = NodeWebCam.create(opts);

WebCam.capture("test", (err, data) => {
  const S3 = new AWS.S3(config);
  const buffer = new Buffer(data.replace(/^data:image\/\w+;base64,/, ""), "base64");
  const options = {
    Bucket: config.Bucket,
    Key: uuid() + ".jpeg",
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };
  
  S3.putObject(options, (err, data) => {
    if (err) {
      console.log(err);
      console.log("Error uploading data: ", data);
    } else {
      console.log(data);
      console.log("Successfully uploaded to", ["s3://", options.Bucket, options.Key].join("/"));
    }
  });
});