---
layout: default
title: "React Router v8 Integration"
---

# React Router v8 Integration

By default, react-admin is powered by [React Router](https://reactrouter.com/) v6/v7 through the `ra-router-react-router` adapter, which is installed automatically. React Router v8 merged the former `react-router-dom` package into `react-router` and requires **React 19**, so support for it ships as a separate, opt-in adapter package: `ra-router-react-router-next`.

**New projects are encouraged to run on React Router v8 using `ra-router-react-router-next`.** The React Router v6/v7 adapter remains the default for backward compatibility, and **`ra-router-react-router-next` will become the default `ra-router-react-router` in react-admin v6.**

Use this package when your application runs on React Router v8.

## Installation

```bash
npm install ra-router-react-router-next react-router@^8
# or
yarn add ra-router-react-router-next react-router@^8
```

React Router v8 requires React 19. Make sure your application uses `react@^19.2.7` and `react-dom@^19.2.7`.

## Configuration

Set the `<Admin routerProvider>` to `reactRouterNextProvider`:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import { reactRouterNextProvider } from 'ra-router-react-router-next';
import { dataProvider } from './dataProvider';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        routerProvider={reactRouterNextProvider}
    >
        <Resource name="posts" list={ListGuesser} />
        <Resource name="comments" list={ListGuesser} />
    </Admin>
);

export default App;
```

That's it! React-admin will now use React Router v8 for all routing operations.

## Standalone Mode

When using `reactRouterNextProvider` without an existing React Router, react-admin creates its own hash router automatically (URLs like `/#/posts`). This is called **standalone mode**. This is the simplest setup and requires no additional configuration.

## Embedded Mode

If your application already uses React Router, you can embed react-admin inside it. React-admin detects the existing router context and uses it instead of creating its own.

## When To Use This Package

- Use the **default** `ra-router-react-router` adapter (installed automatically, no extra setup) if your app runs on React Router v6 or v7.
- Use **`ra-router-react-router-next`** if your app runs on React Router v8 (and therefore React 19). This is the recommended choice for new projects, and it will become the default in react-admin v6.
