# react-admin

A frontend Framework for building single-page applications running in the browser on top of REST/GraphQL APIs, using TypeScript, [React](https://facebook.github.io/react/) and [Material Design](https://material.io/). Open sourced and maintained by [marmelab](https://marmelab.com/).

[Home page](https://marmelab.com/react-admin/) - [Documentation](https://marmelab.com/react-admin/documentation.html) - [Demos](https://marmelab.com/react-admin/Demos.html) - [Blog](https://marmelab.com/en/blog/#react-admin) - [Releases](https://github.com/marmelab/react-admin/releases) - [Support](https://discord.gg/GeZF9sqh3N)

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://www.youtube.com/watch?v=bJEo1O1oT6o)

## Features

* 🔌 **Backend Agnostic**: Connects to any API (REST or GraphQL, see the [list of more than 45 adapters](https://marmelab.com/react-admin/DataProviderList.html))

* 🧩 **All The Building Blocks You Need**: Provides hooks and components for authentication, routing, forms & validation, datagrid, search & filter, relationships, validation, roles & permissions, rich text editor, i18n, notifications, menus, theming, caching, etc.

* 🪡 **High Quality**: Accessibility, responsive, secure, fast, testable

* 💻 **Great Developer Experience**: Complete documentation, IDE autocompletion, type safety, storybook, demo apps with source code, modular architecture, declarative API

* 👑 **Great User Experience**: Optimistic rendering, filter-as-you-type, undo, preferences, saved queries

* 🛠 **Complete Customization**: Replace any component with your own

* ☂️ **Opt-In Types**: Develop either in TypeScript or JavaScript

* 👨‍👩‍👧‍👦 Powered by [Material UI](https://mui.com/material-ui/getting-started/), [react-hook-form](https://react-hook-form.com), [react-router](https://reacttraining.com/react-router/), [react-query](https://tanstack.com/query/latest/docs/framework/react/overview), [TypeScript](https://www.typescriptlang.org/) and a few more

## Installation

React-admin is available from npm. You can install it (and its required dependencies)
using:

```sh
npm install react-admin
#or
yarn add react-admin
```

## Documentation

* Read the [Tutorial](https://marmelab.com/react-admin/Tutorial.html) for a 30 minutes introduction
* Watch the [YouTube video tutorials](https://www.youtube.com/@react-admin)
* Head to the [Documentation](https://marmelab.com/react-admin/documentation.html) for a complete API reference
* Checkout the source code of the examples ([e-commerce](https://github.com/marmelab/react-admin/tree/master/examples/demo), [CRM](https://github.com/marmelab/react-admin/tree/master/examples/crm), [blog](https://github.com/marmelab/react-admin/tree/master/examples/simple), [media player](https://github.com/navidrome/navidrome/tree/master/ui))

## At a Glance

```jsx
// in app.js
import * as React from "react";
import ReactDOM from 'react-dom';
import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';

import { PostList, PostEdit, PostCreate, PostIcon } from './posts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Admin dataProvider={restProvider('http://localhost:3000')}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
    </Admin>
);
```

The `<Resource>` component defines CRUD pages (`list`, `edit`, and `create`) for an API endpoint (`/posts`). The page components use react-admin components to fetch and render data:

```jsx
// in posts.js
import * as React from "react";
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, TextInput, DateInput, useRecordContext } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';
export const PostIcon = BookIcon;

export const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <TextField source="average_note" />
            <TextField source="views" />
            <EditButton />
        </Datagrid>
    </List>
);

const PostTitle = () => {
    const record = useRecordContext();
    return <span>Post { record ? `"${record.title}"` : '' }</span>;
};

export const PostEdit = () => (
    <Edit title={<PostTitle />}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="title" />
            <TextInput source="teaser" options={{ multiline: true }} />
            <TextInput multiline source="body" />
            <DateInput label="Publication date" source="published_at" />
            <TextInput source="average_note" />
            <TextInput disabled label="Nb views" source="views" />
        </SimpleForm>
    </Edit>
);

export const PostCreate = () => (
    <Create title="Create a Post">
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="teaser" options={{ multiline: true }} />
            <TextInput multiline source="body" />
            <TextInput label="Publication date" source="published_at" />
            <TextInput source="average_note" />
        </SimpleForm>
    </Create>
);
```

## Does It Work With My API?

Yes.

React-admin uses an adapter approach, with a concept called *Data Providers*. Existing providers can be used as a blueprint to design your API, or you can write your own Data Provider to query an existing API. Writing a custom Data Provider is a matter of hours.

![Data Provider architecture](https://marmelab.com/react-admin/img/data-provider.png)

See the [Data Providers documentation](https://marmelab.com/react-admin/DataProviders.html) for details.

## Batteries Included But Removable

React-admin is designed as a library of loosely coupled React components built on top of [Material UI](https://mui.com/material-ui/getting-started/), in addition to custom react hooks exposing reusable controller logic. It is very easy to replace one part of react-admin with your own, e.g. to use a custom datagrid, GraphQL instead of REST, or Bootstrap instead of Material Design.

## Examples

There are several examples inside the `examples` folder:

* `simple` ([StackBlitz](https://stackblitz.com/github/marmelab/react-admin/tree/master/examples/simple?file=src%2Findex.tsx)): a simple blog with posts, comments and users that we use for our e2e tests.
* `e-commerce`: ([demo](https://marmelab.com/react-admin-demo/), [source](https://github.com/marmelab/react-admin/tree/master/examples/demo)) A fictional poster shop admin, serving as the official react-admin demo.
* `CRM`: ([demo](https://marmelab.com/react-admin-crm/), [source](https://github.com/marmelab/react-admin/tree/master/examples/crm)) A customer relationship management application
* `helpdesk`: ([demo](https://marmelab.com/react-admin-helpdesk/), [source](https://github.com/marmelab/react-admin-helpdesk)) A ticketing application with realtime locks and notifications
* `tutorial` ([Stackblitz](https://stackblitz.com/github/marmelab/react-admin/tree/master/examples/tutorial)): the application built while following the [tutorial](https://marmelab.com/react-admin/Tutorial.html).

You can run those example applications by calling:

```sh
# At the react-admin project root
make install
# or
yarn install

# Run the simple application
make run-simple

# Run the tutorial application
make build
make run-tutorial

# Run the demo application
make build
make run-demo
```

And then browse to the URL displayed in your console.

## Support

- Get commercial support from Marmelab via [React-Admin Enterprise Edition](https://react-admin-ee.marmelab.com#support)
- Get community support via [Discord](https://discord.gg/GeZF9sqh3N) and [StackOverflow](https://stackoverflow.com/questions/tagged/react-admin). 

## License

React-admin is licensed under the [MIT License](https://github.com/marmelab/react-admin/blob/master/LICENSE.md), sponsored and supported by [marmelab](https://marmelab.com). It is free to use, even for commercial purpose. 

If you want to give back, please talk about it, [help newcomers](https://stackoverflow.com/questions/tagged/react-admin), [subscribe to the Enterprise Edition](https://react-admin-ee.marmelab.com/), or contribute code.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmarmelab%2Freact-admin.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmarmelab%2Freact-admin?ref=badge_large)