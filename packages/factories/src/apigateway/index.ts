import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
} from 'aws-lambda';
import faker from 'faker';
import { Factory } from 'fishery';

export const apigatewayProxyEventV2 = Factory.define<APIGatewayProxyEventV2>(
  () => {
    return {
      headers: {},
      isBase64Encoded: false,
      rawPath: '/',
      rawQueryString: '',
      requestContext: {
        accountId: String(
          faker.datatype.number({
            min: 100_000_000_000,
            max: 999_999_999_999,
          })
        ),
        apiId: '',
        domainName: faker.internet.domainName(),
        domainPrefix: faker.internet.domainWord(),
        http: {
          method: faker.internet.httpMethod(),
          path: '/',
          protocol: faker.internet.protocol(),
          sourceIp: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
        },
        requestId: faker.datatype.uuid(),
        routeKey: '/',
        stage: 'default',
        time: Date.now().toLocaleString(),
        timeEpoch: Date.now(),
      },
      routeKey: '/',
      version: '',
    };
  }
);
