
Picture Upload
===================

PO: Anthony James

A multi-project repo of services that work together to form a demo to enable users to get and upload photos to Amazon S3.

## Development Installation
1. Clone the repository into your local machine
1. Move into each project in `/s3-photos/apps/` and run `npm install`
    - _Note: There is currently only one project (`photo-storage`) available right now_

## Running the services
### Photo Storage
1. Move into the photo storage app
    ```

    $ cd s3-photos/apps/photo-storage/
    $ npm run dev

    > photo-storage@1.0.0 dev /Users/jonathanlee/Code/s3-photos/apps/photo-storage
    > STAGE=dev nodemon server.js

    [nodemon] 1.11.0
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching: *.*
    [nodemon] starting `node server.js`
    Photo Storage API listening on http://localhost:3001
    ```
1. Verify connectivity by executing a GET request on the server url
    ```

    $ curl 'http://localhost:3001'; echo
    welcome to the photo-storage api
    ```