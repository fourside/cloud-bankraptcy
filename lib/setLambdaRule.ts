import { Construct } from "@aws-cdk/core";
import { Rule, Schedule, CronOptions } from "@aws-cdk/aws-events";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";

export function setLambdaRule(scope: Construct, name: string, lambda: NodejsFunction, cronOptions: CronOptions): void {
  new Rule(scope, `${name}-lambda-rule`, {
    schedule: Schedule.cron(cronOptions),
    targets: [new LambdaFunction(lambda)],
  });
}
