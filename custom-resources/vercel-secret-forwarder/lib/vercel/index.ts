import { CloudFormationCustomResourceHandler } from 'aws-lambda';
import { uploadSecret, UploadSecretProps } from './api';
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
        promises = uploadSecretBatch({
          keyValuePairs: VercelEnvironmentVariables,
          authToken: VercelAuthToken,
          gitBranch: GitBranch,
          projectId: VercelProjectId,
          target: ['preview'],
        });
        break;
      case 'Update':
        promises = uploadSecretBatch({
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

const uploadSecretBatch = ({
  keyValuePairs,
  authToken,
  gitBranch,
  projectId,
  target,
}: Omit<UploadSecretProps, 'key' | 'value'> & {
  keyValuePairs: VercelSecretSyncConstructProps['VercelEnvironmentVariables'];
}): Array<ReturnType<typeof uploadSecret>> => {
  console.info('Sending all secrets');
  return Object.entries(keyValuePairs).map<Promise<any>>(([key, value]) => {
    return uploadSecret({
      authToken,
      gitBranch,
      key,
      value,
      projectId,
      target,
    });
  });
};
