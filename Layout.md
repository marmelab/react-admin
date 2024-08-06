---
layout: default
title: "The Layout Component"
---

# `<Layout>`

The default react-admin layout renders a horizontal app bar at the top, a navigation menu on the side, and the main content in the center.

<video controls autoplay playsinline muted loop>
  <source src="./img/layout-component.webm" type="video/webm"/>
  <source src="./img/layout-component.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

In addition, the layout renders the menu as a dropdown on mobile.

<video controls autoplay playsinline muted loop>
  <source src="./img/layout-responsive.webm" type="video/webm"/>
  <source src="./img/layout-responsive.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

React-admin lets you override the app layout using [the `<Admin layout>` prop](./Admin.md#layout). You can use any component you want as layout ; but if you just need to tweak the default layout, you can use the `<Layout>` component.

## Usage

Create a custom layout overriding some of the props of the default layout. Remember to pass down the `children` prop:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';

export const MyLayout = ({ children }) => (
    <Layout appBar={MyAppBar}>
        {children}
    </Layout>
);
```

Then pass this custom layout to the `<Admin>` component:

Instead of the default layout, you can use your own component as the admin layout. Just use the layout prop of the `<Admin>` component:

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

| Prop             | Required | Type        | Default  | Description                                                             |
| ---------------- | -------- | ----------- | -------- | ----------------------------------------------------------------------- |
| `children`       | Required | `Element`   | -        | The content of the layout                                               |
| `appBar`         | Optional | `Component` | -        | A React component rendered at the top of the layout                     |
| `appBarAlwaysOn` | Optional | `boolean`   | -        | When true, the app bar is always visible                                |
| `className`      | Optional | `string`    | -        | Passed to the root `<div>` component                                    |
| `error`          | Optional | `Component` | -        | A React component rendered in the content area in case of error         |
| `menu`           | Optional | `Component` | -        | A React component rendered at the side of the screen                    |
| `sidebar`        | Optional | `Component` | -        | A React component responsible for rendering the menu (e.g. in a drawer) |
| `sx`             | Optional | `SxProps`   | -        | Style overrides, powered by MUI System                                  |

## `appBar`

Lets you override the top App Bar.

```jsx
// in src/MyLayout.js
import * as React from 'react';
import { Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';

export const MyLayout = ({ children }) => (
    <Layout appBar={MyAppBar}>
        {children}
    </Layout>
);
```

You can use [react-admin's `<AppBar>` component](./AppBar.md) as a base for your custom app bar, or the component of your choice. 

By default, react-admin's `<AppBar>` displays the page title. You can override this default by passing children to `<AppBar>` - they will replace the default title. And if you still want to include the page title defined by each page, make sure you include the `<TitlePortal>` element (which uses [React Portals](https://react.dev/reference/react-dom/createPortal)).

Here is a custom app bar component extending `<AppBar>` to include a company logo in the center of the page header:

{% raw %}
```jsx
// in src/MyAppBar.js
import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import Box from '@mui/material/Box';

import Logo from './Logo';

export const MyAppBar = () => (
    <AppBar color="primary">
        <TitlePortal />
        <Box flex="1" />
        <Logo />
        <Box flex="1" />
    </AppBar>
);
```
{% endraw %}

![custom AppBar](./img/custom_appbar.png)

Check out the [`<AppBar>` documentation](./AppBar.md) for more information, and for instructions on building your own AppBar.

## `appBarAlwaysOn`

By default, the app bar is hidden when the user scrolls down the page. This is useful to save space on small screens. But if you want to keep the app bar always visible, you can set the `appBarAlwaysOn` prop to `true`.

```jsx
// in src/MyLayout.js
import * as React from 'react';
import { Layout } from 'react-admin';

export const MyLayout = ({ children }) => (
    <Layout appBarAlwaysOn>
        {children}
    </Layout>
);
```

## `className`

`className` is passed to the root `<div>` component. It lets you style the layout with CSS - but the `sx` prop is preferred.

## `error`

React-admin uses [React's Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) to render a user-friendly error page in case of client-side JavaScript error, using an internal component called `<Error>`. In production mode, it only displays a generic error message. In development mode, this error page contains the error message and stack trace. 

![Default error page](./img/error.webp)

If you want to customize this error page (e.g. to log the error in a monitoring service), create your own error component, and pass it to a custom Layout, as follows:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';
import { MyError } from './MyError';

export const MyLayout = ({ children }) => (
    <Layout error={MyError}>
        {children}
    </Layout>
);
```

React-admin relies on [the `react-error-boundary` package](https://github.com/bvaughn/react-error-boundary) for handling error boundaries. So your custom error component will receive the error, the error info, and a `resetErrorBoundary` function as props. You should call `resetErrorBoundary` upon navigation to remove the error screen.

Here is an example of a custom error component:


```jsx
// in src/MyError.js
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Report';
import History from '@mui/icons-material/History';
import { Title, useTranslate, useDefaultTitle, useResetErrorBoundaryOnLocationChange } from 'react-admin';

export const MyError = ({
    error,
    resetErrorBoundary,
    ...rest
}) => {
    useResetErrorBoundaryOnLocationChange(resetErrorBoundary);

    const translate = useTranslate();
    const defaultTitle = useDefaultTitle();
    return (
        <div>
            <Title title={`${defaultTitle}: Error`} />
            <h1><ErrorIcon /> Something Went Wrong </h1>
            <div>A client error occurred and your request couldn't be completed.</div>
            {process.env.NODE_ENV !== 'production' && (
                <details>
                    <h2>{translate(error.message)}</h2>
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

**Tip:** React-admin uses the default `<Error>` component as error boundary **twice**: once in `<Layout>` for error happening in CRUD views, and once in `<Admin>` for errors happening in the layout. If you want to customize the error page in the entire app, you should also pass your custom error component to the `<Admin error>` prop. See the [Admin error prop](./Admin.md#error) documentation for more details.

## `menu`

Lets you override the menu.

```jsx
// in src/Layout.js
import { Layout } from 'react-admin';
import { MyMenu } from './MyMenu';

export const Layout = ({ children }) => (
    <Layout menu={MyMenu}>
        {children}
    </Layout>
);
```

You can create a custom menu component using [react-admin's `<Menu>` component](./Menu.md):

```jsx
// in src/MyMenu.js
import * as React from 'react';
import { Menu } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/posts" primaryText="Posts" leftIcon={<BookIcon />}/>
        <Menu.Item to="/comments" primaryText="Comments" leftIcon={<ChatBubbleIcon />}/>
        <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />}/>
        <Menu.Item to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />}/>
    </Menu>
);
```

The `<Layout menu>` component can render any component you like - not just a component based on `<Menu>`.

React-admin provides alternative menu layouts that you can use as a base for your own menu:

- [`<MultiLevelMenu>`](./MultiLevelMenu.md) to render nested menus
- [`<IconMenu>`](./IconMenu.md) for a narrow icon bar with dropdown menus

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-multilevelmenu-categories.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

And you can build a totally custom menu using [Material UI's `<Menu>` component](https://mui.com/material-ui/react-menu/).

## `sidebar`

You can override the default sidebar using this prop. The default sidebar will display a permanent drawer when the window size is above Material UI theme's `sm` breakpoint, and a temporary drawer when the window size is less than that.

If you wish to always display a temporary drawer, you can customize using the following sample code:

```jsx
// in src/Layout.js
import * as React from 'react';
import { Layout } from 'react-admin';

