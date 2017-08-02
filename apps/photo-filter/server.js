const app = require('express')();
const bodyParser = require('body-parser');
const jimp = require('jimp');

const PORT = process.env.API_PORT || 3002;

app.use(bodyParser.raw({ limit: '5mb', type: 'image/*' }));

app.use((req, res, next) => {
  req.deps = { jimp };
  next();
});

app.get('/', (req, res) => {
  res.send('welcome to the photo-filter api');
});

// Endpoint: Apply greyscale filter to an image
app.post('/greyscale', require('./routes/greyscale'));

// catch all if a path does not exist
app.use((req, res) => {
  res.status(404).json({ code: 'RouteNotFound' });
});

app.listen(PORT, () => {
  console.log(`Photo Storage API listening on http://localhost:${PORT}`);
});
