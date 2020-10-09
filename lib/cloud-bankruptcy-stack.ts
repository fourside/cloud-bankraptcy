import { Stack, Construct, StackProps } from "@aws-cdk/core";
import { createS3Bucket } from "./s3";
import { createCloudTrail } from "./cloudtrail";
import { createConfig } from "./config";
import { createSnsTopic, createSubscription } from "./sns";
import { createGuardDuty } from "./guardduty";
import { createAccessAnalyzer } from "./access-analyzer";
import { createSecurityHub } from "./security-hub";
import { createChatbot } from "./chatbot";

export class CloudBankruptcyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myIpAddress = process.env.MY_IP;
    if (!myIpAddress) {
      throw new Error("set your ip address to env `MY_IP`");
    }
    const slackWorkspaceId = process.env.SLACK_WORKSPACE_ID;
    if (!slackWorkspaceId) {
      throw new Error("set slack workspace id to env `SLACK_WORKSPACE_ID`");
    }
    const slackChannelId = process.env.SLACK_CHANNEL_ID;
    if (!slackChannelId) {
      throw new Error("set slack channel id to env `SLACK_CHANNEL_ID`");
    }

    const cloudtrailLogBucket = createS3Bucket(this, "fourside-cloudtrail-log");
    createCloudTrail(this, "cloud-bankruptcy", cloudtrailLogBucket);

    const awsConfigBucket = createS3Bucket(this, "fourside-config-log");
    createConfig(this, "cloud-bankruptcy", awsConfigBucket);

    const snsTopic = createSnsTopic(this, "cloud-bankruptcy-topic");
    createSubscription(this, "cloud-bankruptcy-subscription", snsTopic, "fourside@gmail.com");

    createGuardDuty(this, "cloud-bankruptcy-guardduty", snsTopic);
    createAccessAnalyzer(this, "cloud-bankruptcy", snsTopic);
    createSecurityHub(this, "cloud-bankruptcy");
    createChatbot(this, "cloud-bankruptcy", slackWorkspaceId, slackChannelId, snsTopic);
  }
}
