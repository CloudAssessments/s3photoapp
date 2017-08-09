/*
  Copyright 2017 Linux Academy
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const { DynamoDB, S3 } = require('aws-sdk');
const deleteAllItems = require('../util/deleteAllItems');
const getS3BucketUuid = require('../util/getS3BucketUuid');

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const STAGE = process.env.STAGE || 'dev';
const DYNAMO_TABLE = 's3-photos-bucket-id';

const dynamodb = new DynamoDB({ region: AWS_REGION });
const s3 = new S3({ region: AWS_REGION });


getS3BucketUuid(dynamodb)(DYNAMO_TABLE)

  .then(uuid => `s3-photos-${STAGE}-${uuid}`)

  .then(deleteAllItems(s3))

  .then(() => process.exit(0))

  .catch((err) => {
    if (err.errored) {
      return process.exit(0);
    }

    console.error('ERROR: ', err);
    process.exit(1);
  });
