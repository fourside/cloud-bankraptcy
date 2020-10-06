import { Stack, Construct, StackProps } from "@aws-cdk/core";
import { createS3Bucket } from "./s3";
import { createCloudTrail } from "./cloudtrail";
import { createConfig } from "./config";

export class CloudBankruptcyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myIpAddress = process.env.MY_IP;
    if (!myIpAddress) {
      throw new Error("set your ip address to env `MY_IP`");
    }

    const cloudtrailLogBucket = createS3Bucket(this, "fourside-cloudtrail-log");
    createCloudTrail(this, "cloud-bankruptcy", cloudtrailLogBucket);

    const awsConfigBucket = createS3Bucket(this, "fourside-config-log");
    createConfig(this, "cloud-bankruptcy", awsConfigBucket);
  }
}
