# How to Deploy to Amazon S3

1. [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html).
2. `export PROD=1; export PUBLIC_ROOT="http://{bucket-name}.s3-website-{region}.amazonaws.com/js/"`
3. `npm run build`
4. `aws s3 cp ./build s3://{bucket-name}/js/ --exclude "*.html" --acl public-read --recursive`
