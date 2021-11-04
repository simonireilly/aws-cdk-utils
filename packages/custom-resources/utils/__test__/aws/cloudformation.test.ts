import { sendFailureMessage } from '../../src';
import nock from 'nock';

describe('aws', () => {
  describe('cloudformation', () => {
    beforeEach(() => {
      nock.disableNetConnect();
    });

    test('sendFailureMessage', () => {
      sendFailureMessage();
    });
  });
});
