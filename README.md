# CDK Utils

- [CDK Utils](#cdk-utils)
  - [Constructs](#constructs)
    - [Vercel secret forwarder](#vercel-secret-forwarder)
  - [Utilities](#utilities)
    - [Factories](#factories)
  - [Contributing](#contributing)
    - [Pull requests](#pull-requests)
    - [Development](#development)

## Constructs

### Vercel secret forwarder

Send aws data to a vercel deployment, supports  preview deploys

- Support for git branch specific preview urls.
- Create, Update and Delete lifecycle synchronizes with your aws-cdk workflow.

## Utilities

### Factories

Jump start your serverless testing with type safe factories.

- `aws-lambda` types are used to produce data for your tests.

## Contributing

**All contributions welcome**

### Pull requests

As a general rule please keep changes small.

If introducing a new package provide a readme.

### Development

Running tests:

```
yarn test
```

Building utilities, constructs, and examples:

```
yarn build
```

Creating a new package, bootstrapped with the configuration required for the project:

```
yarn new:package <workspace-name>
```
