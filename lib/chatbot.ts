import { Construct } from "@aws-cdk/core";
import { SlackChannelConfiguration, LoggingLevel } from "@aws-cdk/aws-chatbot";
import { Topic } from "@aws-cdk/aws-sns";
import { PolicyStatement, Effect, ServicePrincipal, Role, PolicyDocument } from "@aws-cdk/aws-iam";
import { RetentionDays } from "@aws-cdk/aws-logs";

export function createChatbot(
  scope: Construct,
  name: string,
  workspaceId: string,
  channelId: string,
  topic: Topic
): void {
  const role = new Role(scope, `${name}-chatbot-role`, {
    assumedBy: new ServicePrincipal("chatbot.amazonaws.com"),
    inlinePolicies: {
      cloudwatchAccess: new PolicyDocument({
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            resources: ["*"],
            actions: ["cloudwatch:Describe*", "cloudwatch:Get*", "cloudwatch:List*"],
          }),
        ],
      }),
    },
  });

  new SlackChannelConfiguration(scope, `${name}-chatbot`, {
    slackChannelConfigurationName: name,
    slackWorkspaceId: workspaceId,
    slackChannelId: channelId,
    notificationTopics: [topic],
    logRetention: RetentionDays.ONE_MONTH,
    loggingLevel: LoggingLevel.ERROR,
    role: role,
  });
}
