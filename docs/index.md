---
layout: default
title: "Documentation"
---
# react-admin

A frontend Framework for building admin applications running in the browser on top of REST/GraphQL APIs, using ES6, [React](https://facebook.github.io/react/) and [Material Design](https://material.io/). Previously named [admin-on-rest](https://github.com/marmelab/admin-on-rest). Open sourced and maintained by [marmelab](https://marmelab.com/).

<div style="text-align: center" markdown="1">
<i class="octicon octicon-device-desktop"></i> [Demo](https://marmelab.com/react-admin-demo/) -
<i class="octicon octicon-mark-github"></i> [Source](https://github.com/marmelab/react-admin) -
<i class="octicon octicon-megaphone"></i> [News](https://marmelab.com/en/blog/#react-admin) -
<i class="octicon octicon-clock"></i> [Releases](https://github.com/marmelab/react-admin/releases) -
<i class="octicon octicon-comment-discussion"></i> [Support](http://stackoverflow.com/questions/tagged/react-admin)
</div>

<iframe src="https://player.vimeo.com/video/268958716?byline=0&portrait=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="display:block;margin:0 auto"></iframe>

## Features

* Adapts to any backend (REST, GraphQL, SOAP, etc.)
* Complete documentation
* Super-fast UI thanks to optimistic rendering (renders before the server returns)
* Undo updates and deletes for a few seconds
* Supports relationships (many to one, one to many)
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

## Installation

React-admin is available from npm. You can install it (and its required dependencies)
using:

```sh
npm install react-admin
```

## Usage

Read the [Tutorial](./Tutorial.md) for a 60 minutes introduction. After that, head to the [Documentation](./index.md), or checkout the [source code of the demo](https://github.com/marmelab/react-admin/tree/master/examples/demo) for an example usage.

## At a Glance

```jsx
// in app.js
import React from 'react';
import { render } from 'react-dom';
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import { PostList, PostEdit, PostCreate, PostIcon } from './posts';

render(
    <Admin dataProvider={simpleRestProvider('http://localhost:3000')}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon}/>
    </Admin>,
    document.getElementById('root')
);
```

The `<Resource>` component is a configuration component that allows to define sub components for each of the admin view: `list`, `edit`, and `create`. These components use Material UI and custom components from react-admin:

{% raw %}
```jsx
// in posts.js
import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, DisabledInput, TextInput, LongTextInput, DateInput } from 'react-admin';
import BookIcon from '@material-ui/icons/Book';
export const PostIcon = BookIcon;

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
{% endraw %}

## Does It Work With My API?

Yes.

React-admin uses an adapter approach, with a concept called *Data Providers*. Existing providers can be used as a blueprint to design your API, or you can write your own Data Provider to query an existing API. Writing a custom Data Provider is a matter of hours.

![Data Provider architecture](./img/data-provider.png)

See the [Data Providers documentation](./DataProviders.md) for details.

## Batteries Included But Removable

React-admin is designed as a library of loosely coupled React components built on top of [material-ui](http://www.material-ui.com/#/), in addition to controller functions implemented the Redux way. It is very easy to replace one part of react-admin with your own, e.g. to use a custom datagrid, GraphQL instead of REST, or bootstrap instead of Material Design.

## Contributing

Pull requests are welcome on the [GitHub repository](https://github.com/marmelab/react-admin). Try to follow the coding style of the existing files, and include unit tests and documentation. Be prepared for a thorough code review, and be patient for the merge - this is an open-source initiative.

You can run the example app by calling:

```sh
make run
```

And then browse to [http://localhost:8080/](http://localhost:8080/).

If you want to contribute to the documentation, install jekyll, then call

```sh
make doc
```

And then browse to [http://localhost:4000/](http://localhost:4000/)

You can run the unit tests by calling

```sh
make test
```

If you are using react-admin as a dependency, and if you want to try and hack it, here is the advised process:

```sh
# in myapp
# install react-admin from GitHub in another directory
$ cd ..
$ git clone git@github.com:marmelab/react-admin.git && cd react-admin && make install
# replace your node_modules/react-admin by a symbolic link to the github checkout
$ cd ../myapp
$ npm link ../react-admin
# go back to the checkout, and replace the version of react by the one in your app
$ cd ../react-admin
$ npm link ../myapp/node_modules/react
$ make watch
# in another terminal, go back to your app, and start it as usual
$ cd ../myapp
$ npm run
```

## License

React-admin is licensed under the [MIT Licence](https://github.com/marmelab/react-admin/blob/master/LICENSE.md), sponsored and supported by [marmelab](http://marmelab.com).

## Donate

This library is free to use, even for commercial purpose. If you want to give back, please talk about it, help newcomers, or contribute code. But the best way to give back is to **donate to a charity**. We recommend [Doctors Without Borders](http://www.doctorswithoutborders.org/).
