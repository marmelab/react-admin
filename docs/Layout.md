---
layout: default
title: "The Layout Component"
---

# `<Layout>`

The default react-admin layout renders a horizontal app bar at the top, a navigation menu on the side, and the main content in the center.

![standard layout](./img/layout-component.webp)

React-admin lets you override the app layout using [the `<Admin layout>` prop](./Admin.md#layout). You can use any component you want as layout ; but if you just need to tweak the default layout, you can use the `<Layout>` component.

## Usage

Create a custom layout overriding some of the components of the default layout:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';
import { MySidebar } from './MySidebar';

export const MyLayout = props => <Layout {...props} appBar={MyAppBar} sidebar={MySidebar} />;
```

Then pass this custom layout to the `<Admin>` component:

Instead of the default layout, you can use your own component as the admin layout. Just use the layout prop of the <Admin> component:

```jsx
// in src/App.js
import { MyLayout } from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={...}>
        // ...
    </Admin>
);
```

## Props

| Prop        | Required | Type        | Default  | Description                                                           |
| ----------- | -------- | ----------- | -------- | --------------------------------------------------------------------- |
| `appBar`    | Optional | `Component` | -        | A React component rendered at the top of the layout                   |
| `className` | Optional | `string`    | -        | Passed to the root `<div>` component                                  |
| `error`     | Optional | `Component` | -        | A React component rendered in the content area in case of error       |
| `sidebar`   | Optional | `Component` | -        | A React component rendered at the side of the screen                  |
| `sx`        | Optional | `SxProps`   | -        | Style overrides, powered by MUI System                                |

`<Layout>` accepts 4 more props, but react-admin sets them at runtime based on the `<Admin>` props:

* `dashboard`: The dashboard component. Used to enable the dahboard link in the menu
* `menu`: A React component rendered as the sidebar content
* `title`: The default page tile, enreder in the AppBar
* `children`: The main content of the page

Any value set for these props in a custom layout will be ignored.

## `appBar`

Lets you override the top App Bar.

```jsx
// in src/MyLayout.js
import * as React from 'react';
import { Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';

export const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;
```

You can use react-admin's `<AppBar>` as a base for your custom app bar, or the component of your choice. 

By default, react-admin's `<AppBar>` displays the page title. You can override this default by passing children to `<AppBar>` - they will replace the default title. And if you still want to include the page title, make sure you include an element with id `react-admin-title` in the top bar (this uses [React Portals](https://reactjs.org/docs/portals.html)).

Here is a custom app bar component extending `<AppBar>` to include a company logo in the center of the page header:

{% raw %}
```jsx
// in src/MyAppBar.js
import * as React from 'react';
import { AppBar } from 'react-admin';
import Typography from '@mui/material/Typography';

import Logo from './Logo';

export const MyAppBar = (props) => (
    <AppBar
        sx={{
            "& .RaAppBar-title": {
                flex: 1,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
            },
        }}
        {...props}
    >
        <Typography
            variant="h6"
            color="inherit"
            className={classes.title}
            id="react-admin-title"
        />
        <Logo />
        <span className={classes.spacer} />
    </AppBar>
);
```
{% endraw %}

![custom AppBar](./img/custom_appbar.png)

**Tip**: You can change the color of the `<AppBar>` by setting the `color` prop to `default`, `inherit`, `primary`, `secondary` or `transparent`. The default value is `secondary`.

When react-admin renders the App BAr, it passes two props:

* `open`: a boolean indicating if the sidebar is open or not
* `title`: the page title (if set by the `<Admin>` component)

Your custom AppBar component is free to use these props. 

## `className`

`className` is passed to the root `<div>` component. It lets you style the layout with CSS - but the `sx` prop is preferred.

## `error`

Whenever a client-side error happens in react-admin, the user sees an error page. React-admin uses [React's Error Boundaries](https://reactjs.org/docs/error-boundaries.html) to render this page when any component in the page throws an unrecoverable error. 

![Default error page](./img/error.webp)

If you want to customize this page, or log the error to a third-party service, create your own `<Error>` component, and pass it to a custom Layout, as follows:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';

import { MyError } from './MyError';

export const MyLayout = (props) => <Layout {...props} error={MyError} />;
```

The following snippet is a simplified version of the react-admin `Error` component, that you can use as a base for your own:

```jsx
// in src/MyError.js
import * as React from 'react';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Report';
import History from '@mui/icons-material/History';
import { Title, useTranslate } from 'react-admin';
import { useLocation } from 'react-router';

export const MyError = ({
    error,
    resetErrorBoundary,
    ...rest
}) => {
    const { pathname } = useLocation();
    const originalPathname = useRef(pathname);

    // Effect that resets the error state whenever the location changes
    useEffect(() => {
        if (pathname !== originalPathname.current) {
            resetErrorBoundary();
        }
    }, [pathname, resetErrorBoundary]);

    const translate = useTranslate();
    return (
        <div>
            <Title title="Error" />
            <h1><ErrorIcon /> Something Went Wrong </h1>
            <div>A client error occurred and your request couldn't be completed.</div>
            {process.env.NODE_ENV !== 'production' && (
                <details>
                    <h2>{translate(error.toString())}</h2>
                    {errorInfo.componentStack}
                </details>
            )}
            <div>
                <Button
                    variant="contained"
                    startIcon={<History />}
                    onClick={() => history.go(-1)}
                >
                    Back
                </Button>
            </div>
        </div>
    );
};
```

## `sidebar`

Lets you override the sidebar.


```jsx
// in src/MyLayout.js
import * as React from 'react';
import { Layout } from 'react-admin';

import { MySidebar } from './MySidebar';

const MyLayout = (props) => <Layout {...props} sidebar={MySidebar} />;

export default MyLayout;
```

## `sx`: CSS API

Pass an `sx` prop to customize the style of the main component and the underlying elements.

{% raw %}
```jsx
export const MyLayout = (props) => (
    <Layout sx={{ '& .RaLayout-appFrame': { marginTop: 55 } }} {...props}>
);
```
{% endraw %}

This property accepts the following subclasses:

| Rule name                        | Description                                                                               |
|----------------------------------|------------------------------------------------------------------------------------------ |
| `& .RaLayout-appFrame`           | Applied to the application frame containing the appBar, the sidebar, and the main content |
| `& .RaLayout-contentWithSidebar` | Applied to the main part containing the sidebar and the content                           |
| `& .RaLayout-content`            | Applied to the content area                                                               |

To override the style of `<Layout>` using the [MUI style overrides](https://mui.com/customization/theme-components/), use the `RaLayout` key.

**Tip**: If you find yourself tweaking the `<Layout sx>` prop, you're probably better off [writing your own layout component](./Theming.md#layout-from-scratch). 