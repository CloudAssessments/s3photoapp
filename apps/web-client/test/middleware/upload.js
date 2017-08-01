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

const testBucket = 'testBucket';

const verifyMocks = (t) => {
  t.context.mockRes.redirect.verify();
  t.context.mockRequest.verify();
  t.context.mockPipe.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    redirect: sinon.mock(),
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockRequest = sinon.mock();

  // eslint-disable-next-line no-param-reassign
  t.context.mockPipe = sinon.mock();
});

test.cb('should redirect to homepage with upload response', (t) => {
  let pipe;

  const uploadRes = {
    Bucket: 'testBucket',
    key: 'testKey.jpg',
    location: 'www.aws.s3/testBucket/testKey.jpg.com',
  };

  const req = {
    pipe: t.context.mockPipe,
    deps: {
      photoApiUrl: 'http://localhost:test',
      s3Bucket: testBucket,
      request: t.context.mockRequest,
    },
  };

  t.context.mockPipe
    .once()
    .callsFake(() => {
      pipe = new EventEmitter();
      return pipe;
    });

  t.context.mockRequest
    .once()
    .callsFake((url) => {
      t.is(url, `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`);
    });

  t.context.mockRes.redirect
    .callsFake((url) => {
      t.is(url, `/?uploadRes=${JSON.stringify(uploadRes)}`);
      verifyMocks(t);
      t.end();
    });

  upload(req, t.context.mockRes);
  pipe.emit('data', JSON.stringify(uploadRes));
  pipe.emit('end');
});

test.cb('should redirect to homepage if upload responds with no data', (t) => {
  let pipe;

  const req = {
    pipe: t.context.mockPipe,
    deps: {
      photoApiUrl: 'http://localhost:test',
      s3Bucket: testBucket,
      request: t.context.mockRequest,
    },
  };

  t.context.mockPipe
    .once()
    .callsFake(() => {
      pipe = new EventEmitter();
      return pipe;
    });

  t.context.mockRequest
    .once()
    .callsFake((url) => {
      t.is(url, `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`);
    });

  t.context.mockRes.redirect
    .callsFake((url) => {
      t.is(url, '/');
      verifyMocks(t);
      t.end();
    });

  upload(req, t.context.mockRes);
  pipe.emit('end');
});

test.cb('should redirect to homepage with error', (t) => {
  let pipe;

  const req = {
    pipe: t.context.mockPipe,
    deps: {
      photoApiUrl: 'http://localhost:test',
      s3Bucket: testBucket,
      request: t.context.mockRequest,
    },
  };

  t.context.mockPipe
    .once()
    .callsFake(() => {
      pipe = new EventEmitter();
      return pipe;
    });

  t.context.mockRequest
    .once()
    .callsFake((url) => {
      t.is(url, `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`);
    });

  t.context.mockRes.redirect
    .callsFake((url) => {
      t.is(url, `/?uploadRes=${JSON.stringify({
        err: {
          message: 'oops',
          name: 'Error',
        },
      })}`);
      verifyMocks(t);
      t.end();
    });

  upload(req, t.context.mockRes);
  pipe.emit('error', new Error('oops'));
});

test.cb('should redirect to homepage with thrown error', (t) => {
  const req = {
    pipe: t.context.mockPipe,
    deps: {
      photoApiUrl: 'http://localhost:test',
      s3Bucket: testBucket,
      request: t.context.mockRequest,
    },
  };

  t.context.mockPipe
    .once()
    .throws(new Error('oops'));

  t.context.mockRequest
    .once()
    .callsFake((url) => {
      t.is(url, `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`);
    });

  t.context.mockRes.redirect
    .callsFake((url) => {
      t.is(url, `/?uploadRes=${JSON.stringify({ err: 'broken pipe' })}`);
      verifyMocks(t);
      t.end();
    });

  upload(req, t.context.mockRes);
});
