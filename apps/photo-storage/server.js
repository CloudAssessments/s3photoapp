const app = require('express')();
const busboy = require('connect-busboy');
const s3Store = require('./stores/s3')();

const PORT = process.env.API_PORT || 3001;
const DEPS = { s3Store };

app.use(busboy());

app.get('/', (req, res) => {
  res.send('welcome to the photo-storage api');
});

// Endpoint: Upload Photo (and create bucket if does not exist)
app.post(
  '/bucket/:bucket/photos',
  require('./middleware/assertBucket')(DEPS),
  require('./middleware/upload')(DEPS)
);

// Endpoint: List Photo URLs
app.get('/bucket/:bucket/photos', require('./middleware/listUrls')(DEPS));

// Endpoint: Get Photo URL
app.get('/bucket/:bucket/photos/:photo', require('./middleware/getUrl')(DEPS));

// catch all if a path does not exist
app.use((req, res) => {
  res.status(404).json({ code: 'RouteNotFound' });
});

app.listen(PORT, () => {
  console.log(`Photo Storage API listening on http://localhost:${PORT}`);
});
