# Vercel Secret Forwarder

A Cloudformation custom resource that can be used to forward the output from stacks to vercel.

## Support

- aws-cdk >= 1.111.0
- Typescript/Javascript
- github command line (optional)

## Features

- [x] Returns the preview url statically to use in other dependant resources
- [x] Returns a function to bind in secrets to set in the custom resource

## Example

### Configure Secrets in GitHub Actions

[source](https://cli.github.com/manual/gh_secret_set)

Create a .env file with the secrets needed:

```env
AWS_ACCESS_KEY_ID=AK*******
AWS_SECRET_ACCESS_KEY=456j3*******
VERCEL_AUTH_TOKEN=pk_3*********
VERCEL_ORGANISATION_NAME=<team-name>
VERCEL_PROJECT_ID=pkf_
VERCEL_PROJECT_NAME=

```

To set this up with github do the following:

```
gh secret set MYSECRET
```


```ts

```
