---
layout: default
title: "Theming"
---

# Theming

Whether you need to adjust a CSS rule for a single component, or change the color of the labels in the entire app, you're covered!

## Overriding A Component Style

Every react-admin component provides a `className` property, which is always applied to the root element.

Here is an example customizing an `EditButton` component inside a `Datagrid`, using its `className` property and the `makeStyle` hook from Material-UI:

{% raw %}
```jsx
import React from 'react';
import { NumberField, List, Datagrid, TextField, EditButton } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    button: {
        fontWeight: 'bold',
        // This is JSS syntax to target a deeper element using css selector, here the svg icon for this button
        '& svg': { color: 'orange' }
    },
});

const MyEditButton = props => {
    const classes = useStyles();
    return <EditButton className={classes.button} {...props} />;
};

export const ProductList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="sku" />
            <TextField source="price" />
            <MyEditButton />
        </Datagrid>
    </List>
);
```
{% endraw %}

For some components, you may want to override not only the root component style, but also the style of components inside the root. In this case, the `className` property isn't enough. You can take advantage of the `classes` property to customize the classes that the component uses internally.

Here is an example using the `classes` property of the `Filter` and `List` components:

{% raw %}
```jsx
import React from 'react';
import {
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    EditButton,
    Filter,
    List,
    NullableBooleanInput,
    NumberField,
    TextInput,
} from 'react-admin';
import Icon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';

export const VisitorIcon = Icon;

// The Filter component supports the `form` and `button` CSS classes. Here we override the `form` class
const useFilterStyles = makeStyles({
    form: {
        backgroundColor: 'Lavender',
    },
});

const VisitorFilter = props => {
    const classes = useFilterStyles();
    return (
        <Filter classes={classes} {...props}>
            <TextInput
                className={classes.searchInput}
                label="pos.search"
                source="q"
                alwaysOn
            />
            <DateInput source="last_seen_gte" />
            <NullableBooleanInput source="has_ordered" />
            <NullableBooleanInput source="has_newsletter" defaultValue />
        </Filter>
    );
};

// The `List` component supports the `root`, `header`, `actions` and `noResults` CSS classes. Here we override the `header` and `actions` classes
const useListStyles = makeStyles({
    actions: {
        backgroundColor: 'Lavender',
    },
    header: {
        backgroundColor: 'Lavender',
    },
});

export const VisitorList = props => {
    const classes = useListStyles();
    return (
        <List
            classes={classes}
            {...props}
            filters={<VisitorFilter />}
            sort={{ field: 'last_seen', order: 'DESC' }}
            perPage={25}
        >
            <Datagrid classes={classes} {...props}>
                <DateField source="last_seen" type="date" />
                <NumberField
                    source="nb_commands"
                    label="resources.customers.fields.commands"
                />
                <NumberField
                    source="total_spent"
                    options={{ style: 'currency', currency: 'USD' }}
                />
                <DateField source="latest_purchase" showTime />
                <BooleanField source="has_newsletter" label="News." />
                <EditButton />
            </Datagrid>
        </List>
    )
};
```
{% endraw %}

This example results in:

![Visitor List with customized CSS classes](./img/list_with_customized_css.png)

