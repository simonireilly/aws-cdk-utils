import type { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { Factory } from 'fishery';
import faker from 'faker';
import { arnFactory } from '../base';

export const customResourceEvent =
  Factory.define<CloudFormationCustomResourceEvent>(() => {
    const serviceToken = arnFactory();
    return {
      LogicalResourceId: faker.random.alphaNumeric(12),
      PhysicalResourceId: faker.random.alphaNumeric(12),
      OldResourceProperties: {},
      RequestId: faker.datatype.uuid(),
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: serviceToken,
      },
      ResourceType: faker.random.alphaNumeric(12),
      ResponseURL: faker.internet.url(),
      ServiceToken: serviceToken,
      StackId: faker.random.words(2),
    };
  });
