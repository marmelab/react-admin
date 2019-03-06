# react-admin [![Build Status](https://travis-ci.org/marmelab/react-admin.svg?branch=master)](https://travis-ci.org/marmelab/react-admin) [![All Contributors](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors)

A frontend Framework for building admin applications running in the browser on top of REST/GraphQL APIs, using ES6, [React](https://facebook.github.io/react/) and [Material Design](https://material.io/). Previously named [admin-on-rest](https://github.com/marmelab/admin-on-rest). Open sourced and maintained by [marmelab](https://marmelab.com/).

[Demo](https://marmelab.com/react-admin-demo/) - [Documentation](https://marmelab.com/react-admin/) - [News](https://marmelab.com/en/blog/#react-admin) - [Releases](https://github.com/marmelab/react-admin/releases) - [Support](http://stackoverflow.com/questions/tagged/react-admin)

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://vimeo.com/268958716)

## Features

* Adapts to any backend (REST, GraphQL, SOAP, etc.)
* Powered by [material-ui](https://material-ui.com/), [redux](https://redux.js.org/), [redux-form](https://redux-form.com/7.3.0/), [redux-saga](https://redux-saga.js.org/), [react-router](https://reacttraining.com/react-router/), [recompose](https://github.com/acdlite/recompose), [reselect](https://github.com/reduxjs/reselect) and a few more
* Super-fast UI thanks to optimistic rendering (renders before the server returns)
* Undo updates and deletes for a few seconds
* Complete documentation
* Relationships (many to one, one to many)
* Data Validation
* Internationalization (i18n)
* Conditional formatting
* Themeable
* Supports any authentication provider (REST API, OAuth, Basic Auth, ...)
* Full-featured Datagrid (sort, pagination, filters)
* Filter-as-you-type
* Supports any form layout (simple, tabbed, etc.)
* Custom actions
* Large library of components for various data types: boolean, number, rich text, etc.
* WYSIWYG editor
* Customize dashboard, menu, layout
* Super easy to extend and override (it's just React components)
* Highly customizable interface
* Can connect to multiple backends
* Can be included in another React app
* Inspired by the popular [ng-admin](https://github.com/marmelab/ng-admin) library (also by marmelab)

## Versions In This Repository

* [master](https://github.com/marmelab/react-admin/commits/master) - commits that will be included in the next _patch_ release

* [next](https://github.com/marmelab/react-admin/commits/next) - commits that will be included in the next _major_ or _minor_ release

Bugfix PRs that don't break BC should be made against **master**. All other PRs (new features, bugfix with BC break) should be made against **next**.

## Installation

React-admin is available from npm. You can install it (and its required dependencies)
using:

```sh
npm install react-admin

#or
yarn add react-admin
```

## Upgrading From Admin-On-Rest

Head to the [Upgrade Guide](https://github.com/marmelab/react-admin/blob/master/UPGRADE.md).

## Documentation

Read the [Tutorial](http://marmelab.com/react-admin/Tutorial.html) for a 15 minutes introduction. After that, head to the [Documentation](http://marmelab.com/react-admin/index.html), or checkout the [source code of the demo](https://github.com/marmelab/react-admin-demo) for an example usage.

## At a Glance

```jsx
// in app.js
import React from 'react';
import { render } from 'react-dom';
import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';

import { PostList, PostEdit, PostCreate, PostIcon } from './posts';

render(
    <Admin dataProvider={restProvider('http://localhost:3000')}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon}/>
    </Admin>,
    document.getElementById('root')
);
```

The `<Resource>` component is a configuration component that allows to define sub components for each of the admin view: `list`, `edit`, and `create`. These components use Material UI and custom components from react-admin:

```jsx
// in posts.js
import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, DisabledInput, TextInput, LongTextInput, DateInput } from 'react-admin';
import BookIcon from '@material-ui/core/svg-icons/action/book';
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

## Does It Work With My API?

Yes.

React-admin uses an adapter approach, with a concept called *Data Providers*. Existing providers can be used as a blueprint to design your API, or you can write your own Data Provider to query an existing API. Writing a custom Data Provider is a matter of hours.

![Data Provider architecture](https://marmelab.com/react-admin/img/data-provider.png)

See the [Data Providers documentation](https://marmelab.com/react-admin/DataProviders.html) for details.

## Batteries Included But Removable

React-admin is designed as a library of loosely coupled React components built on top of [material-ui](http://www.material-ui.com/#/), in addition to controller functions implemented the Redux way. It is very easy to replace one part of react-admin with your own, e.g. to use a custom datagrid, GraphQL instead of REST, or bootstrap instead of Material Design.

## Examples

There are several examples inside the `examples` folder:

* `simple`: a simple application with posts, comments and users that we use for our e2e tests.
* `tutorial`: the application built while following the tutorial.
* `demo`: the official demo application.

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

## Contributing

Pull requests are welcome. You must follow the coding style of the existing files (based on [prettier](https://github.com/prettier/prettier)), and include unit tests and documentation. Be prepared for a thorough code review, and be patient for the merge - this is an open-source initiative.

You can run the tests (linting, unit and functional tests) by calling

```sh
make test
```

or

```sh
yarn test
```

When working on the end to end tests, you can leverage [cypress](https://www.cypress.io/) runner by starting the simple example yourself (`make run-simple`) and starting cypress in another terminal (`make test-e2e-local` or `yarn test-e2e-local`).

If you have coding standards problems, you can fix them automatically using `prettier` by calling

```sh
make prettier
```

or

```sh
yarn prettier
```

If you want to contribute to the documentation, install [jekyll](https://jekyllrb.com/docs/home/), then call

```sh
make doc
```

or

```sh
yarn doc
```

And then browse to [http://localhost:4000/](http://localhost:4000/)

*Note*: if you have added a section with heading to the docs, you also have to add it to `docs/_layouts/default.html` (the links on the left) manually.

If you are using react-admin as a dependency, and if you want to try and hack it, here is the advised process:

```sh
# in myapp
# install react-admin from GitHub in another directory
$ cd ..
$ git clone git@github.com:marmelab/react-admin.git && cd react-admin && make install
# replace your node_modules/react-admin by a symbolic link to the github checkout
$ cd ../myapp
$ npm link ../react-admin/packages/react-admin
# go back to the checkout, and replace the version of react by the one in your app
$ cd ../react-admin
$ npm link ../myapp/node_modules/react
$ make watch
# in another terminal, go back to your app, and start it as usual
$ cd ../myapp
$ npm run
```

**Tip**: If you're on Windows and can't use `make`, try [this Gist](https://gist.github.com/mantis/bb5d9f7d492f86e94341816321500934).

## License

React-admin is licensed under the [MIT License](https://github.com/marmelab/react-admin/blob/master/LICENSE.md), sponsored and supported by [marmelab](http://marmelab.com).

## Donate

This library is free to use, even for commercial purpose. If you want to give back, please talk about it, [help newcomers](https://stackoverflow.com/questions/tagged/react-admin), or contribute code. But the best way to give back is to **donate to a charity**. We recommend [Doctors Without Borders](http://www.doctorswithoutborders.org/).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://marmelab.com/"><img src="https://avatars3.githubusercontent.com/u/99944?v=4" width="100px;" alt="Francois Zaninotto"/><br /><sub><b>Francois Zaninotto</b></sub></a><br /><a href="#financial-fzaninotto" title="Financial">💵</a> <a href="https://github.com/marmelab/react-admin/commits?author=fzaninotto" title="Code">💻</a> <a href="#business-fzaninotto" title="Business development">💼</a> <a href="https://github.com/marmelab/react-admin/commits?author=fzaninotto" title="Documentation">📖</a> <a href="#ideas-fzaninotto" title="Ideas, Planning, & Feedback">🤔</a> <a href="#review-fzaninotto" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://github.com/djhi"><img src="https://avatars2.githubusercontent.com/u/1122076?v=4" width="100px;" alt="Gildas Garcia"/><br /><sub><b>Gildas Garcia</b></sub></a><br /><a href="https://github.com/marmelab/react-admin/commits?author=djhi" title="Code">💻</a> <a href="https://github.com/marmelab/react-admin/issues?q=author%3Adjhi" title="Bug reports">🐛</a> <a href="#blog-djhi" title="Blogposts">📝</a> <a href="#review-djhi" title="Reviewed Pull Requests">👀</a> <a href="#question-djhi" title="Answering Questions">💬</a></td><td align="center"><a href="http://www.jonathan-petitcolas.com"><img src="https://avatars0.githubusercontent.com/u/688373?v=4" width="100px;" alt="Jonathan Petitcolas"/><br /><sub><b>Jonathan Petitcolas</b></sub></a><br /><a href="https://github.com/marmelab/react-admin/commits?author=jpetitcolas" title="Code">💻</a></td><td align="center"><a href="https://www.alexisjanvier.net"><img src="https://avatars0.githubusercontent.com/u/547706?v=4" width="100px;" alt="Alexis Janvier"/><br /><sub><b>Alexis Janvier</b></sub></a><br /><a href="https://github.com/marmelab/react-admin/commits?author=alexisjanvier" title="Code">💻</a></td><td align="center"><a href="https://www.kmaschta.me"><img src="https://avatars2.githubusercontent.com/u/1819833?v=4" width="100px;" alt="Kmaschta"/><br /><sub><b>Kmaschta</b></sub></a><br /><a href="#question-Kmaschta" title="Answering Questions">💬</a> <a href="https://github.com/marmelab/react-admin/issues?q=author%3AKmaschta" title="Bug reports">🐛</a> <a href="https://github.com/marmelab/react-admin/commits?author=Kmaschta" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/ThieryMichel"><img src="https://avatars2.githubusercontent.com/u/4034399?v=4" width="100px;" alt="ThieryMichel"/><br /><sub><b>ThieryMichel</b></sub></a><br /><a href="https://github.com/marmelab/react-admin/commits?author=ThieryMichel" title="Code">💻</a></td><td align="center"><a href="http://www.tkvw.nl"><img src="https://avatars1.githubusercontent.com/u/621098?v=4" width="100px;" alt="Dennie de Lange"/><br /><sub><b>Dennie de Lange</b></sub></a><br /><a href="https://github.com/marmelab/react-admin/commits?author=tkvw" title="Code">💻</a> <a href="https://github.com/marmelab/react-admin/commits?author=tkvw" title="Documentation">📖</a></td></tr><tr><td align="center"><a href="https://github.com/wesley6j"><img src="https://avatars1.githubusercontent.com/u/4378997?v=4" width="100px;" alt="Weijie Jin"/><br /><sub><b>Weijie Jin</b></sub></a><br /><a href="https://github.com/marmelab/react-admin/commits?author=wesley6j" title="Code">💻</a></td><td align="center"><a href="https://twitter.com/Luwangel"><img src="https://avatars3.githubusercontent.com/u/5584839?v=4" width="100px;" alt="Adrien Amoros"/><br /><sub><b>Adrien Amoros</b></sub></a><br /><a href="https://github.com/marmelab/react-admin/commits?author=Luwangel" title="Code">💻</a> <a href="https://github.com/marmelab/react-admin/issues?q=author%3ALuwangel" title="Bug reports">🐛</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