import { MySidebar } from './MySidebar';

export const Layout = ({ children }) => (
    <Layout sidebar={MySidebar}>
        {children}
    </Layout>
);

// in src/MySidebar.js
import * as React from 'react';
import { Drawer } from '@mui/material';
import { SidebarClasses, useLocale, useSidebarState } from 'react-admin';

export const MySidebar = ({ children }) => {
    const [open, setOpen] = useSidebarState();
    useLocale(); // force redraw on locale change

    const toggleSidebar = () => setOpen(!open);

    return (
        <Drawer
            variant="temporary"
            open={open}
            onClose={toggleSidebar}
            classes={SidebarClasses}
        >
            {children}
        </Drawer>
    );
};
```

You can specify the `Sidebar` width by setting the `width` and `closedWidth` properties on a custom Material UI theme:

```jsx
import { defaultTheme } from 'react-admin';

const theme = {
    ...defaultTheme,
    sidebar: {
        width: 300, // The default value is 240
        closedWidth: 70, // The default value is 55
    },
};

const App = () => (
    <Admin theme={theme} dataProvider={...}>
        // ...
    </Admin>
);
```

For more advanced sidebar theming, create a new `Sidebar` component overiding the default one with the `sx` prop:

{% raw %}
```jsx
import { Sidebar, Layout } from 'react-admin';

const MySidebar = (props) => (
    <Sidebar
        sx={{
            "& .RaSidebar-drawerPaper": {
                backgroundColor: "red",
            },
        }}
        {...props}
    />
);

