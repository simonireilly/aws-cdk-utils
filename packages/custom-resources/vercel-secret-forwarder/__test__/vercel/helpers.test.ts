import { deleteSecretBranch } from '../../lib/vercel/helpers';
import nock from 'nock';

describe('vercel secrets helpers', () => {
  describe('deleting all secrets for a branch', () => {
    beforeEach(() => {
      nock.disableNetConnect();
    });

    afterEach(() => {
      nock.enableNetConnect();
    });

    it('constructs a promise for each secret to be deleted', async () => {
      const promise = deleteSecretBranch({
        keyValuePairs: {
          SECRET_NAME: 'secret-value',
        },
        authToken: 'fake-auth-token',
        gitBranch: 'feat/integration-tests',
        projectId: 'ab6ef546ebc4fa',
      });

      const response = await promise;
    });
  });
});
