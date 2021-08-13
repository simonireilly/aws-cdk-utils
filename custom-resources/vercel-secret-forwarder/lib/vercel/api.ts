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

export const getEnv = ({
  projectId,
  authToken,
}: Pick<UploadSecretProps, 'projectId' | 'authToken'>) => {
  console.info('Fetching existing project env');
  return axios.get<VercelApi.GetResponse>(
    `${BASE_URL}/v8/projects/${projectId}/env`,
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
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

  return axios.post(
    `${BASE_URL}/v8/projects/${projectId}/env`,
    {
      type: 'encrypted',
      key,
      value,
      target,
      gitBranch,
    },
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
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

  return axios.put(
    `${BASE_URL}/v8/projects/${projectId}/env/${id}`,
    {
      type: 'encrypted',
      key,
      value,
      target,
      gitBranch,
    },
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};
