import { CloudFormationCustomResourceHandler } from 'aws-lambda';
import { getEnv, updateSecret, createSecret, UploadSecretProps } from './api';
import type { VercelSecretSyncConstructProps } from '..';
import { sendFailureMessage, sendSuccessMessage } from './cloudformation';
import { AxiosError } from 'axios';

export const handler: CloudFormationCustomResourceHandler = async (
  event,
  context
) => {
  let res;

  try {
    console.info('Unpacking event resources');

    const expectedResources = (event.ResourceProperties as unknown) as VercelSecretSyncConstructProps;

    const {
      GitBranch,
      VercelAuthToken,
      VercelEnvironmentVariables,
      VercelProjectId,
    } = expectedResources;

    console.info('Preparing to send secrets', {
      GitBranch,
    });

    let promises: Array<Promise<any>> = [];

    switch (event.RequestType) {
      case 'Create':
        promises = await upsertSecretBranch({
          keyValuePairs: VercelEnvironmentVariables,
          authToken: VercelAuthToken,
          gitBranch: GitBranch,
          projectId: VercelProjectId,
          target: ['preview'],
        });
        break;
      case 'Update':
        promises = await upsertSecretBranch({
          keyValuePairs: VercelEnvironmentVariables,
          authToken: VercelAuthToken,
          gitBranch: GitBranch,
          projectId: VercelProjectId,
          target: ['preview'],
        });
        break;
      case 'Delete':
        break;
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }

    res = await sendSuccessMessage(event);
  } catch (e) {
    if (e.response) {
      const error = e as AxiosError;
      console.error('Axios API error', { response: error.response?.data });
    }
    res = await sendFailureMessage(event);
  }

  console.info('Completed sending secret with config');
};

const upsertSecretBranch = async ({
  keyValuePairs,
  authToken,
  gitBranch,
  projectId,
  target,
}: Omit<UploadSecretProps, 'key' | 'value'> & {
  keyValuePairs: VercelSecretSyncConstructProps['VercelEnvironmentVariables'];
}): Promise<
  Array<ReturnType<typeof createSecret> | ReturnType<typeof updateSecret>>
> => {
  console.info('Fetching all secrets, not decrypting');
  const env = await getEnv({ projectId, authToken });

  // If an env exists, do a put to updated it
  const updateRequests = env.data.envs.map(({ key, id }) => {
    if (keyValuePairs[key]) {
      const value = keyValuePairs[key];
      delete keyValuePairs[key];
      return updateSecret({
        authToken,
        gitBranch,
        key,
        value,
        projectId,
        target,
        id,
      });
    }

    return;
  });

  // If the secret did not exist, then send a a POST request
  const createRequests = Object.entries(keyValuePairs).map<Promise<any>>(
    ([key, value]) => {
      return createSecret({
        authToken,
        gitBranch,
        key,
        value,
        projectId,
        target,
      });
    }
  );

  return [...updateRequests, ...createRequests];
};
