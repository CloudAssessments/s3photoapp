
Picture Upload
===================

PO: Anthony James

A multi-project repo of services that work together to form a demo to enable users to get and upload photos to Amazon S3.

## Development Installation
1. Clone the repository into your local machine
1. Go into the new folder `s3-photos` folder and run `make install`

## Development Deployment
1. Install via `Development Installation` instructions
1. Ensure that you have completed AWS CLI configuration on your host machine (see: [Configuring the AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html))
1. Go into each folder in `s3-photos/apps` and run `npm run dev`