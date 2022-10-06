#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BirthdaysApiStack } from '../lib/birthdays-api-stack';

const app = new cdk.App();
// eslint-disable-next-line no-new
new BirthdaysApiStack(app, 'private');
