import {
  expect as expectCDK,
  countResources,
  haveResourceLike,
} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { VercelSecretSyncConstruct } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TestStack');

// WHEN
const vercel = new VercelSecretSyncConstruct(stack, 'MyTestConstruct', {
  GitBranch: 'test',
  VercelAuthToken: 'test-token',
  VercelEnvironmentVariables: {
    AUTH_URL: 'https://authenticator.com',
  },
  VercelProjectId: '213213',
  VercelProjectName: 'test-app',
  VercelProjectOrganisation: 'simonireilly',
});

describe('VercelSecretResource', () => {
  test('it returns the expected preview url', () => {
    // THEN
    expect(vercel.previewUrl).toEqual(
      'https://test-app-git-test-simonireilly.vercel.app'
    );
    expectCDK(stack).to(countResources('Custom::VercelEnvironmentSync', 1));
  });

  test('enables injecting dependant values to the properties with rebuilt construct', () => {
    vercel.addSecret('EXAMPLE_SECRET', 'secret-known-after-create');
    expectCDK(stack).to(countResources('Custom::VercelEnvironmentSync', 1));
    expectCDK(stack).to(
      haveResourceLike(
        'Custom::VercelEnvironmentSync',
        {
          Properties: {
            VercelEnvironmentVariables: {
              AUTH_URL: 'https://authenticator.com',
              EXAMPLE_SECRET: 'secret-known-after-create',
            },
          },
        },
        1
      )
    );
  });
});