Take a look at a component documentation and source code to know which classes are available for styling. For instance, you can have a look at the [Datagrid CSS documentation](./List.md#the-datagrid-component).

If you need more control over the HTML code, you can also create your own [Field](./Fields.md#writing-your-own-field-component) and [Input](./Inputs.md#writing-your-own-input-component) components.

## Conditional Formatting

Sometimes you want the format to depend on the value. The following example shows how to create a new custom `NumberField` component which highlight its text in red when its value is 100 or higher.

{% raw %}
```jsx
import React from 'react';
import { NumberField, List, Datagrid, TextField, EditButton } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles({
    small: { color: 'black' },
    big: { color: 'red' },
});

const ColoredNumberField = props => {
    const classes = useStyles();
    return (
        <NumberField
            className={classnames({
                [classes.small]: props.record[props.source] < 100,
                [classes.big]: props.record[props.source] >= 100,
            })}
            {...props}
        />
    );
};

// Ensure the original component defaultProps are still applied as they may be used by its parents (such as the `Show` component):
ColoredNumberField.defaultProps = NumberField.defaultProps;

export const PostList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            ...
            <ColoredNumberField source="nb_views" />
            <EditButton />
        </Datagrid>
    </List>
);
```
{% endraw %}

Furthermore, you may extract this highlighting strategy into an Higher Order Component if you'd like to reuse it for other components as well:

{% raw %}
```jsx
import React from 'react';
import { NumberField, List, Datagrid, TextField, EditButton } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles({
    small: { color: 'black' },
    big: { color: 'red' },
});

const colored = WrappedComponent => props => {
    const classes = useStyles();
    return (
        <WrappedComponent
            className={classnames({
                [classes.small]: props.record[props.source] < 500,
                [classes.big]: props.record[props.source] >= 500,
            })}
            {...props}
        />
    )
};


const ColoredNumberField = colored(NumberField);
// Ensure the original component defaultProps are still applied as they may be used by its parents (such as the `Show` component):
ColoredNumberField.defaultProps = NumberField.defaultProps;

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            ...
            <ColoredNumberField source="nb_views" />
            <EditButton />
        </Datagrid>
    </List>
);
```
{% endraw %}

If you want to read more about higher-order components, check out this SitePoint tutorial: [Higher Order Components: A React Application Design Pattern](https://www.sitepoint.com/react-higher-order-components/)

## useMediaQuery Hook

To provide an optimized experience on mobile, tablet, and desktop devices, you often need to display different components depending on the screen size. Material-ui provides a hook dedicated to help such responsive layouts: [`useMediaQuery`](https://material-ui.com/components/use-media-query/#usemediaquery).

It expects a function receiving the material-ui theme as a parameter, and returning a media query. Use the theme breakpoints to check for common screen sizes. The hook returns a boolean indicating if the current screen matches the media query or not.

```jsx
const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));
```

You can also pass a custom media query as a screen. 

```jsx
const isSmall = useMediaQuery('(min-width:600px)');
```

Here is an example for a responsive list of posts, displaying a `SimpleList` on mobile, and a `Datagrid` otherwise:

```jsx
// in src/posts.js
import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, ReferenceField, EditButton } from 'react-admin';

export const PostList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <ReferenceField label="User" source="userId" reference="users">
                        <TextField source="name" />
                    </ReferenceField>
                    <TextField source="title" />
                    <TextField source="body" />
                    <EditButton />
                </Datagrid>
            )}
        </List>
    );
};
```

**Tip**: Previous versions of react-admin shipped a `<Responsive>` component to do media queries. This component is now deprecated. Use `useMediaQuery` instead.

## Using a Predefined Theme

Material UI also supports [complete theming](https://material-ui.com/customization/themes) out of the box. Material UI ships two base themes: light and dark. React-admin uses the light one by default. To use the dark one, pass it to the `<Admin>` component, in the `theme` prop (along with `createMuiTheme()`).

```jsx
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});

const App = () => (
    <Admin theme={theme} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

![Dark theme](./img/dark-theme.png)

## Writing a Custom Theme

If you need more fine tuning, you'll need to write your own `theme` object, following [Material UI themes documentation](https://material-ui.com/customization/themes/). Material UI merges custom theme objects with the default theme.

```jsx
import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

const myTheme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: pink,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    overrides: {
        MuiButton: { // override the styles of all instances of this component
            root: { // Name of the rule
                color: 'white', // Some CSS
            },
        },
    },
});
```

The `myTheme` object contains the following keys:

* `breakpoints`
* `direction`
* `mixins`
* `overrides`
* `palette`
* `props`
* `shadows`
* `typography`
* `transitions`
* `spacing`
* `zIndex`

**Tip**: Check [Material UI default theme documentation](https://material-ui.com/customization/default-theme/) to see the default values and meaning for these keys.

Once your theme is defined, pass it to the `<Admin>` component, in the `theme` prop.

```jsx
const App = () => (
    <Admin theme={myTheme} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## Using a Custom Layout

Instead of the default layout, you can use your own component as the admin layout. Just use the `layout` prop of the `<Admin>` component:

```jsx
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

Your custom layout can extend the default `<Layout>` component if you only want to override the sidebar, the appBar, the menu, the notification component, or the error page. For instance:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';
import MyAppBar from './MyAppBar';
import MySidebar from './MySidebar';
import MyMenu from './MyMenu';
import MyNotification from './MyNotification';

const MyLayout = props => <Layout
    {...props}
    appBar={MyAppBar}
    sidebar={MySidebar}
    menu={MyMenu}
    notification={MyNotification}
/>;

export default MyLayout;
```

### UserMenu Customization

You can replace the default user menu by your own by setting the `userMenu` prop of the `<AppBar>` component. For instance, to add custom menu items, just decorate the default `<UserMenu>` by adding children to it:

```jsx
import React from 'react';
import { AppBar, UserMenu, MenuItemLink } from 'react-admin';
import SettingsIcon from '@material-ui/icons/Settings';

const ConfigurationMenu = forwardRef(({ onClick }, ref) => (
    <MenuItemLink
        ref={ref}
        to="/configuration"
        primaryText="Configuration"
        leftIcon={<SettingsIcon />}
        onClick={onClick} // close the menu on click
    />
));

const MyUserMenu = props => (
    <UserMenu {...props}>
        <ConfigurationMenu />
    </UserMenu>
);

const MyAppBar = props => <AppBar {...props} userMenu={<MyUserMenu />} />;

const MyLayout = props => <Layout {...props} appBar={<MyAppBar />} />;
```

You can also customize the default icon by setting the `icon` prop to the `<UserMenu />` component.

{% raw %}
``` jsx
import { AppBar, UserMenu } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
    avatar: {
        height: 30,
        width: 30,
    },
});

const MyCustomIcon = () => {
    const classes = useStyles();
    return (
        <Avatar
            className={classes.avatar}
            src="https://marmelab.com/images/avatars/adrien.jpg"
        />
    )
};

const MyUserMenu = props => (<UserMenu {...props} icon={MyCustomIcon} />);

const MyAppBar = props => <AppBar {...props} userMenu={<MyUserMenu />} />;
```
{% endraw %}

### Sidebar Customization

You can specify the `Sidebar` width by setting the `width` and `closedWidth` property on your custom material-ui theme:

```jsx
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    sidebar: {
        width: 300, // The default value is 240
        closedWidth: 70, // The default value is 55
    },
});

const App = () => (
    <Admin theme={theme} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

For more advanced sidebar theming, pass your own `Sidebar` component to a custom `Layout`:

```jsx
import { Sidebar, Layout } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useSidebarStyles = makeStyles({
    drawerPaper: {
        backgroundColor: 'red',
    },
});

const MySidebar = props => {
    const classes = useSidebarStyles();
    return (
        <Sidebar classes={classes} {...props} />
    );
};

const MyLayout = props => <Layout {...props} sidebar={MySidebar} />
```

### Layout From Scratch

For more custom layouts, write a component from scratch. It must contain a `{children}` placeholder, where react-admin will render the resources. Use the [default layout](https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/layout/Layout.js) as a starting point. Here is a simplified version (with no responsive support):

```jsx
// in src/MyLayout.js
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {
    AppBar,
    Menu,
    Notification,
    Sidebar,
    setSidebarVisibility,
    ComponentPropType,
} from 'react-admin';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
    },
    appFrame: {
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'auto',
    },
    contentWithSidebar: {
        display: 'flex',
        flexGrow: 1,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        padding: theme.spacing(3),
        marginTop: '4em',
        paddingLeft: 5,
    },
}));

