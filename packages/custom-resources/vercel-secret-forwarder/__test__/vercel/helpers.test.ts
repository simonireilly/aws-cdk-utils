import { deleteSecretBranch } from '../../lib/vercel/helpers';
import { VercelApi } from '../../lib/vercel/api';
import * as nock from 'nock';

const vercelGetNock = () => {
  const envsResponse: VercelApi.GetResponse = {
    envs: [
      {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        gitBranch: 'feat/integration-tests',
        id: '11-22',
        key: 'EXISTING_SECRET',
        target: ['preview'],
        type: 'plain',
        value: 'existing-value',
      },
    ],
  };

  nock('https://api.vercel.com:443')
    .get('/v8/projects/ab6ef546ebc4fa/env')
    .reply(200, envsResponse);
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
