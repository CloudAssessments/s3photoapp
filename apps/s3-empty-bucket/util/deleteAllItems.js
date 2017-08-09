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

const deleteItems = require('./deleteItems');
const listItems = require('./listItems');

const pickKeys = contents => contents.map(content => ({ Key: content.Key }));

const deleteAllItems = s3 => (bucket, cursor) => listItems(s3)(bucket, cursor)
  .then((listResult) => {
    if (listResult.Contents.length === 0) {
      return null;
    }

    return deleteItems(s3)(bucket, pickKeys(listResult.Contents))
      .then((deleteResult) => {
        if (deleteResult.Errors.length !== 0) {
          return Promise.reject({
            errored: true,
            message: 'S3 Delete Items request returned errors',
            errors: deleteResult.Errors,
          });
        }

        if (listResult.NextContinuationToken) {
          return deleteAllItems(s3)(bucket, listResult.NextContinuationToken);
        }

        return null;
      });
  });

module.exports = deleteAllItems;
