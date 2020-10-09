import { Construct } from "@aws-cdk/core";
import { SlackChannelConfiguration } from "@aws-cdk/aws-chatbot";
import { Topic } from "@aws-cdk/aws-sns";

export function createChatbot(
  scope: Construct,
  name: string,
  workspaceId: string,
  channelId: string,
  topic: Topic
): void {
  const channelConfig = new SlackChannelConfiguration(scope, `${name}-chatbot`, {
    slackChannelConfigurationName: name,
    slackWorkspaceId: workspaceId,
    slackChannelId: channelId,
    notificationTopics:[topic],
  });
}
