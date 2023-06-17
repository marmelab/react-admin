---
layout: default
title: "The Breadcrumb Component"
---

# `<Breadcrumb>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component renders a breadcrumb path that automatically adapts to the page location. It helps users navigate on large admins. 

The `<Breadcrumb>` component is designed to be integrated into the app layout. Each page can define its location using a hook, and the breadcrumb reflects that location. Breadcrumb items can be customized to include data from the current context (e.g. the name of the current record).

<video controls autoplay playsinline muted loop width="100%">
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-navigation/latest/breadcumb-nested-resource.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-navigation/latest/breadcumb-nested-resource.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Test it live on [the Enterprise Edition Storybook](https://storybook.ra-enterprise.marmelab.com/?path=/story/ra-navigation-breadcrumb-basic--basic).

## Usage

Create a custom breadcrumb component using the `<Breadcrumb>` component from the `ra-navigation` package:

```jsx
// in src/MyBreadcrumb.jsx
import { Breadcrumb } from '@react-admin/ra-navigation';

export const MyBreadcrumb = () => (
    <Breadcrumb>
        {/* to be completed */}
    </Breadcrumb>
);
```

Then, add this component to the admin layout. Make sure you wrap the layout with the `<AppLocationContext>` component:

```jsx
// in src/MyLayout.jsx
import { AppLocationContext } from '@react-admin/ra-navigation';
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
    
Finally, pass this custom layout to the `<Admin>` component:
    
```jsx
import { Admin, Resource } from 'react-admin';

import { MyLayout } from './MyLayout';

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

By default, `<Breadcrumb />` does not render anything. It's the job of its children (`<Breadcrumb.Item>` elements) to render the breadcrumb path according to the app location, a bit like `<Route>` components render their children when they match the current browser location.

**Tip**: The *app location* is a powerful concept that `ra-navigation` uses to decouple the location shown in the UI from the browser URL. React-admin default pages have an app location like `posts.list`. You can [define the app location for custom pages](#adding-custom-pages), and include metadata (e.g. records) in the app location. You can learn more about the app location in [the `ra-navigation` documentation](https://marmelab.com/ra-enterprise/modules/ra-navigation#concepts)

For instance, here is a component capable of rendering the breadcrumb path for two different resources:

```jsx
// in src/MyBreadcrumb.jsx
import { Breadcrumb } from '@react-admin/ra-navigation';

const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.Item name="posts" label="Posts" to="/posts">
            <Breadcrumb.Item
                name="edit"
                label={({ record }) => `Edit #${record.id}`}
                to={({ record }) => `/posts/${record.id}`}
            />
            <Breadcrumb.Item
                name="show"
                label={({ record }) => `Show #${record.id}`}
                to={({ record }) => `/posts/${record.id}/show`}
            />
            <Breadcrumb.Item name="create" label="Create" to="/posts/create" />
        </Breadcrumb.Item>
        <Breadcrumb.Item name="comments" label="Comments" to="/comments">
            <Breadcrumb.Item
                name="edit"
                label={({ record }) => `Edit #${record.id}`}
                to={({ record }) => `/comments/${record.id}`}
            />
            <Breadcrumb.Item
                name="show"
                label={({ record }) => `Show #${record.id}`}
                to={({ record }) => `/comments/${record.id}/show`}
            />
            <Breadcrumb.Item
                name="create"
                label="Create"
                to="/comments/create"
            />
        </Breadcrumb.Item>
    </Breadcrumb>
);
```

This breadcrumb renders:

-   "Posts" on the Post List page
-   "Posts / Show #1" on the Post Show page with id = 1
-   "Posts / Edit #1" on the Post Edition page with id = 1
-   "Posts / Create" on the Post Creation page

As building breadcrumbs for resources is a common use case, `ra-navigation` provides a component that does the same for every resource registered as a child of the `<Admin>` component. It's called `<Breadcrumb.ResourceItems>`:

```jsx
import { Breadcrumb } from '@react-admin/ra-navigation';

const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItems />
        {/* add other breadcrumb items here */}
    </Breadcrumb>
);
```

Check [the ra-navigation documentation](https://marmelab.com/ra-enterprise/modules/ra-navigation) to learn more about the breadcrumb feature and its customization.

## Props

| Prop        | Required | Type                | Default  | Description                            |
| ----------- | -------- | ------------------- | -------- | -------------------------------------- |
| `children`  | required | `ReactNode`         | -        | The Breadcrumb Items to be rendered.   |
| `separator` | Optional | `string | function` | '/'      | The character user as separator        |
| `sx`        | Optional | `SxProps`           | -        | Style overrides, powered by MUI System |

Additional props are passed down to the root `<nav>` component.

## `children`

Children of the `<Breadcrumb>` component must be `<Breadcrumb.Item>` components, or any of its derivatives (`<Breadcrumb.ResourceItems>`, `<Breadcrumb.DashboardItem>`). These components can themselves have children to create a breadcrumb path of any depth.

```jsx
import { Breadcrumb } from '@react-admin/ra-navigation';

