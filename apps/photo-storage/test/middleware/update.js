const { test } = require('ava');
const busboy = require('connect-busboy');
const sinon = require('sinon');
const upload = require('../../middleware/upload.js');


test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    status: sinon.mock(),
    json: sinon.mock(),
    send: sinon.mock(),
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

  t.context.mockRes.send
    .once()
    .withArgs({ code: 'InternalServerError' })
    .returns();

  console.log('debugT1', upload({})(t.context.mockReq, t.context.mockRes));
  t.context.mockReq.pipe.verify();
  t.context.mockRes.status.verify();
  t.context.mockRes.send.verify();
  t.pass();
});
