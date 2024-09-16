---
layout: default
title: "useDefineAppLocation"
---

# `useDefineAppLocation`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> hook lets you define the app location for a page, used by components like [`<Breadcrumb>`](./Breadcrumb.md) and [`<IconMenu>`](./IconMenu.md) to render the current location.

<video controls autoplay playsinline muted loop width="100%">
  <source src="https://react-admin-ee.marmelab.com/assets/ra-navigation/latest/breadcumb-nested-resource.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

In the following example, the `<SongEditForArtist>` component is a [nested resource](https://marmelab.com/react-admin/Resource.html#nested-resources) rendering at the `/artists/:id/songs/:songId` path. It uses `useDefineAppLocation` to define the app location as `artists.edit.songs.edit`, and passes the `record` and `song` objects as parameters to let the breadcrumb component render the record and song names.

```tsx
import { useParams } from 'react-router-dom';
import { Edit, SimpleForm, TextInput, DateInput, useGetOne } from 'react-admin';
import { useDefineAppLocation } from '@react-admin/ra-navigation';

const SongEditForArtist = () => {
    const { id, songId } = useParams<{ id: string; songId: string }>();
    const { data: record } = useGetOne('artists', { id });
    const { data: song } = useGetOne('songs', { id: songId });
    useDefineAppLocation('artists.edit.songs.edit', { record, song });
    return (
        <Edit resource="songs" id={songId} redirect={`/artists/${id}/songs`}>
            <SimpleForm>
                <TextInput source="title" />
                <DateInput source="released" />
                <TextInput source="writer" />
                <TextInput source="producer" />
                <TextInput source="recordCompany" label="Label" />
            </SimpleForm>
        </Edit>
    );
};
```

**Tip**: The `<Edit>` component will call `dataProvider.getOne("songs", { id: songId })` to fetch the song record. Since the `<SongEditForArtist>` component makes the same request, React-admin will deduplicate the calls and only make one request to the dataProvider.

**Tip**: If you don't call `useDefineAppLocation` anywhere on a page, the AppLocationContext will deduce a resource app location from the current URL path (e.g. `artists.edit` for the `/artists/:id` path).

Here is how a custom Breadcrumb would use location `values` to render the record and song names:

```tsx
const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.Item name="artists" label="Artists" to="/artists">
            <Breadcrumb.Item
                name="edit"
                label={({ record }: { record?: Artist }) => record?.name}
                to={({ record }: { record?: Artist }) =>
                    `/artists/${record?.id}`
                }
            >
                <Breadcrumb.Item
                    name="songs"
                    label="Songs"
                    to={({ record }: { record?: Artist }) =>
                        `/artists/${record?.id}/songs`
                    }
                >
                    <Breadcrumb.Item
                        name="edit"
                        label={({ song }: { song?: Song }) => song?.title}
                        to={({ song }: { song?: Song }) =>
                            `/artists/${song?.artist_id}/songs/${song?.id}`
                        }
                    />
                </Breadcrumb.Item>
            </Breadcrumb.Item>
            <Breadcrumb.Item
                name="create"
                label="Create"
                to="/artists/create"
            />
        </Breadcrumb.Item>
    </Breadcrumb>
);
```

## Usage

This component requires that the application layout is wrapped with [`<AppLocationContext>`](./Breadcrumb.md#app-location) (which is already the case for [`<ContainerLayout>`](./ContainerLayout.md) and `<SolarLayout>`):

```jsx
// in src/MyLayout.jsx
import { AppLocationContext, Breadcrumb } from '@react-admin/ra-navigation';
import { Layout } from 'react-admin';

import { MyBreadcrumb } from './MyBreadcrumb';

export const MyLayout = ({ children }) => (
    <AppLocationContext>
        <Layout>
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
