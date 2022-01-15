import { CloudFormationCustomResourceHandler } from 'aws-lambda';
import { deleteSecretBranch, upsertSecretBranch } from './helpers';
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
