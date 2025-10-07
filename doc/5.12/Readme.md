---
layout: default
title: "Documentation"
---

# react-admin

React-admin is a frontend framework for building browser-based, data-driven applications on top of REST/GraphQL APIs using [React](https://react.dev). Maintained by [marmelab](https://marmelab.com), it is open source and battle-tested.

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://www.youtube.com/watch?v=bJEo1O1oT6o)

Check out examples of react-admin in action in the [Demos](./Demos.md) section.

## Features

- **Declarative UI**: Define your data views with simple React components.
- **Batteries Included**: Default CRUD screens, filters, data grids, forms, and navigation.
- **Customizable**: Swap out any part of the interface or data interaction.
- **Scalable**: From simple dashboards to complex enterprise applications.
- **Data Providers**: Easily integrate with REST, GraphQL, or custom APIs.
- **UI Agnostic**: React-admin offers an integration with [Material UI](https://mui.com/material-ui/getting-started/) for a polished, consistent look, but you can use any UI library.

## Installation

Install react-admin from npm or yarn:

```sh
npm install react-admin
# or
yarn add react-admin
```

## Usage

Here’s a simple example:

```jsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const root = createRoot(document.getElementById("root"));
root.render(
  <Admin dataProvider={simpleRestProvider("http://localhost:3000")}>
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);
```

This sets up an admin panel for managing "posts", with default CRUD routes:

- `/posts` shows a list view.
- `/posts/:id` allows editing an existing post.

React-admin will fetch data from `http://localhost:3000/posts`, and generate the UI based on the data structure. From there on, you can customize the UI and add more resources.

For more examples, check out the [Tutorial](./Tutorial.md).

## Learning React-Admin

1. **[Tutorial](./Tutorial.md)**: A 30-minute intro.
2. **[YouTube Tutorials](https://www.youtube.com/@react-admin)**: Short videos on key features.
3. **[Documentation](./Admin.md)**: In-depth guide to components and hooks.
4. **[Demos](./Demos.md)**: Explore real-life usage examples.
5. **[API Reference](./Reference.md)**: Complete list of available APIs.

## API Integration

Does it work with your API? Yes. 

React-admin uses a *Data Provider* approach to connect to API backends. There are [more than 50 ready-made providers](./DataProviderList.md) for REST, GraphQL, and more, and you can [write your own custom provider](./DataProviderWriting.md) if needed.

See the [Data Providers Documentation](./DataProviders.md) for more details.

![Data Provider architecture](./img/data-provider.png)

## Built for Flexibility

React-admin is modular. Replace any part you like: use a different data grid, integrate GraphQL instead of REST, or apply a custom theme. It's flexible to adapt to your needs.

Learn more about [Architecture Choices](./Architecture.md).

## Enterprise Edition

[React-admin Enterprise Edition](https://react-admin-ee.marmelab.com/) offers additional premium features:

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

## Support

* Get professional support from Marmelab via [React-Admin Enterprise Edition](https://react-admin-ee.marmelab.com)
* Get community support via [Discord](https://discord.gg/GeZF9sqh3N) and [StackOverflow](https://stackoverflow.com/questions/tagged/react-admin)



## Sustainability

We monitor react-admin's carbon footprint using [GreenFrame](https://greenframe.io) and strive to keep it minimal. React-admin apps are optimized for efficiency and sustainability.

## License

React-admin is licensed under the [MIT License](https://github.com/marmelab/react-admin/blob/master/LICENSE.md), sponsored by [marmelab](https://marmelab.com).