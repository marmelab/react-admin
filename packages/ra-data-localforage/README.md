# ra-data-localForage

A data provider for [react-admin](https://github.com/marmelab/react-admin) that uses [localForage](https://localforage.github.io/localForage/). It uses asynchronous storage (IndexedDB or WebSQL) with a simple, localStorage-like API. It fallback to localStorage in browsers with no IndexedDB or WebSQL support.

The provider issues no HTTP requests, every operation happen locally in the browser. User editions are persisted across refreshes and between sessions. This allows local-first apps and can be useful in tests.

## Installation

```sh
npm install --save ra-data-local-forage
```

## Usage

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import localForageDataProvider from 'ra-data-local-forage';

import { PostList } from './posts';

const App = () => {
  const [dataProvider, setDataProvider] = React.useState<DataProvider | null>(null);

  React.useEffect(() => {
    async function startDataProvider() {
      const localForageProvider = await localForageDataProvider();
      setDataProvider(localForageProvider);
    }

    if (dataProvider === null) {
      startDataProvider();
    }
  }, [dataProvider]);

  // hide the admin until the data provider is ready
  if (!dataProvider) return <p>Loading...</p>;

  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="posts" list={ListGuesser}/>
    </Admin>
  );
};

export default App;
```

### defaultData

By default, the data provider starts with no resource. To set default data if the IndexedDB is empty, pass a JSON object as the `defaultData` argument:

```js
const dataProvider = await localForageDataProvider({
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

### loggingEnabled

As this data provider doesn't use the network, you can't debug it using the network tab of your browser developer tools. However, it can log all calls (input and output) in the console, provided you set the `loggingEnabled` parameter:

```js
const dataProvider = await localForageDataProvider({
    loggingEnabled: true
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

This data provider is licensed under the MIT License and sponsored by [marmelab](https://marmelab.com).
