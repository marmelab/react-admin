---
layout: default
title: "Architecture"
---

# Architecture

React-admin relies on a few design decisions that structure its codebase.

## Model View Controller

React-admin loosely implements [the Model-View-Controller pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) for page components, and for complex components. 

- The Controller logic is provided by React hooks (e.g. `useListController`).
- The view logic by React components (e.g. `<List>`).
- The model logic is up to the developer, and react-admin only forces the interface that the model must expose via its Providers.

## Providers

React-admin apps must integrate with existing backends, but there isn't any standard way to do so (or rather, there are too many standards to do so, e.g. REST, GraphQL, SOAP for data access).

So react-admin uses the Adapter pattern to let developers plug their backends in. The idea is that react-admin defines an interface to interact with data, authentication, internationalization, and preferences storage. Developers must provide objects that satisfy these interfaces. How that translates to actual calls to an API is up to the developers.

For instance, the interface for reading, editing and deleting data is the `dataProvider` interface: 

```jsx
const dataProvider = {
    getList:    (resource, params) => Promise,
    getOne:     (resource, params) => Promise,
    getMany:    (resource, params) => Promise,
    getManyReference: (resource, params) => Promise,
    create:     (resource, params) => Promise,
    update:     (resource, params) => Promise,
    updateMany: (resource, params) => Promise,
    delete:     (resource, params) => Promise,
    deleteMany: (resource, params) => Promise,
}
```

Other providers are `authProvider`, for managing authorization and permissions, `i18nProvider`, for managing translations and localization, and `store`, for storing user choices.

## Component Composition

React-admin tries to avoid as much as possible having components accepting a huge number of props (we call these "God Components"). Instead, react-admin encourages composition: complex components accept subcomponents (either via children or via specific props) that handle a large share of the logic.

For instance, you cannot pass a list of actions to the `<Edit>` view, but you can pass an `actions` component:

```jsx
import * as React from "react";
import { Button } from '@mui/material';
import { TopToolbar, ShowButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <ShowButton />
        {/* Add your custom actions */}
        <Button color="primary" onClick={customAction}>Custom Action</Button>
    </TopToolbar>
);

export const PostEdit = () => (
    <Edit actions={<PostEditActions />}>
        ...
    </Edit>
);
```

This allows overriding parts of the logic of a component by composing it with another component.

Many react-admin components can be overridden by passing custom components as children or via props.

The drawback is that react-admin sometimes forces you to override several components just to enable one feature. For instance, to override the Menu, you must pass a custom Menu component to a custom `<Layout>`, and pass the custom `<Layout>` to `<Admin>`:

```jsx
// in src/Layout.js
import { Layout } from 'react-admin';
import { Menu } from './Menu';

export const Layout = (props) => <Layout {...props} menu={Menu} />;

// in src/App.js
import { Layout }  from './Layout';

const App = () => (
    <Admin layout={Layout} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

We consider that this drawback is acceptable, especially considering the benefits offered by composition. 

## User Experience Is King

React-admin has two sets of users:

- End users, who use the react-admin app in their browser
- Developers, who build the react-admin app in their IDE

For each feature, we design the User Experience (UX) and the Developer Experience (DX) carefully. 

For the visual part, react-admin builds upon Material UI, which is the implementation of the Material Design System. It's a great help to build usable, consistent user interfaces, but it's not enough. 

We spend a great deal of time refining the UI to make it as intuitive as possible. We pay attention to small alignment glitches, screen flashes, and color inconsistencies. We iterate with every customer feedback, to remove visual and animation problems that occur in real-life applications.

React-admin produces a user interface that is voluntarily bland by default because we want to emphasize content rather than chrome.

<video controls autoplay playsinline muted loop>
  <source src="./img/sort-button.webm" type="video/webm"/>
  <source src="./img/sort-button.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


As for the developer experience, react-admin is constantly evolving to find the sweet spot between an intuitive API, power user features, not too much magic, and just enough documentation. The core team are the first testers of react-admin, and pay attention to the productivity, debuggability, discoverability, performance, and robustness of all the hooks and components.

## Built On The Shoulders Of Giants

Many excellent open-source libraries already address partial requirements of B2B apps: data fetching, forms, UI components, testing, etc.

Rather than reinventing the wheel, react-admin uses the best tools in each category (in terms of features, developer experience, active maintenance, documentation, user base), and provides a glue around these libraries.

In react-admin v4, these libraries are called react-query, react-router, react-hook-form, Material UI, testing-library, date-fns, and lodash.

When a new requirement arises, the react-admin teams always looks for an existing solution, and prefers integrating it rather than redeveloping it.

There is one constraint, though: all react-admin's dependencies must be compatible with the MIT licence. 

## Context: Pull, Don't Push

React-admin makes heavy use of React contexts. Whenever a component creates data or callbacks, it makes them available to descendants via a context.

So when a component needs to access data or callbacks defined higher in the render tree, it can always find the context to get it. 

For instance, to write a custom Field type for your Datagrid, use the `useRecordContext` hook to grab the current record value:

```jsx
import * as React from "react";
import PropTypes from 'prop-types';
import { useRecordContext } from 'react-admin';