const MyBreadcrumb = () => (
    <Breadcrumb>
      <Breadcrumb.ResourceItems resources={['otherResources']} />
      <Breadcrumb.Item name="posts" label="Posts">
        <Breadcrumb.Item
          name="edit"
          label={({ record }) => `Edit "${record.title}"`}
          to={({ record }) => record && `${linkToRecord('/songs', record.id)}/edit`}
        />
        <Breadcrumb.Item
          name="show"
          label={({ record }) => record.title}
          to={({ record }) => record && `${linkToRecord('/songs', record.id)}/show`}
        />
        <Breadcrumb.Item name="list" label="My Post List" />
        <Breadcrumb.Item name="create" label="Let's write a Post!" />
      </Breadcrumb.Item>
    </Breadcrumb>
)
```

See [the `<Breadcrumb.Item>` section](#breadcrumbitem) for more information.

## `separator`

The breadcrumb separator used by default is "/". It can be overridden using a string or a function.

```jsx
<Breadcrumb separator=" > ">{items}</Breadcrumb>
<Breadcrumb separator={() => `url('data:image/png;base64,iVBORw0KGgoAA....')`}>
    {items}
</Breadcrumb>
```

## `sx`

You can override the style of the breadcrumb and its items using the `sx` prop.

{% raw %}
```jsx
const MyBreadcrumb = () => (
    <Breadcrumb
        sx={{
            '& ul': { padding: 1, paddingLeft: 0 },
            '& ul:empty': { padding: 0 },
        }}
    >
        // ...
    </Breadcrumb>
);
```
{% endraw %}

## `<Breadcrumb.Item>`

This component renders a single breadcrumb item if the app location matches its `name`.

![A breadcrumb item](https://marmelab.com/ra-enterprise/modules/assets/breadcrumbItem.png)

It requires the following props:

-   `name`: The name of this item; will be used to infer its full path.
-   `label`: The label to display for this item. Can be a string (including a translation key) or a function that returns a string based on the location context.

It accepts the following optional props:

-   `to`: Optional. The react-router path to redirect to. Can be a string, or a function that returns a string based on the location context.

```jsx
import { useCreatePath } from 'react-admin';
import { Breadcrumb } from '@react-admin/ra-navigation';

