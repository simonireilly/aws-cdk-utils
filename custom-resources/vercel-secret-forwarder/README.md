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

Create a .env file with the secrets needed:

```env
```

To set this up with github do the following:

```
gh secret set MYSECRET
```


```ts

```