const TextField = (props) => {
    const { source } = props;
    const record = useRecordContext(props);
    return <span>{record[source]}</span>;
}

TextField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

export default TextField;
```

## Hooks

React-admin contexts aren't exposed directly. Instead, react-admin exposes hooks to access the context content. In addition, the framework also packages bits of reusable logic as hooks, to facilitate the customization of the UI of existing components without having to rewrite everything. Finally, hooks hide the implementation details of the framework, so that you can focus on the business logic.

So hooks are the primary way to read and change a react-admin application state. We use them in almost every react-admin component, and it's perfectly normal to use react-admin hooks in your own components.  

For instance, the `useRefresh` hook packages the logic to refetch the data currently displayed on the screen. Developers don't need to know how it works, just how to use it:

```jsx
import { useRefresh } from 'react-admin';

const MyRefreshButton = () => {
    const refresh = useRefresh();
    return (
        <Button onClick={refresh}>Refresh</Button>
    );
};
```

## Minimal API Surface

Before adding a new hook or a new prop to an existing component, we always check if there isn't a simple way to implement the feature in pure React. If it's the case, then we don't add the new prop. We prefer to keep the react-admin API, code, test, and documentation simple. This choice is crucial to keep the learning curve acceptable, and maintenance burden low.

For instance, the `<SimpleShowLayout>` component displays Field elements in a column. How can you put two fields in a single column? We could add a specific syntax allowing to specify the number of elements per column and per line. This would complicate the usage and documentation for simple use cases. Besides, it's doable in pure React, without any change in the react-admin core, e.g. by leveraging Material UI's `<Stack>` component:

```jsx
import * as React from 'react';
import { Show, SimpleShowLayout, TextField } from 'react-admin';
import { Stack } from '@mui/material';

const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <Stack direction="row" spacing={2}>
                <TextField source="title" />
                <TextField source="body" />
            </Stack>
            <TextField source="author" />
        </SimpleShowLayout>
    </Show>
);
```

We consider this snippet simple enough for a React developer, so we decided not to add support for multiple elements per line in the core.

If you don't find a particular feature in the react-admin documentation, it can mean it's doable quickly in pure React.

## Principle Of Least Documentation

No one reads docs. It's an unfortunate fact that we have learned to live with.

So when we design a new feature, we try to do it in the most intuitive way for developers. We keep the API minimal (see above). We copy the API of well-known libraries. We throw errors with helpful and explicit messages. We provide TypeScript types and JSDoc to help developers discover the API from within their IDE. We publish live examples with commented code.

When we have to write documentation, it should contain:

1. images/screencasts
2. code samples
3. text

In that order of importance.

## Inspecting Children Is Bad

Some components use child inspection for some features. For instance, the `<Datagrid>` inspects its Field children at runtime to determine the column headers. This has serious drawbacks:

- If the child is wrapped inside another component that doesn't use the same API, the feature breaks
- Developers expect that a component affects its subtree, not its ancestors. This leads to inexplicable bugs.

Every time we implemented child inspection, we regretted it afterward. We tend to avoid it at all costs, as well as using `React.cloneElement()`.

## Monorepo
    
React-admin is a *distribution* of several packages, each of which handles a specific feature. The packages are all located in the `packages/` directory. The most notable packages are:
    
* `ra-core`: The core react-admin logic, without any UI.
* `ra-ui-materialui`: The Material UI skin for react-admin.
* `ra-data-*`: Data providers for various data backends.
* `ra-language-*`: Interface translations for various languages.
* `react-admin`: the standard distribution of react-admin
    
You can build your own distribution of react-admin by combining different packages.

## Backward Compatibility Is More Important Than New Features

None of us like to update the code of our apps just because an underlying library has published a breaking change. React-admin does its best to avoid losing developers' time.

Some components may have a weird API. That's probably for historical reasons. We prefer to keep the backward compatibility as high as possible - sometimes at the cost of API consistency.

The code of some components may seem convoluted for no apparent reason. It's probably that the component has to support both the old and the new syntax.

This backward compatibility costs a lot in maintenance, and we try to reduce this cost by a good automated test coverage.
