---
layout: default
title: "useDefineAppLocation"
---

# `useDefineAppLocation`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook lets you define the app location for a page, used by components like [`<Breadcrumb>`](./Breadcrumb.md) and [`<IconMenu>`](./IconMenu.md) to render the current location. 

<video controls autoplay playsinline muted loop width="100%">
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-navigation/latest/breadcumb-nested-resource.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-navigation/latest/breadcumb-nested-resource.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Usage

This component requires that the application layout is wrapped with [`<AppLocationContext>`](./Breadcrumb.md#app-location) (which is already the case for [`<ContainerLayout>`](./ContainerLayout.md) and `<SolarLayout>`):

```jsx
// in src/MyLayout.jsx
import { AppLocationContext, Breadcrumb } from '@react-admin/ra-navigation';
import { Layout } from 'react-admin';

import { MyBreadcrumb } from './MyBreadcrumb';

export const MyLayout = ({ children, ...rest }) => (
    <AppLocationContext>
        <Layout {...rest}>
            <MyBreadcrumb />
            {children}
        </Layout>
    </AppLocationContext>
);
```

Then, a page component can define its app location by passing a string composed of location segments separated by a dot to the `useDefineAppLocation` hook:

```jsx
// in src/UserPreferences.jsx
import { useDefineAppLocation } from '@react-admin/ra-navigation';

const UserPreferences = () => {
    useDefineAppLocation('user.preferences');
    return <span>My Preferences</span>;
};
```

Let's say that this custom page is added to the app under the `/preferences` URL:

```jsx
// in src/App.jsx
import { Admin, Resource, CustomRoutes, } from 'react-admin';
import { Route } from 'react-router-dom';

import { MyLayout } from './MyLayout';
import { UserPreferences } from './UserPreferences';

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        ...
        <CustomRoutes>
            <Route exact path="/preferences" component={UserPreferences} />,
        </CustomRoutes>
    </Admin>
);
```

Components inside the app, like [`<Breadcrumb>`](./Breadcrumb.md), can read the current app location and define custom items for the `'user.preferences'` location. 

```jsx
// in src/MyBreadcrumb.jsx
import { Breadcrumb } from '@react-admin/ra-navigation';

export const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItems />
        <Breadcrumb.Item name="user" label="User">
            <Breadcrumb.Item name="preferences" label="Preferences" to="/preferences" />
        </Breadcrumb.Item>
    </Breadcrumb>
);
```

## App Location For CRUD Pages

You don't need to define the app location for CRUD pages as react-admin does it by default:

-   List: `[resource].list`
-   Create: `[resource].create`
-   Edit: `[resource].edit`. The location also contains the current `record`
-   Show: `[resource].show`. The location also contains the current `record`

However, you can customize these default app locations in your CRUD pages. For instance, to create a Post List page with the app location set to `posts.published`, you can do the following:

{% raw %}
```jsx
import { List, Datagrid, TextField } from 'react-admin';
import { useDefineAppLocation } from '@react-admin/ra-navigation';

export const PublishedPostsList = () => {
    useDefineAppLocation('posts.published');
    return (
        <List filter={{ isPublished: true }}>
            <Datagrid>
                <TextField source="title" />
                ...
            </Datagrid>
        </List>
    );
}
```
{% endraw %}

## Dependent Components

The following components read the app location context:

- [`<Breadcrumb>`](./Breadcrumb.md)
- [`<MultiLevelMenu>`](./MultiLevelMenu.md)
- [`<IconMenu>`](./IconMenu.md)
- [`<HorizontalMenu>`](./HorizontalMenu.md)
