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
        err: {
          message: err.message,
          name: err.name,
        },
      }));
    });
  } catch (e) {
    res.redirect(`/?uploadRes=${JSON.stringify({ err: 'broken pipe' })}`);
  }
};
