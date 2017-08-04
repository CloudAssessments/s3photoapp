
Picture Upload
===================

PO: Anthony James

A multi-project repo of services that work together to form a demo to enable users to get and upload photos to Amazon S3.

## About this project
This project is composed of independent Node.js services:
- web-client: a front-end client for viewing and storing images
- photo-filter: a REST API for applying filters to a given image
- photo-storage: a REST API for creating, reading, and deleting images in Amazon S3


## Development Installation
1. Clone the repository into your local machine
1. Go into the new folder `s3-photos` folder and run `make install`

## Development Deployment

### Using your local machine
1. Install via `Development Installation` instructions
1. Ensure that you have completed AWS CLI configuration on your host machine (see: [Configuring the AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html))
1. Go into each folder in `s3-photos/apps` and run `npm run dev`

### Using Docker Compose
1. Ensure that you have installed Docker Compose (see: [Install Docker Compose](https://docs.docker.com/compose/install/))
1. Go into the `s3-photos` folder and run `docker-compose up` _(this may take several minutes)_

### Verifying Deployment
1. Navigate to the web-client homepage at [localhost:3000](localhost:3000)
2. Select an image file (jpeg, png, bmp only) and upload
3. Observe the image has had a greyscale filter applied to it and added to the list of images

## Environment Variables
### Environment Variable Reference

**web-client:**
- `FILTER_HOST`:
  - Default: "localhost"
  - Description: The host name of the url that the `photo-filter` service is listening on.
- `FILTER_PORT`:
  - Default: "3002"
  - Description: The port number of the url that the `photo-filter` service is listening on.
- `STORAGE_HOST`:
  - Default: "localhost"
  - Description: The host name of the url that the `photo-storage` service is listening on.
- `STORAGE_PORT`:
  - Default: "3002"
  - Description: The port number of the url that the `photo-filter` service is listening on.

**photo-filter:**
- `PORT`:
  - Default: "3002"
  - Description: The port number to listen on

**photo-storage:**
- `PORT`:
  - Default: "3001"
  - Description: The port number to listen on
- `STAGE`:
  - Default: none
  - Description: The deployment environment
- `AWS_DEFAULT_REGION`:
  - Default: none
  - Description: The region to send AWS S3 Requests to
- `AWS_ACCESS_KEY_ID`:
  - Default: none
  - Description: Your AWS Access Key Id
- `AWS_SECRET_ACCESS_KEY`:
  - Default: none
  - Description: Your AWS Secret Access Key

### Setting Environment Variables
You can temporarily set environment variables (macOS) in your current terminal via the following:
- `export AWS_DEFAULT_REGION=us-east-1`

If you are deploying using Docker Compose, environment variables are set in the `s3-photos/docker-compose.yml` file in the corresponding service under the `environments` property.
- Note: If the value is not set (i.e. `S3_BUCKET`), then they resolve to the corresponding environment variable on the machine Docker Compose is running on.