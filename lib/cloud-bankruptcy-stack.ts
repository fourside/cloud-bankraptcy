import { Stack, Construct, StackProps, Duration } from "@aws-cdk/core";
import { Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { PolicyStatement, Effect, ArnPrincipal } from "@aws-cdk/aws-iam";

export class CloudBankruptcyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myIpAddress = process.env.MY_IP;
    if (!myIpAddress) {
      throw new Error("set your ip address to env `MY_IP`");
    }

    const bucket = new Bucket(this, "foursideCloudBankruptcy", {
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

    const bucketPolicy = new PolicyStatement({
      effect: Effect.DENY,
      actions: ["s3:*"],
      resources: [`${bucket.bucketArn}/*`],
      principals: [new ArnPrincipal("*")],
      conditions: {
        NotIpAddress: {
          "aws:SourceIp": [ `${myIpAddress}/32` ],
        },
      },
    });
    bucket.addToResourcePolicy(bucketPolicy);
  }
}
