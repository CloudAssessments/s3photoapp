module.exports = (req, res) => {
  let data = '';

  const redirect = ctx => (ctx ?
    res.redirect(`/?uploadRes=${ctx}`) :
    res.redirect('/')
  );

  try {
    const pipeToUrl = `${req.deps.photoApiUrl}/bucket/${req.deps.s3Bucket}/photos`;
    const pipe = req.pipe(req.deps.request(pipeToUrl));

    pipe.on('data', (chunk) => {
      data += chunk;
    });

    pipe.on('end', () => {
      // redirect back to homepage with upload response
      redirect(data);
    });

    pipe.on('error', (err) => {
      redirect(JSON.stringify({
        message: err.message,
        name: err.name,
      }));
    });
  } catch (e) {
    res.redirect(`/?uploadRes=${JSON.stringify({ err: 'broken pipe' })}`);
  }
};
