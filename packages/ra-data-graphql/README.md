# ra-data-graphql

Tools for building a GraphQL data provider for [react-admin](https://github.com/marmelab/react-admin/)
based on **introspection**. Built with [Apollo Client](https://www.apollographql.com/apollo-client)

This is a low level library designed to be used as a base of other GraphQL providers (such as `ra-data-graphql-simple`). Do not use it directly. If you want to build a GraphQL data provider **without using introspection**, don't use this package but follow the [Writing a data provider](https://marmelab.com/react-admin/DataProviderWriting.html#getlist) documentation.

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)

Note: This library is meant to be used with Apollo on the **client** side, but you're free to use any graphql **server**.

## How does it work?

In a nutshell, `ra-data-graphql` runs an *introspection query* on your GraphQL API and passes it to your adapter, along with the *type of query* that is being made (`CREATE`, `UPDATE`, `GET_ONE`, `GET_LIST` etc..) and the *name of the resource* that is being queried.

It is then the job of ***your*** GraphQL adapter to craft the GraphQL query that will match your backend conventions, and to provide a function that will parse the response of that query in a way that react-admin can understand.

Once the query and the function are passed back to `ra-data-graphql`, the actual HTTP request is sent (using [ApolloClient](https://github.com/apollographql/apollo-client)) to your GraphQL API. The response from your backend is then parsed with the provided function and that parsed response is given to `ra-core`, the core of `react-admin`.

Below is a rough graph summarizing how the data flows:

`ra-core` => `ra-data-graphql` => `your-adapter` => `ra-data-graphql` => `ra-core`

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

Build the data provider on mount, and pass it to the `<Admin>` component when ready:

```jsx
// in App.js
import * as React from 'react';
import { useState, useEffect } from 'react';
import buildGraphQLProvider from 'ra-data-graphql';
import { Admin, Resource } from 'react-admin';

import buildQuery from './buildQuery'; // see Specify your queries and mutations section below
import { PostCreate, PostEdit, PostList } from '../components/admin/posts';

const dataProvider = buildGraphQLProvider({ buildQuery });

const App = () =>  (
    <Admin dataProvider={dataProvider}>
        <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} />
    </Admin>
);

export default App;
```

## Options

## Specify queries and mutations

For the provider to know how to map react-admin request to apollo queries and mutations, you must provide a `buildQuery` option. The `buildQuery` is a factory function that will be called with the introspection query result.

As a reminder, the result of a GraphQL introspection query is an object with 4 properties:

- `types`: an array of all the GraphQL types discovered on your endpoint
- `queries`: an array of all the GraphQL queries and mutations discovered on your endpoint
- `resources`: an array of objects with a `type` property, which is the GraphQL type for this resource, and a property for each react-admin fetch verb for which we found a matching query or mutation
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

The `buildQuery` function receives this object and must return a function which will be called with the same parameters as the react-admin data provider, but must return an object matching the `options` of the ApolloClient [query](http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.query) method with an additional `parseResponse` function.

This `parseResponse` function will be called with an [ApolloQueryResult](http://dev.apollodata.com/core/apollo-client-api.html#ApolloQueryResult) and must return the data expected by react-admin.

For example:

```js
import buildFieldList from './buildFieldList';

const buildQuery = introspectionResults => (raFetchType, resourceName, params) => {
    const resource = introspectionResults.resources.find(r => r.type.name === resourceName);

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

You can pass any options supported by the [ApolloClient](https://www.apollographql.com/docs/react/api/core/ApolloClient/) constructor with the addition of `uri` which can be specified so that we create the network interface for you. Pass those options as `clientOptions`.

You can also supply your own [ApolloClient](https://www.apollographql.com/docs/react/api/core/ApolloClient/) instance directly with:

```js
buildGraphQLProvider({ client: myClient });
```

### Introspection Options

Instead of running an introspection query you can also provide the introspection query result directly. This speeds up the initial rendering of the `Admin` component as it no longer has to wait for the introspection query request to resolve.

```js
import { __schema as schema } from './schema';

buildGraphQLProvider({
    introspection: { schema }
});
```

The `./schema` file is a `schema.json` in `./src` retrieved with [get-graphql-schema --json <graphql_endpoint>](https://github.com/graphcool/get-graphql-schema).

> Note: Importing the `schema.json` file will significantly increase the bundle size.

## Leveraging Introspection In Custom Methods

If you need to build custom methods based on the introspection, you can leverage the `getIntrospection` method of the `dataProvider`. It returns an object with the following format:

```js
{
    // The original schema as returned by the Apollo client
    schema: {},
    // An array of object describing the types that are compatible with react-admin resources
    // and the methods they support. Note that not all methods may be supported.
    resources: [
        {
            type: { name: 'name-of-the-type' }, // e.g. Post
            GET_LIST: { name: 'name-of-the-query' }, // e.g. allPosts
            GET_MANY: { name: 'name-of-the-query' }, // e.g. allPosts
            GET_MANY_REFERENCE: { name: 'name-of-the-query' }, // e.g. allPosts
            GET_ONE: { name: 'name-of-the-query' }, // e.g. Post
            CREATE: { name: 'name-of-the-query' }, // e.g. createPost
            UPDATE: { name: 'name-of-the-query' }, // e.g. updatePost
            DELETE: { name: 'name-of-the-query' }, // e.g. deletePost
        },
    ],
}
```

This is useful if you need to support custom dataProvider methods such as those needed for ['@react-admin/ra-realtime'](https://react-admin-ee.marmelab.com/documentation/ra-realtime#dataprovider-requirements):

```tsx
import { Identifier, GET_LIST, GET_ONE } from 'ra-core';
import { RealTimeDataProvider } from '@react-admin/ra-realtime';
import { buildDataProvider, IntrospectedResource } from 'ra-data-graphql';

const subscriptions: {
    topic: string;
    subscription: any;
    subscriptionCallback: any;
}[];

const baseDataProvider = buildDataProvider(/* */);

export const dataProvider: RealTimeDataProvider = {
    ...baseDataProvider,
    subscribe: async (topic, subscriptionCallback) => {
        const raRealTimeTopic = topic.startsWith('resource/') ? topic.split('/') : null;
        if (!raRealTimeTopic) throw new Error(`Invalid ra-realtime topic ${topic}`);
    
        // Two possible topic patterns
        //    1. resource/${resource}
        //    2. resource/${resource}/${id}
        const [, resourceName, id] = raRealTimeTopic;
        const introspectionResults = await baseDataProvider.getIntrospection();
        const resourceIntrospection = introspectionResults.resources.find(
            resource => resource.type.name === resourceName
        );
        if (!resourceIntrospection) throw new Error(`Invalid resource ${resourceName}`);

        const { query, queryName, variables } = buildQuery({ id, resource, resourceIntrospection });
        const subscription = baseDataProvider.client
            .subscribe({ query, variables })
            .subscribe(data =>
                subscriptionCallback(data.data[queryName].event)
            );

        subscriptions.push({
            topic,
            subscription,
            subscriptionCallback,
        });

        return Promise.resolve({ data: null });
    },
    unsubscribe: async (topic: string, subscriptionCallback: any) => {
        const subscriptionIndex = subscriptions.findIndex(
            subscription =>
                subscription.topic !== topic ||
                subscription.subscriptionCallback !== subscriptionCallback
        );

        if (subscriptionIndex) {
            subscriptions[subscriptionIndex].unsubscribe();
            subscriptions = subscriptions.splice(subscriptionIndex, 1);
        }
        return Promise.resolve({ data: null });
    },
}

const buildQuery = (
    {
        id,
        resource,
        resourceIntrospection
    }: {
        id: Identifier | undefined;
        resource: string;
        resourceIntrospection: IntrospectedResource
    }
) => {
    if (!id) {
        if (!resourceIntrospection[GET_LIST]) throw new Error(`Resource ${resource} does not support the getList method`);
        return {
            queryName: resourceIntrospection[GET_LIST],
            query: gql`subscription ${queryName} { ${queryName}{ topic event } }`,
            variables: {},
        }
    }

    if (!resourceIntrospection[GET_ONE]) throw new Error(`Resource ${resource} does not support the getOne method`);
    return {
        queryName: resourceIntrospection[GET_LIST],
        query: gql`subscription ${queryName}($id: ID!) { ${queryName}(id: $id){ topic event } }`,
        variables: { id },
    }
}
```

## Troubleshooting

## When I create or edit a resource, the list or edit page does not refresh its data

`react-admin` maintain its own cache of resources data but, by default, so does the Apollo client. For every query, we inject a default [`fetchPolicy`](http://dev.apollodata.com/react/api-queries.html#graphql-config-options-fetchPolicy) set to `network-only` so that the Apollo client always refetch the data when requested.

Do not override this `fetchPolicy`.

## Contributing

Run the tests with this command:

```sh
make test
```
