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

module.exports = (req, res, next) => {
  const greyscaleUrl = `${req.deps.filterApiUrl}/greyscale`;

  const redirect = err => res.redirect(`/?err=${err}`);

  const requestParams = {
    method: 'POST',
    uri: greyscaleUrl,
    body: res.locals.image.buffer,
    headers: {
      'content-type': res.locals.image.mimeType,
    },
    encoding: null,
  };

  req.deps.request(requestParams, (err, result, buffer) => {
    if (err) {
      return redirect(JSON.stringify({
        name: err.name,
        message: err.message,
      }));
    }

    if (result.statusCode !== 200) {
      return buffer ?
        redirect(buffer.toString()) :
        redirect(JSON.stringify({ code: 'InternalServerError' }));
    }

    if (buffer) {
      res.locals.editedImage = buffer;
      return next();
    }

    redirect(JSON.stringify({
      code: 'FilterFailed',
      message: 'Invalid response from photo-filter service',
    }));
  });
};
