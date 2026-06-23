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

Pass the `reactRouterV8Provider` to the `routerProvider` prop of the `<Admin>` component:

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

## Development

This package ships with Storybook stories (`*.stories.tsx`) covering the adapter's
behavior. Unit tests are not included yet: React Router v8 requires React 19, while
react-admin's test suite currently runs on React 18, so the stories cannot be
exercised by the shared Jest run. Adding a React 19 test lane for this package is a
follow-up once the project's test environment supports React 19.

## License

This package is licensed under the MIT License.
