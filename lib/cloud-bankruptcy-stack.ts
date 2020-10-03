import { Stack, Construct, StackProps, Duration } from "@aws-cdk/core";
import { Bucket, BucketEncryption } from "@aws-cdk/aws-s3";

export class CloudBankruptcyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Bucket(this, "foursideCloudBankruptcy", {
      bucketName: "fourside-cloud-bankruptcy",
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
}
