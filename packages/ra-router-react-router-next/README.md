# ra-router-react-router-next

[React Router v8](https://reactrouter.com) adapter for [react-admin](https://github.com/marmelab/react-admin).

react-admin ships with a React Router v6/v7 adapter by default
([`ra-router-react-router`](../ra-router-react-router)). Use this package to run
react-admin on React Router v8.

New projects are encouraged to use this adapter. The React Router v6/v7 default is
kept for backward compatibility, and **`ra-router-react-router-next` will become
`ra-router-react-router` in react-admin v6.**

> **Note:** React Router v8 requires React 19. Make sure your application uses
> `react@^19.2.7` and `react-dom@^19.2.7`.

## Installation

```sh
npm install ra-router-react-router-next react-router@^8
# or
yarn add ra-router-react-router-next react-router@^8
```

## Usage

Use the `reactRouterNextProvider` as the `routerProvider` prop on `<Admin>`:

```tsx
import { Admin, Resource } from 'react-admin';
import { reactRouterNextProvider } from 'ra-router-react-router-next';
import { dataProvider } from './dataProvider';
import { PostList, PostEdit, PostCreate } from './posts';

export const App = () => (
    <Admin routerProvider={reactRouterNextProvider} dataProvider={dataProvider}>
        <Resource
            name="posts"
            list={PostList}
            edit={PostEdit}
            create={PostCreate}
        />
    </Admin>
);
```

By default the provider creates a hash router. When react-admin is rendered inside an
existing React Router context, it uses that router instead.

## License

MIT
