# AWS CDK Utils

- [AWS CDK Utils](#aws-cdk-utils)
  - [Index](#index)
  - [Examples](#examples)
  - [Build Style](#build-style)

## Index

- Vercel secret forwarder
  - Send a collection of parameters form the stack, to a vercel deployment, supports  preview deploys


## Examples

Demonstrations of how to use the custom-resource sor utils.

## Build Style

Use yarn workspaces with folders:

```bash
.
├── custom-resources    # For custom resources
├── examples            # For demonstration against sst or aws-cdk
├── package.json
├── README.md
└── yarn.lock
```

The packages in custom-resources are `tsconfig.json` as composite: true, and will rebuild with latest.
