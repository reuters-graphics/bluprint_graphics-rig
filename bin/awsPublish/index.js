const AWS = require('aws-sdk');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const open = require('open');
const chalk = require('chalk');
const mime = require('mime-types');
const cryptoRandomString = require('crypto-random-string');
const logger = require('../../config/utils/logger')('AWS Publish');
const getPackageProp = require('../../config/utils/getPackageProp');
const setPackageProp = require('../../config/utils/setPackageProp');

const DIST_ROOT = path.resolve(__dirname, '../../dist/');
const BUCKET_NAME = 'graphics.thomsonreuters.com';

const LOGFILE = path.join(process.cwd(), '.aws.publish.log');

const s3 = new AWS.S3({ region: 'us-east-1' });

const getLog = () => {
  if (!fs.existsSync(LOGFILE)) fs.writeFileSync(LOGFILE, '{}');
  return JSON.parse(fs.readFileSync(LOGFILE, 'utf-8'), (k, v) => {
    return typeof v === 'string' ? new Date(v) : v;
  });
};

const writeLog = () => fs.writeFileSync(LOGFILE, JSON.stringify(log));

const getURI = () => {
  const { awsPreviewURI } = getPackageProp('reuters');

  if (awsPreviewURI) return awsPreviewURI;

  const hash = cryptoRandomString({ length: 12, type: 'url-safe' }).replace(/[^A-Za-z0-9]/g, '');
  const URI = `${new Date().getFullYear()}/${hash}`;
  setPackageProp('reuters.awsPreviewURI', URI);
  return URI;
};

const uploadFile = async(relativePath, uri) => {
  const absolutePath = path.resolve(DIST_ROOT, relativePath);

  const currentMtime = fs.statSync(absolutePath).mtime;

  const lastMTime = log[relativePath];

  if (lastMTime && currentMtime <= lastMTime) {
    logger.info(chalk`{green.dim Skip} {yellow.dim ${relativePath}}`);
    return;
  } else {
    logger.info(chalk`{green.dim Send} {yellow.dim ${relativePath}}`);
    log[relativePath] = currentMtime;
  }

  const fileContent = fs.readFileSync(absolutePath);

  const bucketPath = path.join('testfiles', uri, relativePath);

  const params = {
    Bucket: BUCKET_NAME,
    Key: bucketPath,
    Body: fileContent,
    CacheControl: 'no-cache',
    ContentType: mime.contentType(path.extname(absolutePath)),
  };

  return new Promise((resolve, reject) => {
    s3.putObject(params, function(err, data) {
      if (err) reject(err);
      resolve();
    });
  });
};

const uploadDist = async() => {
  const files = glob.sync('**/*', { cwd: DIST_ROOT, nodir: true });
  const uri = getURI();

  logger.info('Uploading dist directory to AWS...');
  await Promise.all(files.map(file => uploadFile(file, uri)));
  // for (const i in files) {
  //   const file = files[i];
  //   await uploadFile(file, uri);
  // }

  writeLog();

  const URL = `https://graphics.thomsonreuters.com/testfiles/${uri}/en/`;

  await open(URL);
  logger.info(chalk`Page published at:\n\n {green ${URL}}\n`);
};

const log = getLog();

uploadDist();
