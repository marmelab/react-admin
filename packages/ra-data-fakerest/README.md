# FakeRest Data Provider For React-Admin

Client-side data provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

This package takes a JSON object as input, then creates a client-side data provider around it - no backend involved. The provider issues no HTTP requests, every operation happens locally in the browser. It's ideal to run e2e tests without an API server, or to showcase an admin only with a static server.

All operations carried out in react-admin are local to the browser, and last only for the current browser session. A browser refresh erases all modifications.

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://www.youtube.com/watch?v=bJEo1O1oT6o)

## Installation

```sh
npm install --save ra-data-fakerest
```

## Usage

Pass a JSON object to the provider constructor:

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest';

const dataProvider = fakeDataProvider({
    posts: [
        { id: 0, title: 'Hello, world!' },
        { id: 1, title: 'FooBar' },
    ],
    comments: [
        { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
        { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
    ],
})

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

Additionally, you can turn on console logging of fake requests by passing `true` as second parameter of the constructor.

## Input Format

The main parameter must be an object literal with one key for each resource type. Values are arrays of resources. Resources must be object literals with at least an `id` key.

Foreign keys are also supported: just name the field `{related_resource_name}_id` and give an existing value.

Here is an example input:

```json
{
    "posts": [
        { "id": 0, "title": "Hello, world!" },
        { "id": 1, "title": "FooBar" }
    ],
    "comments": [
        { "id": 0, "post_id": 0, "author": "John Doe", "body": "Sensational!" },
        { "id": 1, "post_id": 0, "author": "Jane Doe", "body": "I agree" }
    ]
}
```

You can find a more sophisticated example in [the Posters Galore demo](https://raw.githubusercontent.com/marmelab/ng-admin-demo/master/js/data.js). 

## Logging

Pass `true` as second argument to log the requests made to the provider in the console. This is very helpful to debug the requests made by an app using this data provider.

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest';

const dataProvider = fakeDataProvider({ /* data here */ }, true);

const App = () => (
    <Admin dataProvider={dataProvider}>
        // ...
    </Admin>
);
```

## Delay

You can pass a delay in milliseconds as the third argument to the constructor. This will simulate a network delay for each request.

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest';

const dataProvider = fakeDataProvider({ /* data here */ }, false, 1000);

const App = () => (
    <Admin dataProvider={dataProvider}>
        // ...
    </Admin>
);
```

## Inspecting the Data

`ra-data-fakerest` makes its internal database accessible in the global scope under the `_database` key. You can use it to inspect the data in your browser console.

```js
_database.getOne('posts', 1);
// { id: 1, title: 'FooBar' }
```

## Features

This data provider uses [FakeRest](https://github.com/marmelab/FakeRest) under the hood. That means that it offers the same features:

- pagination
- sorting
- filtering by column
- filtering by the `q` full-text search
- filtering numbers and dates greater or less than a value
- embedding related resources

## Embedding

`ra-data-fakerest` supports [Embedded Relationships](https://marmelab.com/react-admin/DataProviders.html#embedding-relationships). Use the `meta.embed` query parameter to specify the relationships that you want to embed. 

```jsx
dataProvider.getOne('posts', { id: 1, meta: { embed: ['author'] } });
// { 
//    data: { id: 1, title: 'FooBar', author: { id: 1, name: 'John Doe' } },
// }
```

You can embed more than one related record, so the `embed` value must be an array. The name of the embedded resource must be singular for a many-to-one relationship, and plural for a one-to-many relationship.

```
{ meta: { embed: ['author', 'comments'] } }
```

You can leverage this feature in page components to avoid multiple requests to the data provider:

```jsx
const PostList = () => (
    <List queryOptions={{ meta: { embed: ['author'] } }}>
        <Datagrid>
            <TextField source="title" />
            <TextField source="author.name" />
        </Datagrid>
    </List>
);
```

Embedding Relationships is supported in `getList`, `getOne`, `getMany`, and `getManyReference` queries.

## Prefetching

`ra-data-fakerest` also supports [Prefetching Relationships](https://marmelab.com/react-admin/DataProviders.html#prefetching-relationships) to pre-populate the query cache with related resources. Use the `meta.prefetch` query parameter to specify the relationships that you want to prefetch.

```jsx
dataProvider.getOne('posts', { id: 1, meta: { prefetch: ['author'] } });
// { 
//    data: { id: 1, title: 'FooBar', author_id: 1 },
//    meta: {
//      prefetched: {
//        authors: [{ id: 1, name: 'John Doe' }]
//      }
//    }
// }
```

Prefetching is useful to avoid additional requests when rendering a list of resources with related resources using a `<ReferenceField>` component:

```jsx
const PostList = () => (
    <List queryOptions={{ meta: { prefetch: ['author'] } }}>
        <Datagrid>
            <TextField source="title" />
            {/** renders without an additional request */}
            <ReferenceField source="author_id" reference="authors" />
        </Datagrid>
    </List>
);
```

Prefetching Relationships is supported in `getList`, `getOne`, `getMany`, and `getManyReference` queries.

## License

This data provider is licensed under the MIT License, and sponsored by [marmelab](https://marmelab.com).
