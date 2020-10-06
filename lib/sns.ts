import { Construct } from "@aws-cdk/core";
import { Topic, Subscription, SubscriptionProtocol } from "@aws-cdk/aws-sns";

export function createSnsTopic(scope: Construct, name: string): Topic {
  return new Topic(scope, name, {
    topicName: name,
    displayName: name,
  });
}

export function createSubscription(scope: Construct, name: string, topic: Topic, email: string): void {
  new Subscription(scope, name, {
    protocol: SubscriptionProtocol.EMAIL,
    topic: topic,
    endpoint: email,
  });
}
