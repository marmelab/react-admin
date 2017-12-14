# ra-graphql-client-graphcool

[![Build Status](https://travis-ci.org/marmelab/ra-graphql.svg?branch=master)](https://travis-ci.org/marmelab/ra-graphql)

A GraphQL client for [react-admin](https://github.com/marmelab/react-admin/)
built with [Apollo](http://www.apollodata.com/) and tailored to target the [GraphCool](https://www.graph.cool/) service.

A version of the `react-admin` demo using this client is available at https://react-admin-graphql.now.sh/.<br>

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)

## Installation

Install with:

```sh
npm install --save ra-graphql-client-graphcool
```

or

```sh
yarn add ra-graphql-client-graphcool
```

## Usage

This example assumes a `Post` type is defined in the graphcool schema.

```js
// in App.js
import React, { Component } from 'react';
import buildApolloClient from 'ra-graphql-client-graphcool';
import { Admin, Resource, Delete } from 'react-admin';

import { PostCreate, PostEdit, PostList } from './posts';

const client = new ApolloClient();

class App extends Component {
    constructor() {
        super();
        this.state = { restClient: null };
    }
    componentDidMount() {
        buildApolloClient({ client: { uri: 'https://api.graph.cool/simple/v1/graphcool_id' }})
            .then(restClient => this.setState({ restClient }));
    }

    render() {
        const { restClient } = this.state;

        if (!restClient) {
            return <div>Loading</div>;
        }

        return (
            <Admin restClient={restClient}>
                <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} />
            </Admin>
        );
    }
}

export default App;
```

And that's it, `buildApolloClient` will create a default ApolloClient for you and run an [introspection](http://graphql.org/learn/introspection/) query on your graphcool endpoint, listing all potential resources.

## Options

### Customize the Apollo client

You can either supply the client options by calling `buildApolloClient` like this:

```js
buildApolloClient({ client: { uri: 'https://api.graph.cool/simple/v1/graphcool_id', ...otherApolloOptions } });
```

Or supply your client directly with:

```js
buildApolloClient({ client: myClient });
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

Pass the introspection options to the `buildApolloClient` function:

```js
buildApolloClient({ introspection: introspectionOptions });
```

## Contributing

Run the tests with this command:

```sh
make test
```
