# ra-router-tanstack

TanStack Router adapter for [react-admin](https://marmelab.com/react-admin/).

## Installation

```sh
npm install ra-router-tanstack @tanstack/react-router @tanstack/history
# or
yarn add ra-router-tanstack @tanstack/react-router @tanstack/history
```

## Usage

### Standalone Mode

Use `tanStackRouterProvider` as the `routerProvider` prop on `<Admin>`:

```tsx
import { Admin, Resource } from 'react-admin';
import { tanStackRouterProvider } from 'ra-router-tanstack';

const App = () => (
    <Admin routerProvider={tanStackRouterProvider} dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

### Embedded Mode

When embedding react-admin inside an existing TanStack Router application, use the `basename` prop:

```tsx
import { Admin, Resource } from 'react-admin';
import { tanStackRouterProvider } from 'ra-router-tanstack';

const AdminApp = () => (
    <Admin
        routerProvider={tanStackRouterProvider}
        dataProvider={dataProvider}
        basename="/admin"
    >
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

Then mount it in your TanStack Router route tree.

## Custom Routes

Use `tanStackRouterProvider.Route` for custom routes:

```tsx
import { Admin, CustomRoutes } from 'react-admin';
import { tanStackRouterProvider } from 'ra-router-tanstack';

const { Route } = tanStackRouterProvider;

const App = () => (
    <Admin routerProvider={tanStackRouterProvider} dataProvider={dataProvider}>
        <CustomRoutes>
            <Route path="/settings" element={<SettingsPage />} />
        </CustomRoutes>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

## License

MIT
