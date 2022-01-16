import { deleteSecretBranch } from '../../lib/vercel/helpers';
import * as nock from 'nock';

const vercelGetNock = () => {
  nock('https://api.vercel.com:443')
    .get('/v8/projects/ab6ef546ebc4fa/env')
    .reply(200, {
      envs: [{}],
    });
};

const vercelPatchNock = () => {
  nock('https://api.vercel.com:443').patch('/v8/projects/ab6ef546ebc4fa/env');
};

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

      vercelGetNock();
      vercelPatchNock();

      const response = await promise;
    });
  });
});
