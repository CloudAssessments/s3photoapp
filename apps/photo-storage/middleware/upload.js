const isValidFilename = key => key.match(/\w.+(jpg|png|bmp)$/);
const sendServerError = res => res.status(500).json({ code: 'InternalServerError' });

module.exports = deps => (req, res) => {
  try {
    req.pipe(req.busboy);
    req.busboy.on('file', (_, Body, Key) => {
      if (!isValidFilename(Key)) {
        return res.status(400).json({
          message: 'Name of file is invalid. Must be jpg, png, or bmp',
        });
      }

      deps.s3Store.upload(req.params.bucket, { Body, Key })
        .then((result) => {
          res.json({
            bucket: result.Bucket,
            key: result.key,
            url: result.Location,
          });
        })
        .catch((e) => {
          // surface errors from s3
          if (e.statusCode && e.code && e.message) {
            return res.status(e.statusCode).json({
              code: e.code,
              message: e.message,
            });
          }

          sendServerError(res);
        });
    });
  } catch (e) { sendServerError(res); }
};
