> [!CAUTION]
> This repository has been archived! Please see https://github.com/solo-io/platform-portal-backstage-plugin-backend for our recommended Backstage Portal plugin.

# Backstage With Gloo Platform Portal

This is a [Backstage](https://backstage.io) App with the Gloo Platform Portal frontend plugin installed. This plugin is located in the `./plugins/platform-portal-backstage-plugin-frontend` folder. See the Readme in that folder for more information.

To start the app, run:

```sh
yarn install
yarn dev
```

## Creating Releases

When making a new release, use the GitHub UI, and name your release in the format: `v1.2.3`. When the release is published, a new branch will be made (`v1.2.x`), and that version of [@solo.io/platform-portal-backstage-plugin-frontend](https://www.npmjs.com/package/@solo.io/platform-portal-backstage-plugin-frontend) will be published to NPM.

## Updating GitHub Workflow Secrets

Under "Settings" -> "Secrets and variables" -> "Actions", there is an `NPM_ACCESS_TOKEN`. If it needs to be updated, this token can be generated from account settings on [NPM](https://www.npmjs.com/) for users that have access to the @solo.io NPM organization.
