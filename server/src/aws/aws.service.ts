import { Injectable } from '@nestjs/common';
import { s3Client } from '../../libs/awsClient';
import { CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';
@Injectable()
export class AwsService {
  async create() {
    const params = {
      Bucket: 'e-commerce-app-food-images-bucket', // The name of the bucket. For example, 'sample-bucket-101'.
      Key: 'sample_object_name.txt', // The name of the object. For example, 'sample_upload.txt'.
      Body: 'Text for aws object in bucket ', // The content of the object. For example, 'Hello world!".
    };

    // Create an Amazon S3 bucket.

    // try {
    //   const data = await s3Client.send(
    //     new CreateBucketCommand({ Bucket: params.Bucket }),
    //   );
    //   console.log(data);
    //   console.log('Successfully created a bucket called ', data.Location);
    //   return data; // For unit tests.
    // } catch (err) {
    //   console.log('Error', err);
    // }
    // Create an object and upload it to the Amazon S3 bucket.
    try {
      const results = await s3Client.send(new PutObjectCommand(params));
      console.log(
        'Successfully created ' +
          params.Key +
          ' and uploaded it to ' +
          params.Bucket +
          '/' +
          params.Key,
      );
      return results; // For unit tests.
    } catch (err) {
      console.log('Error', err);
    }
  }
}
