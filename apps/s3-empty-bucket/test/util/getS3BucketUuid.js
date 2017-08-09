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
const getS3BucketUuid = require('../../util/getS3BucketUuid');

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockDynamo = {
    getItem: sinon.mock(),
  };
});

test('getS3BucketUuid retrieve the s3BucketId from the table', (t) => {
  const params = {
    TableName: 'testTable',
    Key: { id: { S: '1' } },
  };

  t.context.mockDynamo.getItem
    .once()
    .withArgs(params)
    .returns({
      promise: sinon.mock()
        .withArgs()
        .resolves({
          Item: {
            s3BucketId: {
              S: 'someUuid',
            },
          },
        }),
    });

  return getS3BucketUuid(t.context.mockDynamo)('testTable')
    .then((res) => {
      t.is(res, 'someUuid');
      t.context.mockDynamo.getItem.verify();
    });
});

test('getS3BucketUuid should throw error if item does not exist', (t) => {
  const params = {
    TableName: 'testTable',
    Key: { id: { S: '1' } },
  };

  t.context.mockDynamo.getItem
    .once()
    .withArgs(params)
    .returns({
      promise: sinon.mock()
        .withArgs()
        .resolves({}),
    });

  return getS3BucketUuid(t.context.mockDynamo)('testTable')
    .catch((err) => {
      t.is(err.errored, false);
      t.is(err.message, 'Table does not exist, therefore table is empty');
    });
});
