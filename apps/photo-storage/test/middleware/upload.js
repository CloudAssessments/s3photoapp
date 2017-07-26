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

const { test } = require('ava');
const EventEmitter = require('events');
const sinon = require('sinon');
const upload = require('../../middleware/upload.js');

const verifyMocks = (t) => {
  t.context.mockRes.status.verify();
  t.context.mockRes.json.verify();
  t.context.mockReq.pipe.verify();
  t.context.mockS3Store.upload.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    status: sinon.mock(),
    json: sinon.mock(),
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockReq = {
    pipe: sinon.mock(),
    busboy: new EventEmitter(),
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockS3Store = {
    upload: sinon.mock(),
  };
});

test.cb('should return upload details on success', (t) => {
  const uploadRes = {
    Bucket: 'testBucket',
    key: 'testKey.jpg',
    location: 'www.aws.s3/testBucket/testKey.jpg.com',
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockReq.params = { bucket: uploadRes.Bucket };

  t.context.mockReq.pipe
    .once()
    .callsFake((busboy) => {
      busboy.emit('file', null, 'testBody', uploadRes.key);
    });

  t.context.mockS3Store.upload
    .once()
    .withArgs(uploadRes.Bucket, { Body: 'testBody', Key: uploadRes.key })
    .resolves(uploadRes);

  t.context.mockRes.status.never();

  t.context.mockRes.json
    .once()
    .callsFake((response) => {
      t.is(response.bucket, uploadRes.Bucket);
      t.is(response.key, uploadRes.key);
      t.is(response.location, uploadRes.Location);
      verifyMocks(t);
      t.end();
    });

  upload({ s3Store: t.context.mockS3Store })(t.context.mockReq, t.context.mockRes);
});

test.cb('should surface s3 errors if thrown', (t) => {
  const s3Error = {
    statusCode: 403,
    code: 'InvalidAccessKeyId',
    message: 'The AWS Access Key Id you provided does not exist in our records.',
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockReq.params = { bucket: 'testBucket' };

  t.context.mockReq.pipe
    .once()
    .callsFake((busboy) => {
      busboy.emit('file', null, 'testBody', 'testKey.jpg');
    });

  t.context.mockS3Store.upload
    .once()
    .withArgs('testBucket', { Body: 'testBody', Key: 'testKey.jpg' })
    .rejects(s3Error);

  t.context.mockRes.status
    .once()
    .withArgs(s3Error.statusCode)
    .returns(t.context.mockRes);

  t.context.mockRes.json
    .once()
    .callsFake((response) => {
      t.is(response.code, s3Error.code);
      t.is(response.message, s3Error.message);
      verifyMocks(t);
      t.end();
    });

  upload({ s3Store: t.context.mockS3Store })(t.context.mockReq, t.context.mockRes);
});

test.cb('should return validation error if filename is invalid', (t) => {
  t.context.mockS3Store.upload.never();

  t.context.mockReq.pipe
    .once()
    .callsFake((busboy) => {
      busboy.emit('file', null, 'testBody', 'testKey');
    });

  t.context.mockRes.status
    .once()
    .withArgs(400)
    .returns(t.context.mockRes);

  t.context.mockRes.json
    .once()
    .callsFake((response) => {
      t.is(response.code, 'InvalidFileName');
      t.is(response.message, 'Name of file is invalid. Must be jpg, png, or bmp');
      verifyMocks(t);
      t.end();
    });

  upload({ s3Store: t.context.mockS3Store })(t.context.mockReq, t.context.mockRes);
});

test.cb('should return 500 statusCode if unexpected rejected error', (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockReq.params = { bucket: 'testBucket' };

  t.context.mockReq.pipe
    .once()
    .callsFake((busboy) => {
      busboy.emit('file', null, 'testBody', 'testKey.jpg');
    });

  t.context.mockReq.pipe.atMost(1);

  t.context.mockS3Store.upload
    .once()
    .rejects(new Error('foo'));

  t.context.mockRes.status
    .once()
    .withArgs(500)
    .returns(t.context.mockRes);

  t.context.mockRes.json
    .once()
    .callsFake((response) => {
      t.is(response.code, 'InternalServerError');
      verifyMocks(t);
      t.end();
    });

  upload({ s3Store: t.context.mockS3Store })(t.context.mockReq, t.context.mockRes);
});


test.cb('should return 500 statusCode if unexpected thrown error', (t) => {
  t.context.mockS3Store.upload.never();

  t.context.mockReq.pipe
    .once()
    .throws(new Error('oops'));

  t.context.mockRes.status
    .once()
    .withArgs(500)
    .returns(t.context.mockRes);

  t.context.mockRes.json
    .once()
    .callsFake((response) => {
      t.is(response.code, 'InternalServerError');
      verifyMocks(t);
      t.end();
    });

  upload({ s3Store: t.context.mockS3Store })(t.context.mockReq, t.context.mockRes);
});
