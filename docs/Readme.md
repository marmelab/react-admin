---
layout: default
title: "Documentation"
---
# react-admin

A frontend Framework for building data-driven applications running in the browser, on top of REST/GraphQL APIs, using [React](https://facebook.github.io/react/) and [Material Design](https://material.io/). Open sourced and maintained by [marmelab](https://marmelab.com/).

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://www.youtube.com/watch?v=bJEo1O1oT6o)

Check out [the demos page](./Demos.md) for real-life examples.

## Installation

React-admin is available from npm. You can install it (and its required dependencies)
using:

```sh
npm install react-admin
#or
yarn add react-admin
```

## How To Learn React-Admin

1. Read the [Tutorial](./Tutorial.md) for a 30 minutes introduction.
2. Watch the [YouTube video tutorials](https://www.youtube.com/@react-admin) for quick introductions to the main features.
3. Read the source code of [the demos](./Demos.md) for real-life examples.
4. Read the [Documentation](./Admin.md) for a deep dive into the react-admin components and hooks.
5. Read the [Architecture decisions](./Architecture.md) to better understand why features are implemented that way.
6. Check out the [API Reference](./Reference.md) for a complete list of the public API.
7. Get [Support](#support) for fixing your own problems

## Usage

Here is a simple example of how to use React-admin:

```jsx
// in app.js
import * as React from "react";
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

The `<Resource>` component is a configuration component that allows defining sub components for each of the admin view: `list`, `edit`, and `create`. These components use Material UI and custom components from react-admin:

{% raw %}
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
            <TextInput source="id" InputProps={{ disabled: true }} />
            <TextInput source="title" />
            <TextInput source="teaser" options={{ multiline: true }} />
            <TextInput multiline source="body" />
            <DateInput label="Publication date" source="published_at" />
            <TextInput source="average_note" />
            <TextInput label="Nb views" source="views" InputProps={{ disabled: true }}/>
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
{% endraw %}

## Does It Work With My API?

Yes.

React-admin uses an adapter approach, with a concept called *Data Providers*. Existing providers can be used as a blueprint to design your API, or you can write your own Data Provider to query an existing API. Writing a custom Data Provider is a matter of hours.

![Data Provider architecture](./img/data-provider.png)

See the [Data Providers documentation](./DataProviders.md) for details.

## Architecture: Batteries Included But Removable

React-admin is designed as a library of loosely coupled React components built on top of [Material UI](https://mui.com/material-ui/getting-started/), in addition to React hooks allowing to reuse the logic with a custom UI. 

You may replace one part of react-admin with your own, e.g. to use a custom Datagrid, GraphQL instead of REST, or Bootstrap instead of Material Design.

Read more about the [Architecture choices](./Architecture.md).

## Support

* Get professional support from Marmelab via [React-Admin Enterprise Edition](https://react-admin-ee.marmelab.com)
* Get community support via [StackOverflow](https://stackoverflow.com/questions/tagged/react-admin)

## Enterprise Edition

The [React-Admin Enterprise Edition](https://react-admin-ee.marmelab.com) <img class="icon" src="./img/premium.svg" /> offers additional features and services for react-admin:

- Save weeks of development thanks to the **Private Modules**, valid on an unlimited number of domains and projects.
  - `ra-ai`: Components powered by Artificial Intelligence (AI) to boost user productivity. Suggest completion for user inputs, fix and improve large chunks of text in React-Admin forms.
  - `ra-audit-log`: Track all changes made to your data, and display them in a dedicated view.
  - `ra-calendar`: Display and manipulate events, drag and resize appointments, and browse a calendar in react-admin apps.
  - `ra-datagrid-ag`: Integration with the [ag-Grid](https://www.ag-grid.com/) data grid, for better performance and advanced features (row grouping, aggregation, tree data, pivoting, column resizing, and much more).
  - `ra-editable-datagrid`: Edit data directly in the list view, for better productivity. Excel-like editing experience.
  - `ra-form-layout`: New form layouts for complex data entry tasks (accordion, wizard, etc.)
  - `ra-json-schema-form`: Generate react-admin apps from a JSON Schema.
  - `ra-markdown`: Read Markdown data, and edit it using a WYSIWYG editor in your admin
  - `ra-navigation`: Alternative layouts and menus, breadcrumb, and hooks for applications with a deep navigation tree.
  - `ra-rbac`: Role-based access control for fine-grained permissions.
  - `ra-realtime`: Display live notifications, auto-update content on the screen, lock content when editing, with adapters for real-time backends.
  - `ra-relationships`: Visualize and edit complex relationships, including many-to-many relationships.
  - `ra-search`: Plug your search engine and let users search across all resources via a smart Omnibox.
  - `ra-tour`: Guided tours for react-admin applications. Step-by-step instructions, Material UI skin.
  - `ra-tree`: Edit and visualize tree structures. Reorganize by drag and drop. Adapts to any data structure on the backend (parent_id, children, nested sets, etc.).
- Get **Support** from experienced react and react-admin developers, who will help you find the right information and troubleshoot your bugs.
- Get a **50% Discount on Professional Services** in case you need coaching, audit, or custom development by our experts.
- Get access to exclusive **Learning Material**, including a Storybook full of examples, and a dedicated demo app.
- Prioritize your needs in the react-admin **Development Roadmap** thanks to a priority vote.

[![React-admin enterprise Edition](https://react-admin-ee.marmelab.com/assets/ra-enterprise-demo.png)](https://react-admin-ee.marmelab.com/)

## Carbon Footprint

Working towards digital sustainability is a crucial goal for the react-admin core team (and [a formal commitment](https://marmelab.com/en/values) for our sponsor, Marmelab). We monitor the carbon footprint of example react-admin apps with [GreenFrame](https://greenframe.io) to avoid adding features with a high ecological footprint. This also leads us to add features that reduce this footprint (like application cache or optimistic rendering). As a consequence, react-admin is not only fast but also respectful of the environment. Apps built with react-admin usually emit less carbon than apps built with other frameworks. 

## Contributing

If you want to give a hand: Thank you! There are many things you can do to help making react-admin better. 

The easiest task is **bug triaging**. Check that new issues on GitHub follow the issue template and give a way to reproduce the issue. If not, comment on the issue to ask precisions. Then, try and reproduce the issue following the description. If you managed to reproduce the issue, add a comment to say it. Otherwise, add a comment to say that something is missing. 

The second way to contribute is to **answer support questions on [StackOverflow](https://stackoverflow.com/questions/tagged/react-admin)**. There are many beginner questions there, so even if you're not super experienced with react-admin, there is someone you can help there. 

Pull requests for **bug fixes** are welcome on the [GitHub repository](https://github.com/marmelab/react-admin). There is always a bunch of [issues labeled "Good First Issue"](https://github.com/marmelab/react-admin/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) in the bug tracker - start with these. Check the contributing guidelines in [the repository README](https://github.com/marmelab/react-admin#contributing).

If you want to **add a feature**, you can open a Pull request on the `next` branch. We don't accept all features - we try to keep the react-admin code small and manageable. Try and see if your feature can be built as an additional `npm` package. If you're in doubt, open a "Feature Request" issue to see if the core team would accept your feature before developing it. 

## License

React-admin is licensed under the [MIT Licence](https://github.com/marmelab/react-admin/blob/master/LICENSE.md), sponsored and supported by [marmelab](https://marmelab.com).

## Donate

This library is free to use, even for commercial purpose. If you want to give back, please talk about it, help newcomers, or contribute code. But the best way to give back is to **donate to a charity**. We recommend [Doctors Without Borders](https://www.doctorswithoutborders.org/).
