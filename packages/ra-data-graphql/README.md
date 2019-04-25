# ra-data-graphql

A GraphQL data provider for [react-admin](https://github.com/marmelab/react-admin/)
built with [Apollo](http://www.apollodata.com/)

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)

This is a very low level library which is not meant to be used directly unless you really want full control or are building a custom GraphQL data provider.

It provides the foundations for other GraphQL data provider packages such as `ra-data-graphcool` or `ra-data-graphql-simple`

## About GraphQL and Apollo

This library is meant to be used with Apollo on the **client** side but
you're free to use any graphql **server**.

## How does it work?

In a nutshell, `ra-data-graphql` runs an *introspection query* on your GraphQL API and passes it to your adaptator, along with the *type of query* that is being made (`CREATE`, `UPDATE`, `GET_ONE`, `GET_LIST` etc..) and the *name of the resource* that is being queried.

It is then the job of ***your*** GraphQL adaptator to craft the GraphQL query that will match your backend conventions, and to provide a function that will parse the response of that query in a way that react-admin can understand.

Once the query and the function are passed back to `ra-data-graphql`, the actual HTTP request is sent (using [ApolloClient](https://github.com/apollographql/apollo-client)) to your GraphQL API. The response from your backend is then parsed with the provided function and that parsed response is given to `ra-core`, the core of `react-admin`.

Below is a rough graph summarizing how the data flows:

`ra-core` => `ra-data-graphql` => `your-adaptator` => `ra-data-graphql` => `ra-core`

## Installation

Install with:

```sh
npm install --save graphql ra-data-graphql
```

or

```sh
yarn add graphql ra-data-graphql
```

## Usage

```jsx
// in App.js
import React, { Component } from 'react';
import buildGraphQLProvider from 'ra-data-graphql';
import { Admin, Resource, Delete } from 'react-admin';

import buildQuery from './buildQuery'; // see Specify your queries and mutations section below
import { PostCreate, PostEdit, PostList } from '../components/admin/posts';

class App extends Component {
    constructor() {
        super();
        this.state = { dataProvider: null };
    }
    componentDidMount() {
        buildGraphQLProvider({ buildQuery })
            .then(dataProvider => this.setState({ dataProvider }));
    }

    render() {
        const { dataProvider } = this.state;

        if (!dataProvider) {
            return <div>Loading</div>;
        }

        return (
            <Admin dataProvider={dataProvider}>
                <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} />
            </Admin>
        );
    }
}

export default App;
```

## Options

### Customize the Apollo client

You can specify the client options by calling `buildGraphQLProvider` like this:

```js
import { createNetworkInterface } from 'react-apollo';

buildGraphQLProvider({
    client: {
        networkInterface: createNetworkInterface({
            uri: 'http://api.myproduct.com/graphql',
        }),
    },
});
```

You can pass any options supported by the [ApolloClient](http://dev.apollodata.com/core/apollo-client-api.html#apollo-client) contructor with the addition of `uri` which can be specified so that we create the network interface for you.

You can also supply your own [ApolloClient](http://dev.apollodata.com/core/apollo-client-api.html#apollo-client) instance directly with:

```js
buildGraphQLProvider({ client: myClient });
```

### Introspection Options

Instead of running an introspection query you can also provide the introspection query result directly. This speeds up the initial rendering of the `Admin` component as it no longer has to wait for the introspection query request to resolve.

```jsx
import { __schema as schema } from './schema';

buildGraphQLProvider({
    introspection: { schema }
});
```

The `./schema` file is a `schema.json` in `./scr` retrieved with [`get-graphql-schema --json <graphql_endpoint>`](https://github.com/graphcool/get-graphql-schema).

> Note: Importing the `schema.json` file will significantly increase the bundle size.

## Specify your queries and mutations

For the provider to know how to map react-admin request to apollo queries and mutations, you must provide a `buildQuery` option. The `buildQuery` is a factory function which will be called with the introspection query result.

The introspection result is an object with 4 properties:

- `types`: an array of all the GraphQL types discovered on your endpoint
- `queries`: an array of all the GraphQL queries and mutations discovered on your endpoint
- `resources`: an array of objects with a `type` property, which is the GraphQL type for this resource, and a property for each react-admin fetch verb for which we found a matching query or mutation
- `schema`: the full schema

For example:

```js
{
    types: [
        {
            name: 'Post',
            kind: 'OBJECT',
            fields: [
                { name: 'id', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'ID' } } },
                { name: 'title', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } } },
                ...
            ]
        },
        ...
    ],
    queries: [
        {
            name: 'createPost',
            args: [
                { name: 'title', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } } }
            ],
            type : { kind: 'OBJECT', name: 'Category' }
        },
        ...
    ],
    resources: [
        {
            type: {
                name: 'Post',
                kind: 'OBJECT',
                fields: [
                    { name: 'id', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'ID' } } },
                    { name: 'title', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } } },
                    ...
                ]
            },
            GET_LIST: {
                name: 'createPost',
                args: [
                    { name: 'title', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } } }
                ],
                type : { kind: 'OBJECT', name: 'Category' }
            },
            ...
        }
    ],
    schema: {} // Omitting for brevity
}
```

The `buildQuery` function must return a function which will be called with the same parameters as the react-admin data provider, but must return an object matching the `options` of the ApolloClient [query](http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.query) method with an additional `parseResponse` function.

This `parseResponse` function will be called with an [ApolloQueryResult](http://dev.apollodata.com/core/apollo-client-api.html#ApolloQueryResult) and must return the data expected by react-admin.

For example:

```js
import buildFieldList from './buildFieldList';

const buildQuery = introspectionResults => (raFetchType, resourceName, params) => {
    const resource = introspectionResults.resource.find(r => r.type.name === resourceName);

    switch (raFetchType) {
        case 'GET_ONE':
            return {
                query: gql`query ${resource[raFetchType].name}($id: ID) {
                    data: ${resource[raFetchType].name}(id: $id) {
                        ${buildFieldList(introspectionResults, resource, raFetchType)}
                    }
                }`,
                variables: params, // params = { id: ... }
                parseResponse: response => response.data,
            }
            break;
        // ... other types handled here
    }
}
```

```js
buildGraphQLProvider({ buildQuery });
```

## Troubleshooting

## When I create or edit a resource, the list or edit page does not refresh its data

`react-admin` maintain its own cache of resources data but, by default, so does the Apollo client. For every queries, we inject a default [`fetchPolicy`](http://dev.apollodata.com/react/api-queries.html#graphql-config-options-fetchPolicy) set to `network-only` so that the Apollo client always refetch the data when requested.

Do not override this `fetchPolicy`.

## Contributing

Run the tests with this command:

```sh
make test
```
