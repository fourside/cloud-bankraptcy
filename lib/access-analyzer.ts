import { Construct } from "@aws-cdk/core";
import { CfnAnalyzer } from "@aws-cdk/aws-accessanalyzer";
import { Topic } from "@aws-cdk/aws-sns";
import { Rule, RuleTargetInput, EventField } from "@aws-cdk/aws-events";
import { SnsTopic } from "@aws-cdk/aws-events-targets";

export function createAccessAnalyzer(scope: Construct, name: string, topic: Topic, chatTopic: Topic): void {
  new CfnAnalyzer(scope, `${name}-access-analyzer`, {
    type: "ACCOUNT",
  });

  const rule = new Rule(scope, `${name}-access-analyzer-event-rule`, {
    eventPattern: {
      source: ["aws.access-analyzer"],
      detailType: ["Access Analyzer Finding"],
      detail: {
        status: ["ACTIVE"],
      },
    },
  });

  const snsTopicTarget = new SnsTopic(topic, {
    message: RuleTargetInput.fromObject({
      type: EventField.fromPath("$.detail.resourceType"),
      resource: EventField.fromPath("$.detail.resource"),
      action: EventField.fromPath("$.detail.action"),
    }),
  });
  rule.addTarget(snsTopicTarget);

  const chatTopicTarget = new SnsTopic(chatTopic);
  rule.addTarget(chatTopicTarget);
}