// custom breadcrumb
const MyBreadcrumb = ({ children, ...props }) => {
    const createPath = useCreatePath();

    return (
        <Breadcrumb>
            <Breadcrumb.ResourceItems resources={['otherResources']} />
            <Breadcrumb.Item name="posts" label="Posts">
                <Breadcrumb.Item
                    name="edit"
                    label={({ record }) => `Edit "${record.title}"`}
                    to={({ record }) =>
                        record &&
                        createPath({
                            type: 'edit',
                            resource: 'songs',
                            id: record.id,
                        })
                    }
                />
                <Breadcrumb.Item
                    name="show"
                    label={({ record }) => record.title}
                    to={({ record }) =>
                        record &&
                        createPath({
                            type: 'show',
                            resource: 'songs',
                            id: record.id,
                        })
                    }
                />
                <Breadcrumb.Item name="list" label="My Post List" />
                <Breadcrumb.Item name="create" label="Let's write a Post!" />
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};
```

## Using A Dashboard As The Root

If the app has a home page, you can automatically set the root of the Breadcrumb to this page by passing a `hasDashboard` prop to the `<Breadcrumb>` component:

```jsx
const MyBreadcrumb = () => (
    <Breadcrumb hasDashboard>
        <Breadcrumb.ResourceItems />
    </Breadcrumb>
);
```

By doing this, the breadcrumb will now show respectively:

-   "Dashboard / Posts" on the Post List page
-   "Dashboard / Posts / Show #1" on the Post Show page with id = 1
-   "Dashboard / Posts / Edit #1" on the Post Edition page with id = 1
-   "Dashboard / Posts / Create" on the Post Creation page

## Adding Custom Pages

A page component can define its app location using the `useDefineAppLocation` hook:

```jsx
// in src/UserPreferences.jsx
import { useDefineAppLocation } from '@react-admin/ra-navigation';

const UserPreferences = () => {
    useDefineAppLocation('myhome.user.preferences');
    return <span>My Preferences</span>;
};
```

```jsx
// in src/App.jsx
import { Admin, Resource, Layout, List } from 'react-admin';
import { Route } from 'react-router-dom';

import { UserPreferences } from './UserPreferences';

const routes = [
    <Route exact path="/user/preferences" component={UserPreferences} />,
];

const App = () => (
    <Admin dataProvider={dataProvider} customRoutes={routes} layout={MyLayout}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

Then, it's the job of the `<Breadcrumb>` component to render the breadcrumb path for this location:

```jsx
const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItems />
        <Breadcrumb.Item name="myhome" label="Home">
            <Breadcrumb.Item name="user" label="User">
                <Breadcrumb.Item name="preferences" label="Preferences" to="/user/preferences" />
            </Breadcrumb.Item>
        </Breadcrumb.Item>
    </Breadcrumb>
);
```

## Nested Resources

When using [nested resources](./Resource.md#nested-resources), create breadcrumb items for the sub-resources. 

For instance, the screencast at the top of this page shows a `songs` resource nested in an `artists` resources.

```jsx
import { Admin, Resource } from 'react-admin';
import { Route } from 'react-router-dom';

export const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="artists" list={ArtistList} edit={ArtistDetail}>
            <Route path=":id/songs" element={<SongList />} />
            <Route path=":id/songs/:songId" element={<SongDetail />} />
        </Resource>
    </Admin>
);
```

This setup creates four routes:

- `/artists` renders the `<ArtistList>` element
- `/artists/:id` renders the `<ArtistDetail>` element
- `/artists/:id/songs` renders the `<SongList>` element
- `/artists/:id/songs/:songId` renders the `<SongDetail>` element

One app location is defined for each route:

- `/artists`: `artists` (defined automatically)
- `/artists/:id`: `artists.edit` (defined automatically)
- `/artists/:id/songs`: `artists.edit.songs` (defined manually)
- `/artists/:id/songs/:songId`: `artists.edit.songs.edit` (defined manually)

Let's see how the components for the songs list and detail pages define their app location:

{% raw %}
```jsx
// in src/songs/SongList.js
import { useGetOne, List, SearchInput, Datagrid, TextField, DateField } from 'react-admin';
import { useDefineAppLocation } from '@react-admin/ra-navigation';
import { useParams } from 'react-router-dom';

export const SongList = () => {
    const { id } = useParams();
    const { data: record } = useGetOne('artists', { id });
    useDefineAppLocation('artists.edit.songs', { record });
    return (
        <List
            resource="songs"
            filter={{ artist_id: id }}
            filters={[<SearchInput key="q" source="q" alwaysOn />]}
        >
            <Datagrid>
                <TextField source="title" />
                <DateField source="released" />
                <TextField source="writer" />
                <TextField source="producer" />
                <TextField source="recordCompany" label="Label" />
                <EditSongButton />
            </Datagrid>
        </List>
    );
};

const EditSongButton = () => {
    const song = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/artists/${song?.artist_id}/songs/${song?.id}`}
            startIcon={<EditIcon />}
        >
            Edit
        </Button>
    );
};
```

```jsx
// in src/songs/SongDetail.js
import { useGetOne, Edit, SimpleForm, TextInput, DateInput } from 'react-admin';
import { useDefineAppLocation } from '@react-admin/ra-navigation';
import { useParams } from 'react-router-dom';

export const SongDetail = () => {
    const { id, songId } = useParams();
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
{% endraw %}

**Tip**: The `<Edit>` component will call `dataProvider.getOne("songs", { id: songId })` to fetch the song record. Since the `<SongDetail>` component makes the same request, React-admin will deduplicate the calls and only make one request to the dataProvider.

**Tip**: You don't need to call `useDefineAppLocation` for the pages of the parent resource (artists) as this resource uses the default URLs (`/artists`, `/artists/:id`). The app location will be deduced automatically from these URLs (i.e. `artists` and `artists.edit`).

Once the app locations are properly set up, the Breadcrumb code comes naturally as:

```jsx
const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.Item name="artists" label="Artists" to="/artists">
            <Breadcrumb.Item
                name="edit"
                label={({ record }) => record?.name}
                to={({ record }) => `/artists/${record?.id}`}
            >
                <Breadcrumb.Item
                    name="songs"
                    label="Songs"
                    to={({ record }) => `/artists/${record?.id}/songs`}
                >
                    <Breadcrumb.Item
                        name="edit"
                        label={({ song }) => song?.title}
                        to={({ song }) => `/artists/${song?.artist_id}/songs/${song?.id}`}
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


