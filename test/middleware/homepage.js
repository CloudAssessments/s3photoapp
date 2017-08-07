const { test } = require('ava');
const sinon = require('sinon');
const middleware = require('../../src/middleware/homepage');

test.cb('should render index', (t) => {
  const render = sinon.mock()
    .once()
    .callsFake((viewFile) => {
      t.is(viewFile, 'index');
      t.end();
    });

  middleware({}, { render });
});
