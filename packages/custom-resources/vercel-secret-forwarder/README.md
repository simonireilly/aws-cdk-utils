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
gh secret set AWS_ACCESS_KEY_ID=AK*******
gh secret set AWS_SECRET_ACCESS_KEY=456j3*******
gh secret set VERCEL_AUTH_TOKEN=pk_3*********
gh secret set VERCEL_ORGANISATION_NAME=<team-name>
gh secret set VERCEL_PROJECT_ID=pkf_
gh secret set VERCEL_PROJECT_NAME=
```

To set this up with github do the following:

```
gh secret set MYSECRET
```


```ts

```
