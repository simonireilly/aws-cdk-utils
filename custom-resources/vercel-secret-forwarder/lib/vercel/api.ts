import axios from 'axios';

type VercelTargets = 'preview' | 'development' | 'production';

export interface UploadSecretProps {
  projectId: string;
  key: string;
  value: string;
  gitBranch: string;
  target: VercelTargets[];
  authToken: string;
}

export const uploadSecret = async ({
  projectId,
  key,
  value,
  gitBranch,
  target = ['preview'],
  authToken,
}: UploadSecretProps) => {
  console.info(`Sending secret ${key} to branch ${gitBranch}`);

  return axios.post(
    `https://api.vercel.com/v8/projects/${projectId}/env`,
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
