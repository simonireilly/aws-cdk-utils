/**
 * Factory to create an ARN for a given service
 *
 * arn:partition:service:region:account-id:resource-type/resource-id
 */
export const arnFactory = ({
  partition = 'aws',
  service = '',
  region = '',
  accountId = '',
  resourceType = '',
  resourceId = '',
}: {
  partition?: string;
  service?: string;
  region?: string;
  accountId?: string;
  resourceType?: string;
  resourceId?: string;
} = {}): string => {
  const baseArn = `arn:${partition}:${service}:${region}:${accountId}:${resourceType}`;

  if (resourceId) {
    return `${baseArn}/${resourceId}`;
  }

  return baseArn;
};
