const app = require('express')();
const bodyParser = require('body-parser');
const s3Store = require('./stores/s3')();

const PORT = process.env.API_PORT || 3001;

app.use(bodyParser.raw({ limit: '5mb', type: 'image/*' }));

app.use((req, res, next) => {
  req.deps = { s3Store };
  next();
});

app.get('/', (req, res) => {
  res.send('welcome to the photo-storage api');
});

// Endpoint: Upload an image
app.post(
  '/bucket/:bucket/photos/:photoName',
  require('./routes/assertBucket'),
  require('./routes/upload')
);

// Endpoint: List Photo urls
app.get('/bucket/:bucket/photos', require('./routes/listUrls'));

// Endpoint: Delete Photo
app.delete('/bucket/:bucket/photos/:photo', require('./routes/delete'));

// Endpoint: Get Photo URL
app.get('/bucket/:bucket/photos/:photo', require('./routes/getUrl'));

// catch all if a path does not exist
app.use((req, res) => {
  res.status(404).json({ code: 'RouteNotFound' });
});

app.listen(PORT, () => {
  console.log(`Photo Storage API listening on http://localhost:${PORT}`);
});
