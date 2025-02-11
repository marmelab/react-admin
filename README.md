# react-admin [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmarmelab%2Freact-admin.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmarmelab%2Freact-admin?ref=badge_shield) [![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

A frontend Framework for building single-page applications running in the browser on top of REST/GraphQL APIs, using TypeScript, [React](https://facebook.github.io/react/) and [Material Design](https://material.io/). Open sourced and maintained by [marmelab](https://marmelab.com/).

[Home page](https://marmelab.com/react-admin/) - [Documentation](https://marmelab.com/react-admin/documentation.html) - [Examples](#examples) - [Blog](https://marmelab.com/en/blog/#react-admin) - [Releases](https://github.com/marmelab/react-admin/releases) - [Support](#support)

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
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
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

![Data provider architecture](https://marmelab.com/react-admin/img/data-provider.png)

See the [Data Providers documentation](https://marmelab.com/react-admin/DataProviders.html) for details.

## Batteries Included But Removable

React-admin is designed as a library of loosely coupled React components and hooks exposing reusable controller logic. It is very easy to replace any part of react-admin with your own, e.g. using a custom datagrid, GraphQL instead of REST, or Bootstrap instead of Material Design.

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

## Versions In This Repository

* [master](https://github.com/marmelab/react-admin/commits/master) - commits that will be included in the next _patch_ release

* [next](https://github.com/marmelab/react-admin/commits/next) - commits that will be included in the next _major_ or _minor_ release

Bugfix PRs that don't break BC should be made against **master**. All other PRs (new features, BC breaking bugfixes) should be made against **next**.

## Contributing

If you want to give a hand: Thank you! There are many things you can do to help making react-admin better. 

The easiest task is **bug triaging**. Check that new issues on GitHub follow the issue template and give a way to reproduce the issue. If not, comment on the issue to ask precisions. Then, try and reproduce the issue following the description. If you managed to reproduce the issue, add a comment to say it. Otherwise, add a comment to say that something is missing. 

The second way to contribute is to **answer support questions on [StackOverflow](https://stackoverflow.com/questions/tagged/react-admin)**. There are many beginner questions there, so even if you're not super experienced with react-admin, there is someone you can help there. 

Pull requests for **bug fixes** are welcome on the [GitHub repository](https://github.com/marmelab/react-admin). There is always a bunch of [issues labeled "Good First Issue"](https://github.com/marmelab/react-admin/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) in the bug tracker—start with these. 

If you want to **add a feature**, you can open a Pull request on the `next` branch. We don't accept all features—we try to keep the react-admin code small and manageable. Try and see if your feature can't be built as an additional `npm` package. If you're in doubt, open a "Feature Request" issue to see if the core team would accept your feature before developing it.

For all Pull requests, you must follow the coding style of the existing files (based on [prettier](https://github.com/prettier/prettier)), and include unit tests and documentation. Be prepared for a thorough code review, and be patient for the merge—this is an open-source initiative.

**Tip**: Most of the commands used by the react-admin developers are automated in the `makefile`. Feel free to type `make` without argument to see a list of the available commands. 

### Setup

Clone this repository and run `make install` to grab the dependencies, then `make build` to compile the sources from TypeScript to JS.

### Testing Your Changes In The Example Apps

When developing, most of the time we use the **simple example** to do visual check. It's the same application that we use in Stackblitz to reproduce errors (see https://stackblitz.com/github/marmelab/react-admin/tree/master/examples/simple). The source is located under `examples/simple/`. Call `make run` to launch that example on port 8080 (http://localhost:8080). This command includes a `watch` on the react-admin source, so any of the changes you make to the react-admin packages triggers a live update of the simple example in your browser. 

However, the simple example is sometimes too limited. You can use the **demo example** (the source for https://marmelab.com/react-admin-demo/), which is more complete. The source is located under `examples/demo/`. Call `make run-demo` to launch the demo example with a REST dataProvider, or `make run-graphql-demo` to run it with a GraphQL dataProvider. Unfortunately, due to the fact that we use Create React App for this demo, these commands don't watch the changes made in the packages. You'll have to rebuild the react-admin packages after a change (using `make build`, or the more targeted `make build-ra-core`, `make build-ra-ui-materialui`, etc.) to see the effect in the demo app.

Both of these examples work without server—the API is simulated on the client-side. 

### Testing Your Changes In Your App

Using `yarn link`, you can have your project use a local checkout of the react-admin package instead of downloading from npm. This allows you to test react-admin changes in your app.

The following instructions are targeting yarn >= v3 in the client app.

```sh
# Go to the folder of your client app
$ cd /code/path/to/myapp/

# Use the latest version of yarn package manager
$ corepack enable && yarn set version stable

# Replace the npm-installed version with a symlink to your local version 
$ yarn link /code/path/to/react-admin/packages/react-admin

# If you modified additional internal packages in the react-admin monorepo, e.g. ra-core, also make a link
$ yarn link /code/path/to/react-admin/packages/ra-core

# Build all of the react-admin package distribution
$ cd /code/path/to/react-admin/ && make build

# Return to your app and ensure all dependencies have resolved 
$ cd /code/path/to/myapp/ && yarn install

# Start your app
$ yarn start
```

Tip: If you are still using yarn v1 as your package manager in your client app, we strongly recommend you to update as it is frozen and no longer maintained.

### Automated Tests

Automated tests are also crucial in our development process. You can run all the tests (linting, unit and functional tests) by calling:

```sh
make test
```

Unit tests use `jest`, so you should be able to run a subset of tests, or run tests continuously on change, by passing options to 

```sh
yarn jest
```

Besides, tests related to the modified files are run automatically at commit using a git pre-commit hook. This means you won't be able to commit your changes if they break the tests. 

When working on the end-to-end tests, you can leverage [cypress](https://www.cypress.io/) runner by starting the simple example yourself (`make run-simple` or `yarn run-simple`) and starting cypress in another terminal (`make test-e2e-local` or `yarn test-e2e-local`).

### Coding Standards

If you have coding standards problems, you can fix them automatically using `prettier` by calling

```sh
make prettier
```

However, these commands are run automatically at each commit so you shouldn't have to worry about them.

### Documentation

If you want to contribute to the documentation, install [jekyll](https://jekyllrb.com/docs/home/), then call

```sh
make doc
```

And then browse to [http://localhost:4000/](http://localhost:4000/)

## License

React-admin is licensed under the [MIT License](https://github.com/marmelab/react-admin/blob/master/LICENSE.md), sponsored and supported by [marmelab](https://marmelab.com). It is free to use, even for commercial purpose. 

If you want to give back, please talk about it, [help newcomers](https://stackoverflow.com/questions/tagged/react-admin), [subscribe to the Enterprise Edition](https://react-admin-ee.marmelab.com/), or contribute code.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmarmelab%2Freact-admin.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmarmelab%2Freact-admin?ref=badge_large)
