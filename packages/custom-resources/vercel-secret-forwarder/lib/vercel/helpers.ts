import { VercelSecretSyncConstructProps } from '..';
import {
  createSecret,
  deleteSecret,
  getEnv,
  updateSecret,
  UploadSecretProps,
} from './api';

export const upsertSecretBranch = async ({
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

export const deleteSecretBranch = async ({
  keyValuePairs,
  authToken,
  gitBranch,
  projectId,
}: Omit<UploadSecretProps, 'key' | 'value' | 'target'> & {
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