const MyLayout = ({ 
    children,
    dashboard,
    logout,
    title,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const open = useSelector(state => state.admin.ui.sidebarOpen);
    
    useEffect(() => {
        dispatch(setSidebarVisibility(true));
    }, [setSidebarVisibility]);
    
    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <AppBar title={title} open={open} logout={logout} />
                <main className={classes.contentWithSidebar}>
                    <Sidebar>
                        <Menu logout={logout} hasDashboard={!!dashboard} />
                    </Sidebar>
                    <div className={classes.content}>
                        {children}
                    </div>
                </main>
                <Notification />
            </div>
        </div>
    );
};

MyLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    dashboard: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
    ]),
    logout: ComponentPropType,
    title: PropTypes.string.isRequired,
};

export default MyLayout;
```

**Tip**: Don't forget to render a `<Notification>` component in your custom layout, otherwise the undoable updates will never be sent to the server. That's because part of the "undo" logic of react-admin lies in the `<Notification>` component.  

## Customizing the AppBar Content

By default, the react-admin `<AppBar>` component displays the page title. You can override this default by passing children to `<AppBar>` - they will replace the default title. And if you still want to include the page title, make sure you include an element with id `react-admin-title` in the top bar (this uses [React Portals](https://reactjs.org/docs/portals.html)). 

Here is an example customization for `<AppBar>` to include a company logo in the center of the page header:

```jsx
// in src/MyAppBar.js
import React from 'react';
import { AppBar } from 'react-admin';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Logo from './Logo';

