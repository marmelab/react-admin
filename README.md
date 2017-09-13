# admin-on-rest [![Build Status](https://travis-ci.org/marmelab/admin-on-rest.svg?branch=master)](https://travis-ci.org/marmelab/admin-on-rest)

A frontend Framework for building admin applications running in the browser on top of REST services, using ES6, [React](https://facebook.github.io/react/) and [Material Design](https://material.io/). Open sourced and maintained by [marmelab](https://marmelab.com/).

[Demo](https://marmelab.com/admin-on-rest-demo/) - [Documentation](https://marmelab.com/admin-on-rest/) - [Releases](https://github.com/marmelab/admin-on-rest/releases) - [Support](http://stackoverflow.com/questions/tagged/admin-on-rest)

[![admin-on-rest-demo](https://marmelab.com/admin-on-rest/img/admin-on-rest-demo-still.png)](https://vimeo.com/205118063)

## Features

* Adapts to any REST backend
* Complete documentation
* Optimistic rendering (renders before the server returns)
* Relationships (many to one, one to many)
* Internationalization (i18n)
* Conditional formatting
* Themeable
* Supports any authentication provider (REST API, OAuth, Basic Auth, ...)
* Full-featured Datagrid (sort, pagination, filters)
* Filter-as-you-type
* Supports any form layout (simple, tabbed, etc.)
* Data Validation
* Custom actions
* Large library of components for various data types: boolean, number, rich text, etc.
* WYSIWYG editor
* Customize dashboard, menu, layout
* Super easy to extend and override (it's just React components)
* Highly customizable interface
* Can connect to multiple backends
* Leverages the best libraries in the React ecosystem (Redux, redux-form, redux-saga, material-ui, recompose)
* Can be included in another React app
* Inspired by the popular [ng-admin](https://github.com/marmelab/ng-admin) library (also by marmelab)

## Versions In This Repository

* [master](https://github.com/marmelab/admin-on-rest/commits/master) - commits that will be included in the next _patch_ release

* [next](https://github.com/marmelab/admin-on-rest/commits/next) - commits that will be included in the next _major_ or _minor_ release

Bugfix PRs that don't break BC should be made against **master**. All other PRs (new features, bugfix with BC break) should be made against **next**.

## Installation

Admin-on-rest is available from npm. You can install it (and its required dependencies)
using:

```sh
npm install --save-dev admin-on-rest
```

## Documentation

Read the [Tutorial](http://marmelab.com/admin-on-rest//Tutorial.html) for a 15 minutes introduction. After that, head to the [Documentation](http://marmelab.com/admin-on-rest//index.html), or checkout the [source code of the demo](https://github.com/marmelab/admin-on-rest-demo) for an example usage.

## At a Glance

```jsx
// in app.js
import React from 'react';
import { render } from 'react-dom';
import { simpleRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList, PostEdit, PostCreate, PostIcon } from './posts';

render(
    <Admin restClient={simpleRestClient('http://localhost:3000')}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon}/>
    </Admin>,
    document.getElementById('root')
);
```

The `<Resource>` component is a configuration component that allows to define sub components for each of the admin view: `list`, `edit`, and `create`. These components use Material UI and custom components from admin-on-rest:

```jsx
// in posts.js
import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, DisabledInput, TextInput, LongTextInput, DateInput } from 'admin-on-rest';
export PostIcon from 'material-ui/svg-icons/action/book';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <TextField source="average_note" />
            <TextField source="views" />
            <EditButton basePath="/posts" />
        </Datagrid>
    </List>
);

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = (props) => (
    <Edit title={<PostTitle />} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="title" />
            <TextInput source="teaser" options={{ multiLine: true }} />
            <LongTextInput source="body" />
            <DateInput label="Publication date" source="published_at" />
            <TextInput source="average_note" />
            <DisabledInput label="Nb views" source="views" />
        </SimpleForm>
    </Edit>
);

export const PostCreate = (props) => (
    <Create title="Create a Post" {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="teaser" options={{ multiLine: true }} />
            <LongTextInput source="body" />
            <TextInput label="Publication date" source="published_at" />
            <TextInput source="average_note" />
        </SimpleForm>
    </Create>
);
```

## Does It Work With My REST API?

Yes.

Admin-on-rest uses an adapter approach, with a concept called *REST client*. Existing rest clients can be used as a blueprint to design your API, or you can write your own REST client to query an existing API. Writing a custom REST client is a matter of hours.

![REST client architecture](https://marmelab.com/admin-on-rest/img/rest-client.png)

See the [REST clients documentation](https://marmelab.com/admin-on-rest/RestClients.html) for details.

## Batteries Included But Removable

Admin-on-rest is designed as a library of loosely coupled React components built on top of [material-ui](http://www.material-ui.com/#/), in addition to controller functions implemented the Redux way. It is very easy to replace one part of admin-on-rest with your own, e.g. to use a custom datagrid, GraphQL instead of REST, or bootstrap instead of Material Design.

## Run the example

You can run the example app by calling:

```sh
npm install
make run
```

And then browse to [http://localhost:8080/](http://localhost:8080/).
The credentials are **login/password**

## Contributing

Pull requests are welcome. You must follow the coding style of the existing files (based on [prettier](https://github.com/prettier/prettier)), and include unit tests and documentation. Be prepared for a thorough code review, and be patient for the merge - this is an open-source initiative.

You can run the tests (linting, unit and functional tests) by calling

```sh
make test
```

If you have coding standards problems, you can fix them automatically using `prettier` by calling

```sh
make prettier
```

If you want to contribute to the documentation, install jekyll, then call

```sh
make doc
```

And then browse to [http://localhost:4000/](http://localhost:4000/)

*Note*: if you have added a section with heading to the docs, you also have to add it to `docs/_layouts/default.html` (the links on the left) manually.

If you are using admin-on-rest as a dependency, and if you want to try and hack it, here is the advised process:

```sh
# in myapp
# install admin-on-rest from GitHub in another directory
$ cd ..
$ git clone git@github.com:marmelab/admin-on-rest.git && cd admin-on-rest && make install
# replace your node_modules/admin-on-rest by a symbolic link to the github checkout
$ cd ../myapp
$ npm link ../admin-on-rest
# go back to the checkout, and replace the version of react by the one in your app
$ cd ../admin-on-rest
$ npm link ../myapp/node_modules/react
$ make watch
# in another terminal, go back to your app, and start it as usual
$ cd ../myapp
$ npm run
```

**Tip**: If you're on Windows and can't use `make`, try [this Gist](https://gist.github.com/mantis/bb5d9f7d492f86e94341816321500934).

## License

Admin-on-rest is licensed under the [MIT Licence](https://github.com/marmelab/admin-on-rest/blob/master/LICENSE.md), sponsored and supported by [marmelab](http://marmelab.com).

## Donate

This library is free to use, even for commercial purpose. If you want to give back, please talk about it, [help newcomers](https://stackoverflow.com/questions/tagged/admin-on-rest), or contribute code. But the best way to give back is to **donate to a charity**. We recommend [Doctors Without Borders](http://www.doctorswithoutborders.org/).
