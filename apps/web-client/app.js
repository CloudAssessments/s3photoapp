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

const { DynamoDB } = require('aws-sdk');
const express = require('express');
const logger = require('morgan');
const multer = require('multer')();
const path = require('path');
const request = require('request');
const { v4: uuid } = require('uuid');

const app = express();
const dynamodb = new DynamoDB({ region: process.env.AWS_REGION || 'us-east-1' });

const filterHost = process.env.FILTER_HOST || 'localhost';
const storageHost = process.env.STORAGE_HOST || 'localhost';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// inject dependencies into app.locals
app.locals = {
  request,
  uuid,
  dynamodb,
  filterApiUrl: `http://${filterHost}:${process.env.FILTER_PORT}`,
  photoApiUrl: `http://${storageHost}:${process.env.STORAGE_PORT}`,
  table: 's3-photos-bucket-id',
};

// Get Or Create the S3 Bucket Id
app.use(require('./middleware/getOrCreateS3BucketId'));

// Routes: Homepage
app.get('/', require('./routes/homepage'));

// Routes: Upload Image
app.post(
  '/photo',
  multer.single('uploadedImage'),
  require('./routes/multipartToImage'),
  require('./routes/filterGreyscale'),
  require('./routes/upload')
);

module.exports = app;
