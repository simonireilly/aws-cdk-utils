# AWS-CDK Utils - Factories

Factories uses [fishery](https://github.com/thoughtbot/fishery) to create stock factories for AWS events, helping to accelerate your testing.

- [AWS-CDK Utils - Factories](#aws-cdk-utils---factories)
  - [Usage](#usage)
    - [With Jest](#with-jest)

## Usage

### With Jest

```ts
import { awsFactory } from '@cdk-utils/factories';
import { handler } from 'src/lambda.ts';

test("lambda", () => {
  const event = awsFactory.apiGatewayProxyEventV2({
    body: JSON.stringify({ message: 'test'})
  })

  const result = await handler(event)

  expect(result).toEqual({
    statusCode: 200,
    body: JSON.stringify({
      message: 'paased'
    })
  })
})
```
