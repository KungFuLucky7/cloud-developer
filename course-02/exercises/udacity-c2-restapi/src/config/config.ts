export const config = {
  "dev": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host": process.env.AWS_DATABASE_HOST,
    "dialect": "postgres",
    "aws_region": "us-west-1",
    "aws_profile": "default",
    "aws_media_bucket": process.env.AWS_S3_BUCKET
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "",
    "host": "",
    "dialect": "postgres"
  }
}
