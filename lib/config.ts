import { Construct, Stack } from "@aws-cdk/core";
import { Bucket } from "@aws-cdk/aws-s3";
import { CfnServiceLinkedRole, PolicyStatement, Effect, ServicePrincipal } from "@aws-cdk/aws-iam";
import { CfnConfigurationRecorder, CfnDeliveryChannel } from "@aws-cdk/aws-config";

export function createConfig(scope: Construct, name: string, bucket: Bucket): void {
  new CfnServiceLinkedRole(scope, "ServiceLinkedRole", {
    awsServiceName: "config.amazonaws.com",
  });

  new CfnConfigurationRecorder(scope, `${name}-recorder`, {
    name: `${name}-recorder`,
    roleArn: `arn:aws:iam::${
      Stack.of(scope).account
    }:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig`,
    recordingGroup: {
      allSupported: true,
      includeGlobalResourceTypes: true,
    },
  });

  bucket.addToResourcePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal("config.amazonaws.com")],
      resources: [bucket.bucketArn],
      actions: ["s3:ListBucket", "s3:GetBucketAcl"],
    })
  );

  bucket.addToResourcePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal("config.amazonaws.com")],
      resources: [bucket.arnForObjects(`AWSLogs/${Stack.of(scope).account}/Config/*`)],
      actions: ["s3:PutObject"],
      conditions: {
        StringEquals: {
          "s3:x-amz-acl": "bucket-owner-full-control",
        },
      },
    })
  );

  new CfnDeliveryChannel(scope, `${name}-delivery-channel`, {
    s3BucketName: bucket.bucketName,
    name: `${name}-delivery-channel`,
  });
}
