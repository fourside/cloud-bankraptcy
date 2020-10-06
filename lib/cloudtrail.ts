import { Construct } from "@aws-cdk/core";
import { PolicyStatement, Effect, ServicePrincipal } from "@aws-cdk/aws-iam";
import { Trail } from "@aws-cdk/aws-cloudtrail";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { Bucket } from "@aws-cdk/aws-s3";

export function createCloudTrail(scope: Construct, name: string, s3Bucket: Bucket): Trail {
  s3Bucket.addToResourcePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetBucketAcl"],
      resources: [`${s3Bucket.bucketArn}`],
      principals: [new ServicePrincipal("cloudtrail.amazonaws.com")],
    })
  );

  s3Bucket.addToResourcePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:PutObject"],
      resources: [`${s3Bucket.bucketArn}/*`],
      principals: [new ServicePrincipal("cloudtrail.amazonaws.com")],
      conditions: {
        StringEquals: {
          "s3:x-amz-acl": ["bucket--owner-full-control"],
        },
      },
    })
  );

  return new Trail(scope, name, {
    trailName: name,
    isMultiRegionTrail: true,
    includeGlobalServiceEvents: true,
    enableFileValidation: true,
    sendToCloudWatchLogs: true,
    cloudWatchLogsRetention: RetentionDays.TWO_WEEKS,
    bucket: s3Bucket,
  });
}
