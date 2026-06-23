# ra-router-react-router-v8

[React Router v8](https://reactrouter.com) adapter for [react-admin](https://github.com/marmelab/react-admin).

react-admin ships with a React Router v6/v7 adapter by default. Use this package to
run react-admin on React Router v8.

> **Note:** React Router v8 requires React 19. Make sure your application uses
> `react@^19.2.7` and `react-dom@^19.2.7`.

## Installation

```sh
npm install ra-router-react-router-v8 react-router@^8
# or
yarn add ra-router-react-router-v8 react-router@^8
```

## Usage

Use the `reactRouterV8Provider` as the `routerProvider` prop on `<Admin>`:

```tsx
import { Admin, Resource } from 'react-admin';
import { reactRouterV8Provider } from 'ra-router-react-router-v8';
import { dataProvider } from './dataProvider';
import { PostList, PostEdit, PostCreate } from './posts';

export const App = () => (
    <Admin routerProvider={reactRouterV8Provider} dataProvider={dataProvider}>
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
