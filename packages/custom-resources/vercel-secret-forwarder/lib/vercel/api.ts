import axios from 'axios';

type VercelTargets = 'preview' | 'development' | 'production';

const BASE_URL = 'https://api.vercel.com';

namespace VercelApi {
  export interface GetResponse {
    envs: Env[];
  }

  export interface Env {
    type: string;
    id: string;
    key: string;
    value: string;
    target: string[];
    gitBranch: string | null;
    configurationId?: string | null;
    updatedAt: number;
    createdAt: number;
  }
}

export interface UploadSecretProps {
  projectId: string;
  key: string;
  value: string;
  gitBranch: string;
  target: VercelTargets[];
  authToken: string;
}

const vercelApiClientBuilder = (authToken: string) => {
  console.info('Building vercel API client');

  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });

  client.interceptors.request.use((config) => {
    console.debug('Sending request to Vercel', { url: config.url });
    return config;
  });

  client.interceptors.response.use((config) => {
    console.debug('Received response from Vercel', {
      data: config.data,
      status: config.status,
    });
    return config;
  });

  return client;
};

export const getEnv = ({
  projectId,
  authToken,
}: Pick<UploadSecretProps, 'projectId' | 'authToken'>) => {
  const client = vercelApiClientBuilder(authToken);
  console.info('Fetching existing project env');
  return client.get<VercelApi.GetResponse>(`/v8/projects/${projectId}/env`);
};

export const createSecret = async ({
  projectId,
  key,
  value,
  gitBranch,
  target = ['preview'],
  authToken,
}: UploadSecretProps) => {
  console.info(`Creating secret ${key} to branch ${gitBranch}`);
  const client = vercelApiClientBuilder(authToken);

  return client.post(`${BASE_URL}/v8/projects/${projectId}/env`, {
    type: 'encrypted',
    key,
    value,
    target,
    gitBranch,
  });
};

export const updateSecret = async ({
  projectId,
  key,
  value,
  gitBranch,
  target = ['preview'],
  authToken,
  id,
}: UploadSecretProps & Pick<VercelApi.Env, 'id'>) => {
  console.info(`Updating secret ${key} to branch ${gitBranch}`);
  const client = vercelApiClientBuilder(authToken);

  return client.patch(`${BASE_URL}/v8/projects/${projectId}/env/${id}`, {
    type: 'encrypted',
    key,
    value,
    target,
    gitBranch,
  });
};

export const deleteSecret = async ({
  projectId,
  id,
  authToken,
}: Pick<UploadSecretProps, 'authToken' | 'projectId'> &
  Pick<VercelApi.Env, 'id'>) => {
  console.info(`Deleting env variable`, { id });
  const client = vercelApiClientBuilder(authToken);

  return client.delete(`${BASE_URL}/v8/projects/${projectId}/env/${id}`);
};