const useStyles = makeStyles({
    title: {
        flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    spacer: {
        flex: 1,
    },
});

const MyAppBar = props => {
    const classes = useStyles();
    return (
        <AppBar {...props}>
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
};

export default MyAppBar;
```

To use this custom `MyAppBar` component, pass it as prop to a custom `Layout`, as shown below:

```jsx
// in src/MyLayout.js
import React from 'react';
import { Layout } from 'react-admin';
import MyAppBar from './MyAppBar';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

export default MyLayout;
```

Then, use this layout in the `<Admin>` with the `layout` prop:

```jsx
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

![custom AppBar](./img/custom_appbar.png)

## Replacing The AppBar

For more drastic changes of the top component, you will probably want to create an `<AppBar>` from scratch instead of just passing children to react-admin's `<AppBar>`. 

By default, React-admin uses [Material-ui's `<AppBar>` component](https://material-ui.com/api/app-bar/) together with [react-headroom](https://github.com/KyleAMathews/react-headroom) to hide the `AppBar` on scroll. Here is an example top bar rebuilt from scratch to remove the "headroom" effect:

```jsx
// in src/MyAppBar.js
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const MyAppBar = props => (
    <AppBar {...props}>
        <Toolbar>
            <Typography variant="h6" id="react-admin-title" />
        </Toolbar>
    </AppBar>
);

export default MyAppBar;
```

Take note that this uses *material-ui's `<AppBar>`* instead of *react-admin's `<AppBar>`*. To use this custom `AppBar` component, pass it as prop to a custom `Layout`, as explained in the previous section.

## Using a Custom Menu

By default, React-admin uses the list of `<Resource>` components passed as children of `<Admin>` to build a menu to each resource with a `list` component.

If you want to add or remove menu items, for instance to link to non-resources pages, you can create your own menu component:

```jsx
// in src/Menu.js
import React, { createElement } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import { MenuItemLink, getResources } from 'react-admin';
import DefaultIcon from '@material-ui/icons/ViewList';
import LabelIcon from '@material-ui/icons/Label';

const Menu = ({ onMenuClick, logout }) => {
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const open = useSelector(state => state.admin.ui.sidebarOpen);
    const resources = useSelector(getResources);
    return (
        <div>
            {resources.map(resource => (
                <MenuItemLink
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={
                        (resource.options && resource.options.label) ||
                        resource.name
                    }
                    leftIcon={
                        resource.icon ? <resource.icon /> : <DefaultIcon />
                    }
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                />
            ))}
            <MenuItemLink
                to="/custom-route"
                primaryText="Miscellaneous"
                leftIcon={<LabelIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
            />
            {isXSmall && logout}
        </div>
    );
};

export default Menu;
```

**Tip**: Note the `MenuItemLink` component. It must be used to avoid unwanted side effects in mobile views.

**Tip**: Note that we include the `logout` item only on small devices. Indeed, the `logout` button is already displayed in the AppBar on larger devices.

**Tip**: The `primaryText` prop accepts a React node. You can pass a custom element in it. For example:

```jsx
    import Badge from '@material-ui/core/Badge';

    <MenuItemLink to="/custom-route" primaryText={
        <Badge badgeContent={4} color="primary">
            Notifications
        </Badge>
    } onClick={onMenuClick} />
```

To use this custom menu component, pass it to a custom Layout, as explained above:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';
import MyMenu from './MyMenu';

const MyLayout = (props) => <Layout {...props} menu={MyMenu} />;

export default MyLayout;
```

Then, use this layout in the `<Admin>` `layout` prop:

```jsx
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

**Tip**: If you use authentication, don't forget to render the `logout` prop in your custom menu component. Also, the `onMenuClick` function passed as prop is used to close the sidebar on mobile.

The `MenuItemLink` component make use of the React Router [`NavLink`](https://reacttraining.com/react-router/web/api/NavLink) component, hence allowing to customize its style when it targets the current page.

If the default active style does not suit your tastes, you can override it by passing your own `classes`:

```jsx
// in src/Menu.js
import React, { createElement } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import { MenuItemLink, getResources } from 'react-admin';
import { withRouter } from 'react-router-dom';
import LabelIcon from '@material-ui/icons/Label';

const Menu = ({ onMenuClick, logout }) => {
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const open = useSelector(state => state.admin.ui.sidebarOpen);
    const resources = useSelector(getResources);
    return (
        <div>
            {resources.map(resource => (
                <MenuItemLink
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={resource.options && resource.options.label || resource.name}
                    leftIcon={createElement(resource.icon)}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                />
            ))}
            <MenuItemLink
                to="/custom-route"
                primaryText="Miscellaneous"
                leftIcon={LabelIcon}
                onClick={onMenuClick}
                sidebarIsOpen={open}
            />
            {isXSmall && logout}
        </div>
    );
};

export default withRouter(Menu);
```

## Using a Custom Login Page

### Changing the Background Image

By default, the login page displays a gradient background. If you want to change the background, you can use the default Login page component and pass an image URL as the `backgroundImage` prop.

```jsx
import { Admin, Login } from 'react-admin';

const MyLoginPage = () => (
    <Login
        // A random image that changes everyday
        backgroundImage="https://source.unsplash.com/random/1600x900/daily"
    />
);

const App = () => (
    <Admin loginPage={MyLoginPage}>
        // ...
    </Admin>
);
```

## Using a Custom Logout Button

### Changing the Icon

It is possible to use a completely [custom logout button](./Authentication.md#the-datagrid-component) or you can simply override some properties of the default button. If you want to change the icon, you can use the default `<Logout>` component and pass a different icon as the `icon` prop.

```jsx
import { Admin, Logout } from 'react-admin';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

const MyLogoutButton = props => <Logout {...props} icon={<ExitToAppIcon/>} />;

const App = () => (
    <Admin logoutButton={MyLogoutButton}>
        // ...
    </Admin>
);
```

## Notifications

You can override the notification component, for instance to change the notification duration. It defaults to 4000, i.e. 4 seconds, and you can override it using the `autoHideDuration` prop. For instance, to create a custom Notification component with a 5 seconds default:

```jsx
// in src/MyNotification.js
import { Notification } from 'react-admin';

const MyNotification = props => <Notification {...props} autoHideDuration={5000} />;

export default MyNotification;
```

**Tip**: if you use the `showNotification` action, then you can define `autoHideDuration` per message as the third parameter of the `showNotification` action creator.

To use this custom notification component, pass it to a custom Layout, as explained above:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';
import MyNotification from './MyNotification';

const MyLayout = (props) => <Layout {...props} notification={MyNotification} />;

export default MyLayout;
```

Then, use this layout in the `<Admin>` `layout` prop:

```jsx
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## Customizing The Error Page

Whenever a client-side error happens in react-admin, the user sees a default error message. If you want to customize this page, or log the error to a third-party service, create your own `<Error>` component. The following snippet is a simplified version of the react-admin Error component, that you can use as a base for your own:

```jsx
// in src/MyError.js
import React from 'react';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Report';
import History from '@material-ui/icons/History';
import { Title, useTranslate } from 'react-admin';

const MyError = ({
    error,
    errorInfo,
    ...rest
}) => {
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
                    icon={<History />}
                    onClick={() => history.go(-1)}
                >
                    Back
                </Button>
            </div>
        </div>
    );
};

export default MyError;
```

To use this custom error component, pass it to a custom Layout, as explained above:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';
import MyError from './MyError';

const MyLayout = (props) => <Layout {...props} error={MyError} />;

export default MyLayout;
```

Then, use this layout in the `<Admin>` `layout` prop:

```jsx
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## Loading

Display a circular progress component with optional messages. Display the same loading component as `react-admin` on custom pages for consistency.

Supported props:

Prop | Type | Default | Descriptions
---|---|---|---
`loadingPrimary` |`String` | `ra.page.loading` | Label to use for primary loading message
`loadingSecondary` |`String` | `ra.message.loading` | Label to use for secondary loading message

Usage:

```jsx
<Loading loadingPrimary="app.page.loading" loadingSecondary="app.message.loading" />
```

## LinearProgress

Display a linear progress component. Display the same loading component as `react-admin` on custom inputs for consistency.

Usage:

```jsx
({ data, ...props }) => !data ?
        <LinearProgress /> :
        <MyInput data={data} />;
```
