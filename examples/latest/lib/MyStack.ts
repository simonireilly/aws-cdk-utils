import * as sst from '@serverless-stack/resources';
import { VercelSecretSyncConstruct } from '@custom-resources/vercel-secret-forwarder';
import { OAuthScope } from '@aws-cdk/aws-cognito';

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const vercel = new VercelSecretSyncConstruct(this, 'SendSecretsToVercel', {
      GitBranch: 'test',
      VercelAuthToken: 'example',
      VercelEnvironmentVariables: {
        NEXT_PUBLIC_TEST_LOCAL: 'Preview domain',
      },
      VercelProjectId: 'is',
      VercelProjectName: 'my',
      VercelProjectOrganisation: 'project',
    });

    const auth = new sst.Auth(this, 'AuthBase', {
      cognito: {
        userPool: {
          signInAliases: {
            email: true,
            username: true,
          },
        },
        userPoolClient: {
          oAuth: {
            scopes: [OAuthScope.PHONE, OAuthScope.EMAIL, OAuthScope.OPENID],
            callbackUrls: [`${vercel.previewUrl}`],
            logoutUrls: [vercel.previewUrl],
          },
        },
      },
    });

    vercel.addSecret(
      'NEXT_PUBLIC_PREVIEW_URL',
      auth.cognitoUserPoolClient?.userPoolClientId as string
    );
  }
}
