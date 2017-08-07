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
const listItems = require('../../util/listItems');

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockS3 = {
    listObjectsV2: sinon.mock(),
  };
});

test('listItems should get a list of items in a bucket', (t) => {
  const params = {
    Bucket: 'testBucket',
  };

  const listRes = {
    Contents: [
      { Key: 'img1.jpg' },
      { Key: 'img2.jpg' },
    ],
    Name: 'testBucket',
    MaxKeys: 1000,
  };

  t.context.mockS3.listObjectsV2
    .once()
    .withArgs(params)
    .returns({
      promise: sinon.mock()
        .withArgs()
        .resolves(listRes),
    });

  return listItems(t.context.mockS3)('testBucket')
    .then((res) => {
      t.deepEqual(res, listRes);
      t.context.mockS3.listObjectsV2.verify();
    });
});

test('listItems should accept an optional cursor', (t) => {
  const params = {
    Bucket: 'testBucket',
    StartAfter: 'testCursor',
  };

  const listRes = {
    Contents: [
      { Key: 'img1.jpg' },
      { Key: 'img2.jpg' },
    ],
    Name: 'testBucket',
    MaxKeys: 1000,
  };

  t.context.mockS3.listObjectsV2
    .once()
    .withArgs(params)
    .returns({
      promise: sinon.mock()
        .withArgs()
        .resolves(listRes),
    });

  return listItems(t.context.mockS3)('testBucket', 'testCursor')
    .then((res) => {
      t.deepEqual(res, listRes);
      t.context.mockS3.listObjectsV2.verify();
    });
});
