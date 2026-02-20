# ra-offline

Demo app showing the React-Admin offline-first capabilities.

It uses [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) to make the app a Progressive Web App, and [configures the TanStack QueryClient](https://marmelab.com/react-admin/DataProviders.html#offline-support) to persist the query cache and pending mutations in the local storage.

## Installation

Install the application dependencies by running:

```sh
npm install
```

## Usage

The offline mode doesn't work in dev mode, that's a limitation of vite-pwa.

Build the application in production mode and serve it by running:

```sh
npm run build
npm run preview
```

Use the Browser DevTools (or phone Airplane mode) to simulate Offline mode when needed. Using TanStack Query DevTools does not work.

## Limitations

This demo is hooked up to the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API, so the changes are not persisted for real. But the mutation should be visible in the Network tab and not trigger errors.

