# ra-data-localstorage

A dataProvider for [react-admin](https://github.com/marmelab/react-admin) that uses a local database, persisted in localStorage.

The provider issues no HTTP requests; every CRUD query happens locally in the browser. User editions are shared between tabs, and persisted even after a user session ends. This allows local-first apps, and can be useful in tests.

## Installation

```sh
npm install --save ra-data-local-storage
```

## Usage

The default export is a function that returns a data provider.

When used without parameters, the data provider uses a local database with no data. You can then use the `useDataProvider` hook to populate it. The changes are persisted in localStorage (in the `ra-data-local-storage` key), so they will be available on the next page load.

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import localStorageDataProvider from 'ra-data-local-storage';
import { PostList } from './posts';

const dataProvider = localStorageDataProvider();

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

The function accepts an options object as parameter, with the following keys:

- `defaultData`: an object literal with one key for each resource type, and an array of resources as value. See below for more details.
- `loggingEnabled`: a boolean to enable logging of all calls to the data provider in the console. Defaults to `false`.
- `localStorageKey`: the key to use in localStorage to store the data. Defaults to `ra-data-local-storage`.
- `localStorageUpdateDelay`: the delay (in milliseconds) between a change in the data and the update of localStorage. Defaults to 10 milliseconds.

## `defaultData`

By default, the data provider starts with no resource. To set default data if the storage is empty, pass a JSON object as the `defaultData` argument:

```jsx
const dataProvider = localStorageDataProvider({
    defaultData: {
        posts: [
            { id: 0, title: 'Hello, world!' },
            { id: 1, title: 'FooBar' },
        ],
        comments: [
            { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
            { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
        ],
    }
});
```

The `defaultData` parameter must be an object literal with one key for each resource type. Values are arrays of resources. Resources must be object literals with at least an `id` key.

Foreign keys are also supported: just name the field `{related_resource_name}_id` and give an existing value.

## `loggingEnabled`

As this data provider doesn't use the network, you can't debug it using the network tab of your browser developer tools. However, it can log all calls (input and output) in the console, provided you set the `loggingEnabled` parameter:

```jsx
const dataProvider = localStorageDataProvider({
    loggingEnabled: true
});
```

## `localStorageKey`

By default, the data provider uses the `ra-data-local-storage` key in localStorage. You can change this key by passing a `localStorageKey` parameter:

```jsx
const dataProvider = localStorageDataProvider({
    localStorageKey: 'my-app-data'
});
```

## `localStorageUpdateDelay`

By default, the data provider updates localStorage 10 milliseconds after every change. This can be slow if you have a lot of data. You can change this behavior by passing a `localStorageUpdateDelay` parameter:

```jsx
const dataProvider = localStorageDataProvider({
    localStorageUpdateDelay: 2
});
```

## Features

This data provider uses [FakeRest](https://github.com/marmelab/FakeRest) under the hood. That means that it offers the same features:

- pagination
- sorting
- filtering by column
- filtering by the `q` full-text search
- filtering numbers and dates greater or less than a value
- embedding related resources

## License

This data provider is licensed under the MIT License, and sponsored by [marmelab](https://marmelab.com).
