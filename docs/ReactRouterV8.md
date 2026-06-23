---
layout: default
title: "React Router v8 Integration"
---

# React Router v8 Integration

By default, react-admin is powered by [React Router](https://reactrouter.com/) v6/v7 through its built-in router adapter. React Router v8 merged the former `react-router-dom` package into `react-router` and requires **React 19**, so support for it ships as a separate, opt-in adapter package: `ra-router-react-router-v8`.

Use this package when your application runs on React Router v8.

## Installation

```bash
npm install ra-router-react-router-v8 react-router@^8
# or
yarn add ra-router-react-router-v8 react-router@^8
```

React Router v8 requires React 19. Make sure your application uses `react@^19.2.7` and `react-dom@^19.2.7`.

## Configuration

Set the `<Admin routerProvider>` to `reactRouterV8Provider`:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import { reactRouterV8Provider } from 'ra-router-react-router-v8';
import { dataProvider } from './dataProvider';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        routerProvider={reactRouterV8Provider}
    >
        <Resource name="posts" list={ListGuesser} />
        <Resource name="comments" list={ListGuesser} />
    </Admin>
);

export default App;
```

That's it! React-admin will now use React Router v8 for all routing operations.

## Standalone Mode

When using `reactRouterV8Provider` without an existing React Router, react-admin creates its own hash router automatically (URLs like `/#/posts`). This is called **standalone mode**. This is the simplest setup and requires no additional configuration.

## Embedded Mode

If your application already uses React Router, you can embed react-admin inside it. React-admin detects the existing router context and uses it instead of creating its own.

## When To Use This Package

- Use the **built-in** react-router adapter (no extra package) if your app runs on React Router v6 or v7.
- Use **`ra-router-react-router-v8`** if your app runs on React Router v8 (and therefore React 19).
