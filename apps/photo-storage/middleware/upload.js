const isValidFilename = key => key.match(/\w.+(jpg|png|bmp)$/);

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
          if (e.statusCode === 403) {
            // {
            //     "code": "AccessDenied",
            //     "message": "Access Denied"
            // }

            // {
            //     "code": "InvalidAccessKeyId",
            //     "message": "The AWS Access Key Id you provided does not exist in our records."
            // }

            // {
            //     "code": "SignatureDoesNotMatch",
            //     "message": "The request signature we calculated does not match the signature you provided. Check your key and signing method."
            // }
            return res.status(403).json({ code: e.code, message: e.message });
          }

          return res.status(500).send({ code: 'InternalServerError' });
        });
    });
  } catch (e) { return res.status(500).send({ code: 'InternalServerError' }); }
};
