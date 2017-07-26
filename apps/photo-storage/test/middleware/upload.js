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
const upload = require('../../middleware/upload.js');

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    status: sinon.mock(),
    json: sinon.mock(),
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockReq = {
    pipe: sinon.mock(),
    busboy: sinon.mock(),
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockS3Store = {
    upload: sinon.mock(),
  };
});

test('should return 500 statusCode if unexpected error thrown', (t) => {
  t.context.mockReq.pipe
    .once()
    .throws(new Error('oops'));

  t.context.mockRes.status
    .once()
    .withArgs(500)
    .returns(t.context.mockRes);

  t.context.mockRes.json
    .once()
    .withArgs({ code: 'InternalServerError' })
    .returns();

  upload({})(t.context.mockReq, t.context.mockRes);
  t.context.mockReq.pipe.verify();
  t.context.mockRes.status.verify();
  t.context.mockRes.json.verify();
  t.pass();
});
