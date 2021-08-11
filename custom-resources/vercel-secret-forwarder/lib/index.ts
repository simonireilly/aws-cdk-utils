import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import {
  Construct,
  CustomResource,
  CustomResourceProps,
  RemovalPolicy,
} from '@aws-cdk/core';
import * as path from 'path';

export interface VercelSecretSyncConstructProps {
  VercelEnvironmentVariables: {
    [key: string]: string;
  };
  GitBranch: string;
  VercelProjectId: string;
  VercelProjectName: string;
  VercelProjectOrganisation: string;
  VercelAuthToken: string;
}

interface MutableCustomResourceProperties
  extends Omit<CustomResourceProps, 'properties'> {
  properties: VercelSecretSyncConstructProps;
}

export class VercelSecretSyncConstruct extends Construct {
  private readonly orgName: string;
  private readonly projectName: string;
  private readonly gitBranch: string;
  private customResourceTemplate: MutableCustomResourceProperties;
  private customResource: CustomResource | null;
  private customResourceFunction: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    props: VercelSecretSyncConstructProps
  ) {
    super(scope, id);
    this.buildFunction();

    this.customResourceTemplate = {
      resourceType: 'Custom::VercelEnvironmentSync',
      serviceToken: this.customResourceFunction.functionArn,
      properties: {
        ...props,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    };
    this.orgName = props.VercelProjectOrganisation;
    this.gitBranch = props.GitBranch;
    this.projectName = props.VercelProjectName;

    this.buildCustomResource();
  }

  public get previewUrl(): string {
    return `https://${this.projectName}-git-${this.gitBranch.replace(
      /\//g,
      '-'
    )}-${this.orgName}.vercel.app`;
  }

  /**
   * Upsert a secret provided at initialization; this is useful when the secrets
   * are not know on initialization.
   *
   * An example is getting the preview url, to use in cognito, then returning
   * the required callback urls to the vercel secret sync custom resource
   *
   */
  public addSecret(key: string, value: string) {
    this.customResourceTemplate.properties.VercelEnvironmentVariables[
      key
    ] = value;

    // Rebuild the custom resource with the newly added secrets
    this.buildCustomResource();
  }

  private buildFunction() {
    this.customResourceFunction = new NodejsFunction(
      this,
      'VercelSecretCustomResourceFunction',
      {
        entry: path.join(__dirname, './vercel/index.ts'),
      }
    );
  }

  private buildCustomResource() {
    // Remove the old construct if possible
    this.node.tryRemoveChild('VercelSecretCustomResource');

    // Build the new construct with the same name, and new props
    this.customResource = new CustomResource(
      this,
      'VercelSecretCustomResource',
      this.customResourceTemplate
    );
  }
}
