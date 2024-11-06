# Mitosis Starter

This is a repo for Mitosis components


## Developing

1. Run Mitosis in watch mode

```bash
npm run start
```

2. If the output has its own bundling step (like Svelte/Qwik), you will need to run that build step in a separate terminal:

```bash
cd /packages/qwik
npm run build:watch
```

## Next up

If you want to add more outputs, or configure Mitosis in any way, you will need to update the `mitosis.config.js` file in the root of your project.
Check [our configuration docs](/docs/configuration.md) for how to setup the Mitosis config file.
