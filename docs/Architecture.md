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

So react-admin uses the Adapter pattern to let developers plug their backends in. The idea is that react-admin defines an interface to interacts with data, authentication, and internationalization. You must provide an object that satisfies this interface. How that translates to actual HTTP calls is up to you.

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

Other providers are `authProvider`, for managing authorization and permissions, and `i18nProvider`, for managing translations and localization.

## Component Composition

We try to avoid as much as possible having components accepting a huge number of props (we call these "God Components"). Instead, we use composition: complex components accept subcomponents (either via children or via specific props) that handle a large share of the logic.

For instance, you cannot pass a list of actions to the `<Edit>` view, but you can pass an `actions` component:

```jsx
import * as React from "react";
import Button from '@material-ui/core/Button';
import { TopToolbar, ShowButton } from 'react-admin';

const PostEditActions = ({ basePath, data, resource }) => (
    <TopToolbar>
        <ShowButton basePath={basePath} record={data} />
        {/* Add your custom actions */}
        <Button color="primary" onClick={customAction}>Custom Action</Button>
    </TopToolbar>
);

export const PostEdit = (props) => (
    <Edit actions={<PostEditActions />} {...props}>
        ...
    </Edit>
);
```

This allows overriding only part of the logic of a component by composing it with another component.

Many react-admin components can be overridden by passing custom components as children or via props.

The drawback is that react-admin sometimes forces you to override several components just to enable one feature. For instance, to override the Menu, you must pass it to a custom `<Layout>`, and pass the custom `<Layout>` to `<Admin>`:

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

We consider that the drawback is acceptable, especially considering the benefits offered by composition. 

## User Experience Is King

React-admin has two sets of users:

- End users, who use the react-admin app in their browser
- Developers, who build the react-admin app in their IDE

For each feature, we design the User Experience (UX) and the Developer Experience (DX) carefully. 

For the visual part, react-admin builds upon material-ui, which is the implementation of the Material Design System. It's a great help to build usable, consistent user interfaces, but it's not enough. 

We spend a great deal of time refining the UI to make it as intuitive as possible. We pay attention to small alignment glitches, screen flashes, and color inconsistencies. We iterate with every customer feedback, to remove visual and animation problems that occur in real-life applications.

With theme customization, any developer can make an ugly react-admin app, but we do our best to make it not too shabby by default. React-admin produces a user interface that is voluntarily bland by default because we want to emphasize content rather than chrome.

![Sort Button](./img/sort-button.gif)

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

**Tip**: Previous versions of react-admin used the "push, don't pull" approach instead. Some components haven't migrated to the Context architecture yet, or their documentation hasn't been updated yet. That explains why some components expect a certain list of props to be pushed by their parent, like for instance `<ShowButton>`:

```jsx
import { ShowButton } from 'react-admin';

const CommentShowButton = ({ record }) => (
    <ShowButton basePath="/comments" label="Show comment" record={record} />
);
```

This works, but the idiomatic way to do so is by using the appropriate context:  

```jsx
import { ShowButton, userecordContext } from 'react-admin';

const CommentShowButton = () => {
    const record = useRecordContext();
    return (
        <ShowButton basePath="/comments" label="Show comment" record={record} />
    );
};
``` 

## Hooks

React-admin contexts aren't exposed directly. Instead, react-admin exposes hooks to access the context content. In addition, the framework also packages bits of reusable logic as hooks, to facilitate the customization of the UI of existing components without having to rewrite everything. Finally, hooks hide the implementation details of the framework, so that you can focus on the business logic.

So hooks are the primary way to read and change a react-admin application state. We use them in almost every react-admin component, and it's perfectly normal to use react-admin hooks in your own components.  

For instance, the `useRefresh` hook packages the logic to force a redraw of the main page content, and to refetch the dataProvider for all the displayed components. Developers don't need to know how it works, just how to use it:

```jsx
import { useRefresh } from 'react-admin';

const MyRefreshButton = () => {
    const refresh = useRefresh();
    return (
        <Button onClick={refresh}>Refresh</Button>
    );
};
```

