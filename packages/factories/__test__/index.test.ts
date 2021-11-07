import { awsFactory } from '../src';

describe('Smoke test', () => {
  describe('awsFactory', () => {
    test('creates a cloudformation custom resource event', () => {
      awsFactory.cloudformation.customResourceEvent.build({});
    });

    test('creates an apigateway proxy event', () => {
      awsFactory.apigateway.apigatewayProxyEventV2.build();
    });
  });
});
