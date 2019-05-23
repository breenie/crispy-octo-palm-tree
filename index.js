#!/usr/bin/env node

const config = {
  bucket: process.env["BUCKET"],
  queue: process.env["QUEUE"],
  accountId: process.env["AWS_ACCOUNT_ID"],
  region: process.env["AWS_DEFAULT_REGION"] || "eu-west-1",
  format: "png" // Note node-webcam expects "jpeg" not "jpg"
};

const commander = require("commander");
const webcam = require("./lib/webcam");
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({region: config['region']});

const getQueueUrl = (name) => {

  return new Promise((resolve, reject) => {
    sqs.getQueueUrl({QueueName: name, QueueOwnerAWSAccountId: config['accountId']})
      .promise()
      .then((data) => {
        resolve(data["QueueUrl"]);
      })
      .catch(reject);
  });
};


const program = {
  snap: () => {
    webcam(config)
      .then((path) => {
        console.log(`Successfully uploaded to s3://${path}`);
        return path;
      })
      .catch(console.error);

  },
  monitor: async () => {
    const queueUrl = await getQueueUrl(config.queue);

    console.log(`Listening to ${queueUrl}...`);

    sqs.receiveMessage({
      MessageAttributeNames: [
        "All"
      ],
      MaxNumberOfMessages: 1,
      QueueUrl: queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 20
    })
      .promise()
      .then((data) => {
        if (data.Messages) {
          data.Messages.map(record => {
            const message = JSON.parse(record.Body);

            console.log(message);

            if (message.action && 'snappy-snap' === message.action) {
              program.snap();


            }
          });
        }
      }).catch(console.log);
  },
  invoke: async () => {
    const queueUrl = await getQueueUrl(config.queue);

    console.log(`Sending message to ${queueUrl}...`);

    sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({action: "snappy-snap"}),
    })
      .promise()
      .then((data) => {
        console.log(`Sent MessageId: ${data['MessageId']}`);
      }).catch(console.log);

  }
};

commander.arguments("<action>")
  .action((action, cmd) => {
    try {
      program[action].apply(null);
    } catch (e) {
      console.log("No idea what to do for", action);
    }
  });

commander.parse(process.argv)