## Redux As An Implementation Detail

React-admin uses [Redux](https://react-redux.js.org/) for some of its state management. Redux has performance advantages over pure React contexts. But we don't document the action creators or the Redux state, because we see Redux as an implementation detail. Instead of dispatching actions, react-admin developers use hooks.

Similarly, react-admin supports redux-saga for side effects with Redux. But the sagas registered at startup are only there for backward compatibility reasons, and no new feature use sagas. Instead, we use hooks. 

Previous versions of react-admin used to put a greater emphasis on Redux and redux-saga. It's no longer the case, and we even consider that we could remove Redux completely in the future - if React ever implements Context selectors. 

## Minimal API Surface

Before adding a new hook or a new prop to an existing component, we always check if there isn't a simple way to implement the feature in pure React. If it's the case, then we don't add the new prop. We prefer to keep the react-admin API, code, test, and documentation simple. This choice is crucial to keep the maintenance burden low, and the learning curve acceptable.

For instance, the `<Admin>` component only accepts one `theme` prop. How can you pass two settings, one for the light theme and one for the dark theme? We could turn the `theme` prop into a `lightTheme` prop and add a `darkTheme` prop. This would complicate the usage and documentation for simple use cases. Besides, it's doable in pure React, without any change in the react-admin core:

```jsx
import * as React from 'react';
import { useState, createContext, cloneElement } from 'react';
import { lightTheme, darkTheme } from './themes';

const themes = { light: lightTheme, dark: darkTheme };

export const ThemeContext = createContext(['light', () => {}])

const ThemeContextProvider = ({ value, children }) => {
    const [theme, setTheme] = useState(value);
    return (
        <ThemeContext.Provider value={[theme, setTheme]}>
            {cloneElement(children, { theme: themes[theme] })}
        </ThemeContext.Provider>
    );    
};

const App = () => {
    const [theme, setTheme] = useState('light');
    return (
        <ThemeContextProvider value="light">
            <Admin dataProvider={dataProvider}>
                // ...
            </Admin>
        </ThemeContextProvider>
    );
}
```

That way, a button can set the theme by calling `const [_, setTheme] = useContext(ThemeContext)`.

We consider this snippet simple enough for a React developer, so we decide not to add support for multiple themes in the core.

If you don't find a particular feature in the react-admin documentation, it probably means it's doable in pure React.

## Principle Of Least Documentation

None reads docs. It's an unfortunate fact that we have learned to live with.

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

Every time we implemented child inspection, we regretted it afterward. We tend to avoid it at all costs.

One technique used to avoid child inspection is multiple rendering. For instance, the `<Tab>` component renders either a tab header or the tab content, depending on a `context` prop passed by its ancestor. That way, when `<TabbedShowLayout>` needs to render the tab headers, it renders all its children with `context="header"`. Then, for the active tab, it renders a clone with `context="content"`.

## Monorepo
    
React-admin is a *distribution* of several packages, each of which handles a specific feature. The packages are all located in the `packages/` directory. The most notable packages are:
    
* `ra-core`: The core react-admin logic, without any UI.
* `ra-ui-materialui`: The material-ui skin for react-admin.
* `ra-data-*`: Data providers for various data backends.
* `ra-language-*`: Interface translations for various languages.
* `ra-test`: Utilities for testing react-admin apps and components.
* `react-admin`: the standard distribution of react-admin
    
You can build your own distribution of react-admin by combining different packages.

## Backward Compatibility Is More Important Than New Features

None of us like to update the code of our apps just because an underlying library has published a breaking change. React-admin does its best to avoid losing developers' time.

Some of the components may have a weird API. That's probably for historical reasons. We prefer to keep the backward compatibility as high as possible - sometimes at the cost of API consistency.

The code of some components may seem convoluted for no apparent reason. It's probably that the component has to support both the old and the new syntax.

This backward compatibility costs a lot in maintenance, and we try to reduce this cost by a good automated test coverage.
