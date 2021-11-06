import { CloudFormationCustomResourceHandler } from 'aws-lambda';
import {
  getEnv,
  updateSecret,
  createSecret,
  UploadSecretProps,
  deleteSecret,
} from './api';
import type { VercelSecretSyncConstructProps } from '..';
import { sendFailureMessage, sendSuccessMessage } from '@cdk-utils/utils';
import axios from 'axios';

export const handler: CloudFormationCustomResourceHandler = async (
  event,
  context
) => {
  let res;

  try {
    console.info('Unpacking event resources');

    const expectedResources =
      event.ResourceProperties as unknown as VercelSecretSyncConstructProps;

    const {
      GitBranch,
      VercelAuthToken,
      VercelEnvironmentVariables,
      VercelProjectId,
    } = expectedResources;

    console.info('Preparing to send secrets', {
      GitBranch,
      VercelProjectId,
      VercelEnvironmentVariables,
    });

    const upsertAction = async () =>
      upsertSecretBranch({
        keyValuePairs: VercelEnvironmentVariables,
        authToken: VercelAuthToken,
        gitBranch: GitBranch,
        projectId: VercelProjectId,
        target: ['preview'],
      });

    const deleteAction = async () =>
      deleteSecretBranch({
        keyValuePairs: VercelEnvironmentVariables,
        authToken: VercelAuthToken,
        gitBranch: GitBranch,
        projectId: VercelProjectId,
        target: ['preview'],
      });

    let promises: Array<Promise<any>> = [];

    switch (event.RequestType) {
      case 'Create':
        console.info('Performing create action');
        promises = await upsertAction();
        break;
      case 'Update':
        console.info('Performing update action');
        promises = await upsertAction();
        break;
      case 'Delete':
        console.info('Performing delete action');
        promises = await deleteAction();
        break;
    }

    if (promises.length > 0) {
      console.info('Draining requests to update secrets');
      await Promise.all(promises);
    } else {
      console.info('No secrets require upserting');
    }

    res = await sendSuccessMessage(event);
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      console.error('Axios API error', { response: e.response?.data });
    } else {
      // We won't give stack trace, since it may include a secret value
      console.error('Unhandled error', {
        message: (e as Error).message,
        name: (e as Error).name,
      });
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

  // If a secret exists, and it has a value on this specific branch
  const secretsToUpdate = env.data.envs.filter(
    ({ key, gitBranch: vercelSecretGitBranch }) =>
      keyValuePairs[key] && vercelSecretGitBranch === gitBranch
  );

  // If an env exists, do a PATCH to updated it
  // use reduce, as map requires a return for each, setting undefined
  const updateRequests = secretsToUpdate.reduce<
    Array<ReturnType<typeof updateSecret>>
  >((acc, { key, id }) => {
    if (keyValuePairs[key]) {
      const value = keyValuePairs[key];
      delete keyValuePairs[key];
      acc.push(
        updateSecret({
          authToken,
          gitBranch,
          key,
          value,
          projectId,
          target,
          id,
        })
      );
    }

    return acc;
  }, []);

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

const deleteSecretBranch = async ({
  keyValuePairs,
  authToken,
  gitBranch,
  projectId,
}: Omit<UploadSecretProps, 'key' | 'value'> & {
  keyValuePairs: VercelSecretSyncConstructProps['VercelEnvironmentVariables'];
}): Promise<Array<ReturnType<typeof deleteSecret>>> => {
  console.info('Fetching all secrets, not decrypting');
  const env = await getEnv({ projectId, authToken });

  // If a secret exists, and it has a value on this specific branch
  const secretsToDelete = env.data.envs.filter(
    ({ key, gitBranch: vercelSecretGitBranch }) =>
      keyValuePairs[key] && vercelSecretGitBranch === gitBranch
  );

  const deleteRequests = Object.entries(secretsToDelete).map<Promise<any>>(
    ([key, value]) => {
      return deleteSecret({
        authToken,
        projectId: projectId,
        id: value.id,
      });
    }
  );

  return deleteRequests;
};
