import { S3Client } from '@aws-sdk/client-s3';
const REGION = 'eu-central-1';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_AWS ?? '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS ?? '',
  },
});
