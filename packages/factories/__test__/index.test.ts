import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { awsFactory } from '../src';

describe('Acceptance test', () => {
  describe('awsFactory', () => {
    test('creates a cloudformation custom resource event', () => {
      const event = awsFactory.cloudformation.customResourceEvent.build({});

      expect(event).toEqual(
        expect.objectContaining<CloudFormationCustomResourceEvent>({
          LogicalResourceId: expect.any(String),
          OldResourceProperties: expect.any(Object),
          PhysicalResourceId: expect.any(String),
          RequestId: expect.any(String),
          RequestType: expect.any(String),
          ResourceProperties: expect.objectContaining({
            ServiceToken: 'arn:aws::::',
          }),
          ResourceType: expect.any(String),
          ResponseURL: expect.any(String),
          ServiceToken: 'arn:aws::::',
          StackId: expect.any(String),
        })
      );
    });
  });
});
