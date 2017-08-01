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
const sinon = require('sinon');
const homepage = require('../../middleware/homepage.js');

const testBucket = 'testBucket';

const verifyMocks = (t) => {
  t.context.mockRes.render.verify();
  t.context.mockRequest.get.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    render: sinon.mock(),
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockRequest = {
    get: sinon.mock(),
  };
});

test.cb('should render index with list of photo urls', (t) => {
  const req = {
    deps: {
      photoApiUrl: 'http://localhost:test',
      s3Bucket: testBucket,
      request: t.context.mockRequest,
    },
  };

  const urlList = [
    `https://s3.amazonaws.com/s3-photos-test-${testBucket}/foo.jpg_256`,
    `https://s3.amazonaws.com/s3-photos-test-${testBucket}/bar.jpg_256`,
    `https://s3.amazonaws.com/s3-photos-test-${testBucket}/buzz.jpg_256`,
  ];

  t.context.mockRequest.get
    .once()
    .callsFake((getPhotosUrl, cb) => {
      t.is(getPhotosUrl, `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`);
      cb(null, { statusCode: 200 }, JSON.stringify({ photos: urlList }));
    });

  t.context.mockRes.render
    .callsFake((viewFile, ctx) => {
      t.is(viewFile, 'index');
      t.is(ctx.bucket, req.deps.s3Bucket);
      t.deepEqual(ctx.urls, urlList);
      verifyMocks(t);
      t.end();
    });

  homepage(req, t.context.mockRes);
});

test.cb('should render index with err if getPhotos does not return 200 status', (t) => {
  const req = {
    deps: {
      photoApiUrl: 'http://localhost:test',
      s3Bucket: testBucket,
      request: t.context.mockRequest,
    },
  };

  t.context.mockRequest.get
    .once()
    .callsFake((getPhotosUrl, cb) => {
      t.is(getPhotosUrl, `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`);
      cb(null, { statusCode: 404 }, JSON.stringify({ code: 'NotFound' }));
    });

  t.context.mockRes.render
    .callsFake((viewFile, ctx) => {
      t.is(viewFile, 'index');
      t.is(ctx.err.code, 'NotFound');
      verifyMocks(t);
      t.end();
    });

  homepage(req, t.context.mockRes);
});

test.cb('should render index with err if getPhotos does not return a body', (t) => {
  const req = {
    deps: {
      photoApiUrl: 'http://localhost:test',
      s3Bucket: testBucket,
      request: t.context.mockRequest,
    },
  };

  t.context.mockRequest.get
    .once()
    .callsFake((getPhotosUrl, cb) => {
      t.is(getPhotosUrl, `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`);
      cb(null, { statusCode: 200 });
    });

  t.context.mockRes.render
    .callsFake((viewFile, ctx) => {
      t.is(viewFile, 'index');
      t.is(ctx.err, 'No response body');
      verifyMocks(t);
      t.end();
    });

  homepage(req, t.context.mockRes);
});

test.cb('should render index with err if error is returned by getPhotos', (t) => {
  const req = {
    deps: {
      photoApiUrl: 'http://localhost:test',
      s3Bucket: testBucket,
      request: t.context.mockRequest,
    },
  };

  t.context.mockRequest.get
    .once()
    .callsFake((getPhotosUrl, cb) => {
      t.is(getPhotosUrl, `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`);
      cb(new Error('oops'));
    });

  t.context.mockRes.render
    .callsFake((viewFile, ctx) => {
      t.is(viewFile, 'index');
      t.is(ctx.err.message, 'oops');
      verifyMocks(t);
      t.end();
    });

  homepage(req, t.context.mockRes);
});

test.cb('should render index with err if getPhotos response body is not json', (t) => {
  const req = {
    deps: {
      photoApiUrl: 'http://localhost:test',
      s3Bucket: testBucket,
      request: t.context.mockRequest,
    },
  };

  t.context.mockRequest.get
    .once()
    .callsFake((getPhotosUrl, cb) => {
      t.is(getPhotosUrl, `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`);
      cb(null, null, '{ foo: bar }');
    });

  t.context.mockRes.render
    .callsFake((viewFile, ctx) => {
      t.is(viewFile, 'index');
      t.is(ctx.err.code, 'ParseError');
      t.is(ctx.err.message, 'Could not parse: { foo: bar }');
      verifyMocks(t);
      t.end();
    });

  homepage(req, t.context.mockRes);
});
