## Contributing

**All contributions welcome**

- [Contributing](#contributing)
  - [Pull requests](#pull-requests)
  - [Development](#development)
  - [Publishing](#publishing)

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

### Publishing

At this time all releases should be canary as:

```
yarn lerna publish --canary
```

Once we have a stable build we can look to progress to 0.0.2 as a first release milestone.

Because we use lerna, and yarn workspaces, we need to tell npm, that we want to publish publically by setting:

```
npm config set access public
```
