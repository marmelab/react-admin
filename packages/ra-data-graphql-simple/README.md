# ra-data-graphql-simple

A GraphQL data provider for [react-admin](https://github.com/marmelab/react-admin/)
built with [Apollo](http://www.apollodata.com/) and tailored to target a simple GraphQL implementation.

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)

## Installation

Install with:

```sh
npm install --save graphql ra-data-graphql-simple
```

or

```sh
yarn add graphql ra-data-graphql-simple
```

## Usage

The `ra-data-graphql-simple` package exposes a single function, which is a constructor for a `dataProvider` based on a GraphQL endpoint. When executed, this function calls the GraphQL endpoint, running an [introspection](http://graphql.org/learn/introspection/) query. It uses the result of this query (the GraphQL schema) to automatically configure the `dataProvider` accordingly.

```js
// in App.js
import React, { Component } from 'react';
import buildGraphQLProvider from 'ra-data-graphql-simple';
import { Admin, Resource, Delete } from 'react-admin';

import { PostCreate, PostEdit, PostList } from './posts';

const client = new ApolloClient();

class App extends Component {
    constructor() {
        super();
        this.state = { dataProvider: null };
    }
    componentDidMount() {
        buildGraphQLProvider({ clientOptions: { uri: 'http://localhost:4000' }})
            .then(dataProvider => this.setState({ dataProvider }));
    }

    render() {
        const { dataProvider } = this.state;

        if (!dataProvider) {
            return <div>Loading</div>;
        }

        return (
            <Admin dataProvider={dataProvider}>
                <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} />
            </Admin>
        );
    }
}

export default App;
```

## Expected GraphQL Schema

The `ra-data-graphql-simple` function works against GraphQL servers that respect a certain GraphQL grammar. For instance, to handle all the actions on a `Post` resource, the GraphQL endpoint should support the following schema:

```gql
type Query {
  Post(id: ID!): Post
  allPosts(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): [Post]
  _allPostsMeta(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): ListMetadata
}

type Mutation {
  createPost(
    title: String!
    views: Int!
    user_id: ID!
    User: User
    Comments: [Comment]
  ): Post
  updatePost(
    id: ID!
    title: String!
    views: Int!
    user_id: ID!
    User: User
    Comments: [Comment]
  ): Post
  deletePost(id: ID!): Boolean
}

type Post {
    id: ID!
    title: String!
    views: Int!
    user_id: ID!
    User: User
    Comments: [Comment]
}

type PostFilter {
    q: String
    id: ID
    title: String
    views: Int
    views_lt: Int
    views_lte: Int
    views_gt: Int
    views_gte: Int
    user_id: ID
}

type ListMetadata {
    count: Int!
}

scalar Date
```

This is the grammar used e.g. by [marmelab/json-graphql-server](https://github.com/marmelab/json-graphql-server), a client-side GraphQL server used for test purposes.

## Options

### Customize the Apollo client

You can either supply the client options by calling `buildGraphQLProvider` like this:

```js
buildGraphQLProvider({ clientOptions: { uri: 'http://localhost:4000', ...otherApolloOptions } });
```

Or supply your client directly with:

```js
buildGraphQLProvider({ client: myClient });
```

### Customize the introspection

These are the default options for introspection:

```js
const introspectionOptions = {
    include: [], // Either an array of types to include or a function which will be called for every type discovered through introspection
    exclude: [], // Either an array of types to exclude or a function which will be called for every type discovered through introspection
}

// Including types
const introspectionOptions = {
    include: ['Post', 'Comment'],
};

// Excluding types
const introspectionOptions = {
    exclude: ['CommandItem'],
};

// Including types with a function
const introspectionOptions = {
    include: type => ['Post', 'Comment'].includes(type.name),
};

// Including types with a function
const introspectionOptions = {
    exclude: type => !['Post', 'Comment'].includes(type.name),
};
```

**Note**: `exclude` and `include` are mutualy exclusives and `include` will take precendance.

**Note**: When using functions, the `type` argument will be a type returned by the introspection query. Refer to the [introspection](http://graphql.org/learn/introspection/) documentation for more information.

Pass the introspection options to the `buildApolloProvider` function:

```js
buildApolloProvider({ introspection: introspectionOptions });
```

## `DELETE_MANY` and `UPDATE_MANY` Optimizations

You GraphQL backend may not allow multiple deletions or updates in a single query. This provider simply makes multiple requests to handle those. This is obviously not ideal but can be alleviated by supplying your own `ApolloClient` which could use the [apollo-link-batch-http](https://www.apollographql.com/docs/link/links/batch-http.html) link if your GraphQL backend support query batching.

## Contributing

Run the tests with this command:

```sh
make test
```
