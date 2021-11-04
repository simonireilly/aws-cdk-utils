import { sendFailureMessage } from '../../src';
import nock from 'nock';
import { awsFactory } from '@aws-cdk-utils/factories';

describe('aws', () => {
  describe('cloudformation', () => {
    beforeEach(() => {
      nock.disableNetConnect();
    });

    test('sendFailureMessage', async () => {
      const event = awsFactory.cloudformation.customResourceEvent.build();

      sendFailureMessage(event);
    });
  });
});
