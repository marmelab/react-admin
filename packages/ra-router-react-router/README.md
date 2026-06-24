# ra-router-react-router

[React Router v6](https://reactrouter.com) adapter for [react-admin](https://github.com/marmelab/react-admin).

This is the **default** router adapter used by react-admin. `ra-core` and
`react-admin` depend on it, so you don't need to install or configure it
yourself — react-admin works on React Router v6 out of the box.

> **Note:** This package requires `ra-core` (it implements `ra-core`'s
> `RouterProvider` interface). It is installed automatically as a dependency of
> `ra-core` and `react-admin`.

## Usage

The provider is wired up automatically. You only need to reference it directly
in advanced scenarios, for example to pass it explicitly to `<Admin>`:

```tsx
import { Admin, Resource } from 'react-admin';
import { reactRouterProvider } from 'ra-router-react-router';
import { dataProvider } from './dataProvider';
import { PostList, PostEdit, PostCreate } from './posts';

export const App = () => (
    <Admin routerProvider={reactRouterProvider} dataProvider={dataProvider}>
        <Resource
            name="posts"
            list={PostList}
            edit={PostEdit}
            create={PostCreate}
        />
    </Admin>
);
```

By default the provider creates a hash router. When react-admin is rendered
inside an existing React Router context, it uses that router instead.

## Running on React Router v8

New projects are encouraged to run react-admin on React Router v8 by using the
[`ra-router-react-router-next`](../ra-router-react-router-next) adapter. The v6
adapter shipped in this package remains the default for backward compatibility,
and `ra-router-react-router-next` will become `ra-router-react-router` in
react-admin v6.

## License

MIT
