#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CloudBankruptcyStack } from '../lib/cloud-bankruptcy-stack';

const app = new cdk.App();
new CloudBankruptcyStack(app, 'CloudBankruptcyStack');
