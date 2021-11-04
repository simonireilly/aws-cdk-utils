import * as sst from '@serverless-stack/resources';
import { VercelSecretSyncConstruct } from '@aws-cdk-utils/vercel-secret-forwarder';
import { OAuthScope } from '@aws-cdk/aws-cognito';

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const vercel = new VercelSecretSyncConstruct(this, 'SendSecretsToVercel', {
      GitBranch: String(process.env.GIT_BRANCH),
      VercelAuthToken: String(process.env.VERCEL_AUTH_TOKEN),
      VercelEnvironmentVariables: {
        NEXT_PUBLIC_LOCAL_TEST: 'Preview domain',
        PRIVATE_TEST: 'This is a test one',
      },
      VercelProjectId: String(process.env.VERCEL_PROJECT_ID),
      VercelProjectName: String(process.env.VERCEL_PROJECT_NAME),
      VercelProjectOrganisation: String(process.env.VERCEL_ORGANISATION_NAME),
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

    // Hook in to add a secret, to a dependency that is only known at deploy time
    vercel.addSecret(
      'NEXT_PUBLIC_COGNITO_USER_POOL_ID',
      auth.cognitoUserPool?.userPoolId as string
    );
  }
}
