'use strict';

const AWS = require("aws-sdk");
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const emotion = require('./lib/emotion');
const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const getFaces = async (params) => {
  return rekognition.detectFaces(params)
    .promise()
    .then(data => data.FaceDetails);
};

const getEmotions = async (faces) => {
  return faces.map((face) => emotion(face.Emotions));
};

const getSourceImage = async (bucket, key) => {
  return s3.getObject({Bucket: bucket, Key: key})
    .promise()
    .then(data => data.Body); // data.Body.toString('base64')
};

const getBoundingBoxes = (faces) => {
  return faces.map((face) => {
    let colour = '#' + Math.floor(Math.random() * 16777215).toString(16);

    const meta = {
      width: 1280,
      height: 720
    };

    const box = face.BoundingBox;

    // For each bounding box, we generate an SVG rectangle as described here:
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect
    return `<rect height="${box.Height*meta.height}" width="${box.Width*meta.width}" x="${box.Left*meta.width}" y="${box.Top*meta.height}" style="fill: none; stroke: ${colour}; stroke-width: 5"/>`;
  });
};

const tweeeeeeeet = (media_data, status) => {
  return client
      .post('media/upload', { media_data })
      .then((media) => {
        const message = {
          status: status,
          media_ids: media.media_id_string
        };
        return client.post('statuses/update', message);
      });
};

module.exports.recognise = async (event, context, callback) => {
  return await Promise.all(
    event.Records.map(async record => {
      const params = {
        Attributes: ["ALL"],
        Image: {
          S3Object: {
            Bucket: record.s3.bucket.name,
            Name: record.s3.object.key
          }
        }
      };

      const faces = await getFaces(params);
      const emotions = await getEmotions(faces);

      const image = await getSourceImage(record.s3.bucket.name, record.s3.object.key);
      const sharp = require("sharp");
      await sharp(image)
        .composite([{
          input: new Buffer(`<svg height="720" width="1280" viewbox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">${getBoundingBoxes(faces).join()}</svg>`),
          blend: 'over'
        }])
        .toBuffer()
        .then(data => {
          return tweeeeeeeet(data.toString('base64'), emotions.join("\n"))
        });

      return Promise.resolve(emotions);
    })
  );
};
