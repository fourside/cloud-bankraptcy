import { Construct, Duration } from "@aws-cdk/core";
import { Bucket, BucketEncryption } from "@aws-cdk/aws-s3";

export function createS3Bucket(scope: Construct, name: string): Bucket {
  return new Bucket(scope, name, {
    bucketName: name,
    versioned: true,
    encryption: BucketEncryption.KMS_MANAGED,
    lifecycleRules: [
      {
        enabled: true,
        expiration: Duration.days(180),
      },
    ],
    blockPublicAccess: {
      blockPublicAcls: true,
      ignorePublicAcls: true,
      blockPublicPolicy: true,
      restrictPublicBuckets: true,
    },
  });
}
