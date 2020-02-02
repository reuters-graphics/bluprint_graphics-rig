const AWS = require('aws-sdk');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const open = require('open');
const mime = require('mime-types');
const cryptoRandomString = require('crypto-random-string');
const logger = require('../../config/utils/logger')('AWS Publish');
const getPackageProp = require('../../config/utils/getPackageProp');
const setPackageProp = require('../../config/utils/setLocaleProp');

const DIST_ROOT = path.resolve(__dirname, '../../dist/');
const BUCKET_NAME = 'test-bucket';

const s3 = new AWS.S3();

const getHash = () => {
  const { awsPreviewHash } = getPackageProp('reuters');

  if (awsPreviewHash) return awsPreviewHash;

  const hash = cryptoRandomString({ length: 12, type: 'url-safe' });
  setPackageProp('reuters.rigId', hash);
  return hash;
};

const uploadFile = async(relativePath, hash) => {
  const absolutePath = path.resolve(DIST_ROOT, relativePath);

  const fileContent = fs.readFileSync(absolutePath);

  const bucketPath = path.join('testfiles', hash, relativePath);

  const params = {
    Bucket: BUCKET_NAME,
    Key: bucketPath,
    Body: fileContent,
    CacheControl: 'no-cache',
    ACL: 'public-read',
    ContentType: mime.contentType(path.extname(absolutePath)),
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function(err, data) {
      if (err) reject(err);
      resolve();
    });
  });
};

const uploadDist = async() => {
  const files = glob.sync('**/*', { cwd: DIST_ROOT });

  const hash = getHash();

  logger.info('Uploading dist directory to AWS...');

  for (const i in files) {
    const file = files[i];
    await uploadFile(file, hash);
  }

  await open(`https://TK/testfiles/${hash}/en`);
};

uploadDist();
