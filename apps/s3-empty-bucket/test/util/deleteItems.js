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
const deleteItems = require('../../util/deleteItems');

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockS3 = {
    deleteObjects: sinon.mock(),
  };
});

test('deleteItems should delete a list of items in a bucket', (t) => {
  const keys = [
    { Key: 'img1.jpg' },
    { Key: 'img2.jpg' },
  ];

  const params = {
    Bucket: 'testBucket',
    Delete: {
      Objects: keys,
    },
  };

  const deleteRes = {
    Deleted: keys,
    Errors: [],
  };

  t.context.mockS3.deleteObjects
    .once()
    .withArgs(params)
    .returns({
      promise: sinon.mock()
        .withArgs()
        .resolves(deleteRes),
    });

  return deleteItems(t.context.mockS3)('testBucket', keys)
    .then((res) => {
      t.deepEqual(res, deleteRes);
      t.context.mockS3.deleteObjects.verify();
    });
});

test('deleteItems should accept an optional cursor', (t) => {
  const keys = [
    { Key: 'img1.jpg' },
    { Key: 'img2.jpg' },
  ];

  const params = {
    Bucket: 'testBucket',
    Delete: {
      Objects: keys,
    },
    StartAfter: 'testCursor',
  };

  const deleteRes = {
    Deleted: keys,
    Errors: [],
  };

  t.context.mockS3.deleteObjects
    .once()
    .withArgs(params)
    .returns({
      promise: sinon.mock()
        .withArgs()
        .resolves(deleteRes),
    });

  return deleteItems(t.context.mockS3)('testBucket', keys, 'testCursor')
    .then((res) => {
      t.deepEqual(res, deleteRes);
      t.context.mockS3.deleteObjects.verify();
    });
});
