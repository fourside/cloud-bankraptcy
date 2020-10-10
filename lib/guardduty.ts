import { Construct } from "@aws-cdk/core";
import { CfnDetector } from "@aws-cdk/aws-guardduty";
import { Topic } from "@aws-cdk/aws-sns";
import { Rule, RuleTargetInput, EventField } from "@aws-cdk/aws-events";
import { SnsTopic } from "@aws-cdk/aws-events-targets";

export function createGuardDuty(scope: Construct, name: string, topic: Topic, chatTopic: Topic): void {
  new CfnDetector(scope, `${name}-guardduty-detector`, {
    enable: true,
    findingPublishingFrequency: "SIX_HOURS",
  });

  const guardDutyRule = new Rule(scope, `${name}-guardduty-event-rule`, {
    eventPattern: {
      source: ["aws.guardduty"],
      detailType: ["GuardDuty Finding"],
    },
  });

  const snsTopicTarget = new SnsTopic(topic, {
    message: RuleTargetInput.fromObject({
      type: EventField.fromPath("$.detail.type"),
      description: EventField.fromPath("$.detail.description"),
      severity: EventField.fromPath("$.detail.severity"),
    }),
  });
  guardDutyRule.addTarget(snsTopicTarget);

  const chatTopicTarget = new SnsTopic(chatTopic);
  guardDutyRule.addTarget(chatTopicTarget);
}
