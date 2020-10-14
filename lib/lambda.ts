import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Runtime } from "@aws-cdk/aws-lambda";
import { RetentionDays } from "@aws-cdk/aws-logs";

type Env = {
  [name: string]: string;
};

export function createLambda(scope: Construct, name: string, codePath: string, env: Env): NodejsFunction {
  const lambda = new NodejsFunction(scope, `${name}-lambda`, {
    entry: codePath,
    handler: "handler",
    environment: { ...env },
    runtime: Runtime.NODEJS_12_X,
    logRetention: RetentionDays.SIX_MONTHS,
    sourceMaps: true,
  });
  return lambda;
}
