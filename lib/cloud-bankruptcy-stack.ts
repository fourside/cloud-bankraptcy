import { Stack, Construct, StackProps } from "@aws-cdk/core";
import { PolicyStatement, Effect } from "@aws-cdk/aws-iam";
import { createS3Bucket } from "./s3";
import { createCloudTrail } from "./cloudtrail";
import { createConfig } from "./config";
import { createSnsTopic, createSubscription } from "./sns";
import { createGuardDuty } from "./guardduty";
import { createAccessAnalyzer } from "./access-analyzer";
import { createSecurityHub } from "./security-hub";
import { createChatbot } from "./chatbot";
import { createLambda } from "./lambda";
import { setLambdaRule } from "./setLambdaRule";
import * as path from "path";

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

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      throw new Error("set slack webhook url to env `SLACK_WEBHOOK_URL`");
    }

    const cloudtrailLogBucket = createS3Bucket(this, "fourside-cloudtrail-log");
    createCloudTrail(this, "cloud-bankruptcy", cloudtrailLogBucket);

    const awsConfigBucket = createS3Bucket(this, "fourside-config-log");
    createConfig(this, "cloud-bankruptcy", awsConfigBucket);

    const snsTopic = createSnsTopic(this, "cloud-bankruptcy-topic");
    createSubscription(this, "cloud-bankruptcy-subscription", snsTopic, "fourside@gmail.com");

    const snsTopicForChatbot = createSnsTopic(this, "cloud-bankruptcy-topic-chatbot");
    createGuardDuty(this, "cloud-bankruptcy-guardduty", snsTopic, snsTopicForChatbot);
    createAccessAnalyzer(this, "cloud-bankruptcy", snsTopic, snsTopicForChatbot);
    createSecurityHub(this, "cloud-bankruptcy");
    createChatbot(this, "cloud-bankruptcy", slackWorkspaceId, slackChannelId, snsTopicForChatbot);

    createBudgetNotificationLambda(this, slackWebhookUrl);
  }
}

function createBudgetNotificationLambda(scope: Construct, slackWebhookUrl: string) {
  const lambdaCodePath = path.join(__dirname, "../lambda/budget/handler.ts");
  const lambdaEnv = {
    SLACK_WEBHOOK_URL: slackWebhookUrl,
  };
  const budgetNotificationLambda = createLambda(scope, "cloud-bankruptcy", lambdaCodePath, lambdaEnv);

  const viewBudgetsPolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["budgets:ViewBudget"],
    resources: ["*"],
  });
  budgetNotificationLambda.addToRolePolicy(viewBudgetsPolicy);

  const cronOptions = {
    minute: "0",
    hour: "22",
  };
  setLambdaRule(scope, "cloud-bankruptcy", budgetNotificationLambda, cronOptions);
}
