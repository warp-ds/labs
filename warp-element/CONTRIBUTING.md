# Contributing to @warp-ds/elements-core

Welcome to the [@warp-ds/labs](@warp-ds/labs) repository!
We're glad you're interested in contributing.

This repository is maintained by the [Warp Core Team](https://github.com/orgs/warp-ds/teams/warp-core-team)
and is home to the [@warp-ds/elements-core](@warp-ds/labs/warp-element) package. This package exposes a WarpElement component which all Web Component elements extend and build upon within the [@warp-ds/elements](https://github.com/orgs/warp-ds/elements) library.

To get an overview of the project, read the [README](README.md).

## Development Setup

To get started with developing [@warp-ds/elements-core](https://github.com/warp-ds/labs/warp-element), follow the instructions below.
This will walk you through setting up your development environment.


### Cloning the repository

Start by cloning the repository to your dev environment by running:

```sh
git clone https://github.com/warp-ds/labs
```

### Dependencies

Install dependencies

```sh
npm install
```

### Development

When your changes are ready for a pull request, it should be opened against the `main` branch.
Add the [Warp Core Team](https://github.com/orgs/warp-ds/teams/warp-core-team) as reviewer. 

## Releases

This section outlines the steps to successfully publish the `@warp-ds/elements-core` package to NPM and our CDN, Eik.

### Prerequisites

- Ensure you have access to the NPM registry.
- Obtain your Eik token (ask [Warp Core Team](https://github.com/orgs/warp-ds/teams/warp-core-team) for help if you don't have one).
- Make sure you are in the `warp-ds/labs/warp-element` directory
- Checkout `main` branch and pull the latest changes

### Steps to Publish

1. **Increment the Version Number**
    ```sh
    npm version <major|minor|patch> 
    ```
    This command increments the major, minor or patch version number in `package.json`.

2. **Commit the Version Change**
    ```sh
    git commit -m "Release X.X.X"
    ```
    Replace `X.X.X` with the new version number.

3. **Publish to NPM and Eik**
    ```sh
    npm publish
    ```
    - You will be prompted to sign in to npmjs.com to complete the publishing process to NPM.
    - After logging in to NPM, you will be prompted to log in to Eik using your Eik token to publish the package to Eik.

4. **Push Tags to Git**
    ```sh
    git push --follow-tags
    ```
    This command pushes the commit and tags to the remote repository.

5. **Update Eik Alias**
    ```sh
    npx @eik/cli pkg-alias @warp-ds/elements-core X.X.X 0
    ```
    Replace `X.X.X` with the new version number. This command updates the `v0` alias to point to the new version.
    This means all apps relying on [custom-elements import maps](https://assets.finn.no/map/custom-elements/v2) will get the new version of @warp-ds/elements-core in production.
    It's then a good practice to be on the lookout for possible bug reports. In the case of an alias update resulting in a bug, the Eik alias can always be downgraded using the same command, just with the previous version number.

### Additional Notes

- Updating the Eik Alias 
- Coordinate with the Warp Core Team to avoid conflicts during the publishing process.

For any issues or further clarification, please refer to our [documentation](https://github.com/warp-ds/labs) or contact the maintainers.
