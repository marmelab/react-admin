# ra-data-graphcool

A GraphQL data provider for [react-admin](https://github.com/marmelab/react-admin/)
built with [Apollo](http://www.apollodata.com/) and tailored to target the [GraphCool](https://www.graph.cool/) service.

A version of the `react-admin` demo using this data provider is available at https://react-admin-graphql.now.sh/.<br>

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)

## Installation

Install with:

```sh
npm install --save graphql ra-data-graphcool
```

or

```sh
yarn add graphql ra-data-graphcool
```

## Usage

This example assumes a `Post` type is defined in the graphcool schema.

```js
// in App.js
import React, { Component } from 'react';
import buildGraphcoolProvider from 'ra-data-graphcool';
import { Admin, Resource, Delete } from 'react-admin';

import { PostCreate, PostEdit, PostList } from './posts';

const client = new ApolloClient();

class App extends Component {
    constructor() {
        super();
        this.state = { dataProvider: null };
    }
    componentDidMount() {
        buildGraphcoolProvider({ clientOptions: { uri: 'https://api.graph.cool/simple/v1/graphcool_id' }})
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

And that's it, `buildGraphcoolProvider` will create a default ApolloClient for you and run an [introspection](http://graphql.org/learn/introspection/) query on your graphcool endpoint, listing all potential resources.

This works with any GraphCool endpoint, or any GraphQL endpoint modeled after [the GraphCool grammar](https://github.com/graphcool/graphcool-framework/blob/master/docs/0.x/02-Concepts/02-Database-%26-API/03-API-Capabilities.md):

![GraphCool gammar](https://camo.githubusercontent.com/a58fc16d347122afd015c06a96591c5ecc1bed62/68747470733a2f2f696d6775722e636f6d2f4d6f496e665a4d2e706e67) 

## Options

### Customize the Apollo client

You can either supply the client options by calling `buildGraphcoolProvider` like this:

```js
buildGraphcoolProvider({ clientOptions: { uri: 'https://api.graph.cool/simple/v1/graphcool_id', ...otherApolloOptions } });
```

Or supply your client directly with:

```js
buildGraphcoolProvider({ client: myClient });
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

Graphcool does not allow multiple deletions or updates in a single query. This provider simply makes multiple requests to handle those. This is obviously not ideal but can be alleviated by supplying your own `ApolloClient` which could use the [apollo-link-batch-http](https://www.apollographql.com/docs/link/links/batch-http.html) link. Indeed, Graphcool does support query batching.

## Contributing

Run the tests with this command:

```sh
make test
```
