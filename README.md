# Push webcam still to S3

## Installation

Install the required binaries...

### Linux

```sh 
sudo apt-get install fswebcam
```

### Mac OSX

```sh
brew install imagesnap
```

See [node-webcam](https://www.npmjs.com/package/node-webcam) for more details.

Install the node dependencies...

```sh
npm install
```

Install complete.

## Usage

### Configuration

Required environment variables:

- *BUCKET* The S3 bucket name

Optional environment variables:

- *AWS_DEFAULT_REGION* The S3 region (this doesn't seem to play nicely using profiles, probably due to the way the region is associated in the script)
- *AWS_ACCESS_KEY_ID* 
- *AWS_SECRET_ACCESS_KEY*  

### Pushing an image

```sh
node webcam.js
{ ETag: '"36b72d2a9943bcc66abd57281b5e71cc"' }
Successfully uploaded to s3://jibber-jabber/c34dd9fc-028e-412d-b3d6-850acc56fabc.jpeg
```

On a mac you'll be asked to allow node access to your camera. If you want it to work you'll have to allow it.

Make sure you smile and then check your S3 bucket. The image is also written to `./test.jpg` if you want to view it locally.