const MyLayout = ({ children }) => (
    <Layout sidebar={MySidebar}>
        {children}
    </Layout>
);
```
{% endraw %}

## `sx`: CSS API

Pass an `sx` prop to customize the style of the main component and the underlying elements.

{% raw %}
```jsx
export const MyLayout = ({ children }) => (
    <Layout sx={{ '& .RaLayout-appFrame': { marginTop: 55 } }}>
        {children}
    </Layout>
);
```
{% endraw %}

This property accepts the following subclasses:

| Rule name                        | Description                                                                               |
|----------------------------------|------------------------------------------------------------------------------------------ |
| `& .RaLayout-appFrame`           | Applied to the application frame containing the appBar, the sidebar, and the main content |
| `& .RaLayout-contentWithSidebar` | Applied to the main part containing the sidebar and the content                           |
| `& .RaLayout-content`            | Applied to the content area                                                               |

To override the style of `<Layout>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaLayout` key.

**Tip**: If you need to override global styles (like the default font size or family), you should [write a custom theme](./AppTheme.md#writing-a-custom-theme) rather than override the `<Layout sx>` prop. And if you need to tweak the default layout to add a right column or move the menu to the top, you're probably better off [writing your own layout component](./Layout.md#writing-a-layout-from-scratch). 

## Adding A Custom Context

A custom Layout is the ideal place to add an application-wide context. 

For instance, in a multi-tenant application, you may want to add a `tenant` context to your layout.

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';

import { TenantContext } from './TenantContext';

const getCookie = (name) => document.cookie
  .split('; ')
  .find(row => row.startsWith(`${name}=`))
  ?.split('=')[1];

export const MyLayout = ({ children }) => (
    <TenantContext.Provider value={getCookie('tenant')}>
        <Layout>
            {children}
        </Layout>
    </TenantContext.Provider>
);
```

## Adding Developer Tools

A custom layout is also the ideal place to add debug tools, e.g. [react-query devtools](https://tanstack.com/query/v5/docs/react/devtools):

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const MyLayout = ({ children }) => (
    <Layout>
        {children}
        <ReactQueryDevtools />
    </Layout>
);
```

![React-Query DevTools](./img/react-query-devtools.png)

## Alternative Layouts

If you can't configure `<Layout>` to render the layout you want, you can use an alternative layout component:

- [`<ContainerLayout>`](./ContainerLayout.md) is centered layout with horizontal navigation.
- [`<SolarLayout>`](./SolarLayout.md) is a layout with a small icon sidebar, no top bar, and a full-width content area.

<figure>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1177 290" preserveAspectRatio="xMinYMin meet">
        <image width="1177" height="290" xlink:href="./img/layouts.png" />
        <g opacity="0">
            <a href="./Layout.html" aria-label="Layout">
                <rect x="0" y="0" width="348" height="290"/>
            </a>
        </g>
        <g opacity="0">
            <a href="./ContainerLayout.html" aria-label="ContainerLayout">
                <rect x="373" y="0" width="408" height="290"/>
            </a>
        </g>
        <g opacity="0">
            <a href="./SolarLayout.html" aria-label="SolarLayout">
                <rect x="801" y="0" width="376" height="290"/>
            </a>
        </g>
    </svg>
</figure>

You can also write your own layout component from scratch (see below).

## Writing A Layout From Scratch

For more custom layouts, write a component from scratch. Your custom layout will receive the page content as `children`, so it should render it somewhere.

In its simplest form, a custom layout is just a component that renders its children:

```tsx
const MyLayout = ({ children }) => (
    <div>
        <h1>My App</h1>
        <main>{children}</main>
    </div>
);
```

You can use the [default layout](https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/layout/Layout.tsx) as a starting point for your custom layout. Here is a simplified version (with no responsive support):

{% raw %}
```jsx
// in src/MyLayout.js
import { Box } from '@mui/material';
import { AppBar, Menu, Sidebar } from 'react-admin';

const MyLayout = ({ children }) => (
    <Box 
        display="flex"
        flexDirection="column"
        zIndex={1}
        minHeight="100vh"
        backgroundColor="theme.palette.background.default"
        position="relative"
    >
        <Box
            display="flex"
            flexDirection="column"
            overflowX="auto"
        >
            <AppBar />
            <Box display="flex" flexGrow={1}>
                <Sidebar>
                    <Menu />
                </Sidebar>
                <Box
                    display="flex"
                    flexDirection="column"
                    flexGrow={2}
                    p={3}
                    marginTop="4em"
                    paddingLeft={5}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    </Box>
);

export default MyLayout;
```
{% endraw %}
