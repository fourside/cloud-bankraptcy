import { Construct } from "@aws-cdk/core";
import { CfnHub } from "@aws-cdk/aws-securityhub";

export function createSecurityHub(scope: Construct, name: string): void {
  new CfnHub(scope, `${name}-security-hub`);
}
