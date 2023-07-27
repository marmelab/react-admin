---
layout: default
title: "Key Concepts"
---

# Key Concepts

React-admin relies on a several design decisions that structure its codebase.

## Single-Page Application

React-admin is specifically designed to build [Single-Page Applications (SPA)](https://en.wikipedia.org/wiki/Single-page_application). In a react-admin app, the browser fetches the required HTML, CSS, and JavaScript to render the application only once. Subsequently, data is fetched from APIs through AJAX calls. This is in contrast to traditional web applications, where the browser fetches a new HTML page for each screen.

![SPA lifecycle](./img/SPA-lifecycle.png)

The SPA architecture ensures that react-admin apps are [exceptionally fast](./Features.md#fast), easy to host, and compatible with existing APIs without requiring a dedicated backend. 

To achieve this, react-admin utilizes an internal router, powered by `react-router`, to display the appropriate screen when the user clicks on a link. Developers can define routes using the [`<Resource>`](./Resource.md) component for CRUD routes and the [`<CustomRoutes>`](./CustomRoutes.md) component for other routes.

For example, the following react-admin application:

```jsx
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';

export const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="labels" list={LabelList} edit={LabelEdit} show={LabelShow} />
        <Resource label="genres" list={GenreList} />
        <Resource name="artists" list={ArtistList} edit={ArtistDetail} create={ArtistCreate}>
            <Route path=":id/songs" element={<SongList />} />
            <Route path=":id/songs/:songId" element={<SongDetail />} />
        </Resource>
        <CustomRoutes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/organization" element={<Organization />} />
        </CustomRoutes>
    </Admin>
);
```

Declares the following routes:

-  `/labels`: `<LabelList>`
-  `/labels/:id`: `<LabelEdit>`
-  `/labels/:id/show`: `<LabelShow>`
-  `/genres`: `<GenreList>`
-  `/artists`: `<ArtistList>`
-  `/artists/:id`: `<ArtistDetail>`
-  `/artists/create`: `<ArtistCreate>`
-  `/artists/:id/songs`: `<SongList>`
-  `/artists/:id/songs/:songId`: `<SongDetail>`
-  `/profile`: `<Profile>`
-  `/organization`: `<Organization>`

The `<Resource>` component allows react-admin to automatically link CRUD pages between them, including those for related entities. This approach allows you to think about your application in terms of entities, rather than getting bogged down by managing routes.

## Providers

React-admin doesn't make any assumption about your API. Instead, react-admin defines its own syntax for data fetching, authentication, internationalization, and preferences. It relies on adapters to translate the queries to your API. These adapters are called **providers**.

<img class="no-shadow" src="./img/providers.png" alt="Providers" />

For instance, to fetch a list of records from the API, react-admin uses the `dataProvider` object:

```jsx
dataProvider.getList('posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
    filter: { author_id: 12 },
}).then(response => {
    console.log(response);
});
// {
//     data: [
//         { id: 452, title: "Harry Potter Cast: Where Now?", author_id: 12 },
//         { id: 384, title: "Hermione: A Feminist Icon", author_id: 12 },
//         { id: 496, title: "Marauder's Map Mysteries", author_id: 12 },
//         { id: 123, title: "Real-World Roots of Wizard Spells", author_id: 12 },
//         { id: 189, title: "Your True Hogwarts House Quiz", author_id: 12 },
//     ],
//     total: 27
// }
```

How the `dataProvider.getList()` method translates to an HTTP request is up to the data provider. For instance, when using the REST data provider, the above code will translate to:

```
GET http://path.to.my.api/posts?sort=["title","ASC"]&range=[0, 4]&filter={"author_id":12}

HTTP/1.1 200 OK
Content-Type: application/json
Content-Range: posts 0-4/27
[
    { id: 452, title: "Harry Potter Cast: Where Now?", author_id: 12 },
    { id: 384, title: "Hermione: A Feminist Icon", author_id: 12 },
    { id: 496, title: "Marauder's Map Mysteries", author_id: 12 },
    { id: 123, title: "Real-World Roots of Wizard Spells", author_id: 12 },
    { id: 189, title: "Your True Hogwarts House Quiz", author_id: 12 },
]
```

React-admin comes with [more than 50 data providers](./DataProviderList.md) for various backends, including REST, GraphQL, Firebase, Django REST Framework, API Platform, etc. And if these providers don't work for your API, you can easily [develop a custom one](./DataProviderWriting.md).

This explains why react-admin components don't call `fetch` or `axios` directly. Instead, they rely on the data provider to fetch data from the API. Your own components should do the same, and use the [data provider hooks](./Actions.md), like [`useGetList`](./useGetList.md):

```jsx
import { useGetList } from 'react-admin';

const MyComponent = () => {
    const { data, total, loading, error } = useGetList('posts', {
        pagination: { page: 1, perPage: 5 },
        sort: { field: 'title', order: 'ASC' },
        filter: { author_id: 12 },
    });

    if (loading) return <Loading />;
    if (error) return <Error />;
    return (
        <div>
            <h1>Found {total} posts matching your query</h1>
            <ul>
                {data.map(record => (
                    <li key={record.id}>{record.title}</li>
                ))}
            </ul>
        </div>
    )
};
```

`useGetList` does a lot more than a simple `fetch`: it manages user credentials, triggers the loading indicator, controls the loading state, handles errors, caches the result for later use, controls the shape of the data, etc.

Whenever you need to communicate with a server, you will use the providers. As they are specialized in their domain and tightly integrated with react-admin, they will save you a lot of time.

## Smart Components

React-admin was built to avoid rewriting the same code and over again, because most web applications follow the same concepts. It has done this through a library of React components ([more than 150 components to date](./Reference.md#components)). Most of these are **smart components** that not only render HTML but also fetch data, encapsulate state, and interact with the rest of the application.

<a href="./img/components.webp"><img class="no-shadow" src="./img/components.webp" alt="Smart components" /></a>

React-admin isn't a UI Kit like Material UI or Bootstrap. It's a framework that goes beyond presentation to provide building blocks for data-driven applications. It is built on top of Material UI, but you don't need to know Material UI to start using react-admin.

For instance, to write a custom menu for your application, you will use the `<Menu>` component:

```jsx
// in src/MyMenu.js
import { Menu } from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.ResourceItem name="posts" />
        <Menu.ResourceItem name="comments" />
        <Menu.ResourceItem name="users" />
        <Menu.Item to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />}/>
    </Menu>
);
```

`<Menu.DashboardItem />` links to the `/dashboard` route, `<Menu.ResourceItem>` links to the `list` page defined in the resource configuration from the `<Resource>` component, and `<Menu.Item>` is a generic component that you can use to link to any route in your application. `<Menu>` reacts to changes on the application location, and it highlights the current route automatically. And if you use [Role-Based Access Control](./AuthRBAC.md), the user will only see the menu items they have access to.

So before writing your own component, try to think of a generic name for that component, and check if react-admin already provides it. In many cases, react-admin will save you hours, if not days, of development.

For instance, react-admin has components for:

- Guided tours
- Sub-forms
- Login screens
- Action buttons
- Calendars
- ... and much more

Each react-admin component can be customized through props, children, and [theme](./Theming.md).

## Composition

React-admin tries to avoid as much as possible components that accept a huge number of props (we call these "God Components"). Instead, react-admin encourages composition: components accept subcomponents (either via children or via specific props) that handle a share of the logic.

For instance, you cannot pass a list of actions to the `<Edit>` view, but you can pass an `actions` component:

```jsx
import { Button } from '@mui/material';
import { TopToolbar, ShowButton } from 'react-admin';

export const PostEdit = () => (
    <Edit actions={<PostEditActions />}>
        ...
    </Edit>
);

const PostEditActions = () => (
    <TopToolbar>
        <ShowButton />
        <Button color="primary" onClick={customAction}>Custom Action</Button>
    </TopToolbar>
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

## Hooks

When you can't tweak a react-admin component via props, you can always use the lower-level API: hooks. In fact, react-admin is built on top of a headless library called `ra-core`, which is essentially made of hooks. These hooks hide the implementation details of the framework, so that you can focus on the business logic. It's perfectly normal to use react-admin hooks in your own components if the default UI doesn't fit your needs.  

For instance, the `<DeleteWithConfirmButton>` button renders a confirmation dialog when clicked, then calls the `dataProvider.delete()` method for the current record. If you want the same feature but with a different UI, you can use the `useDeleteWithConfirmController` hook:

{% raw %}
```jsx
const DeleteButton = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const {
        open,
        isLoading,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    } = useDeleteWithConfirmController({ redirect: 'list' });

    return (
        <Fragment>
            <Button onClick={handleDialogOpen} label="ra.action.delete">
                {icon}
            </Button>
            <Confirm
                isOpen={open}
                loading={isLoading}
                title="ra.message.delete_title"
                content="ra.message.delete_content"
                translateOptions={{
                    name: resource,
                    id: record.id,
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};
```
{% endraw %}

The fact that this hook name ends with `Controller` is not a coincidence. It means that react-admin follows [the Model-View-Controller pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) for complex components. 

- The Controller logic is provided by React hooks (e.g. `useListController`).
- The view logic by React components (e.g. `<List>`).
- The model logic is up to the developer, and react-admin only forces the interface that the model must expose via its Providers.

React-admin exposes [dozens of hooks](./Reference.md#hooks) to help you build your own components. You can even build an entire react-admin application without ever using the material-ui components, and use another UI kit instead.

## Context: Pull, Don't Push

Communicating between components is a common problem in React applications. This is especially true in large applications, where you have to pass props down several levels. React-admin solves this problem by using a pull model: components expose props to their descendants via a context, and descendants can use them via a custom hook.

Whenever a react-admin component fetches data or defines a callback, the component creates a context and puts the data and callback in it.

For instance, the `<Admin>` component creates an `I18NProviderContext`, which exposes the `translate` function. All components in the application can use the `useTranslate` hook, which reads the `I18NProviderContext`, to translate their labels and messages. 

```jsx
import { useTranslate } from 'react-admin';

export const MyHelloButton = ({ handleClick }) => {
    const translate = useTranslate();
    return (
        <button onClick={handleClick}>{translate('root.hello.world')}</button>
    );
};
```

In a similar way, the `<Show>` component fetches a record and exposes it via a `RecordContext`. Inside the `<Show>` component, you can use the `useRecordContext` hook to access the record - for instance to display a map of the record location.

```jsx
import { useRecordContext } from 'react-admin';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const LocationField = ({ source }) => {
    const record = useRecordContext(props); // use the RecordContext created by <Show>
    if (!record) return null;

    return (
        <MapContainer center={record[source]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={record[source]} />
        </MapContainer>
    );
};

const StoreShowPage = () => (
    <Show> {/* create a RecordContext */}
        <SimpleShowLayout>
            <TextField source="name" />
            <LocationField source="location" />
        </SimpleShowLayout>
    </Show>
)
```

This simple approach removes the need for a dependency injection system. 

So when you write a component that needs to access data or callbacks defined higher in the render tree, you can always find a context to get it. 

Contexts are one of the key concepts in React Admin. If you are not familiar with them, do not hesitate to read the [React documentation on Context](https://react.dev/learn/passing-data-deeply-with-context).

## Batteries Included But Removable

You can build very complex web apps with react-admin components alone, as long as the react-admin design choices fit yours. But if you need to customize the behavior of a component beyond its existing capabilities, you can always replace a react-admin component with your own.

For instance, if [`<SimpleShowLayout>`](./SimpleShowLayout.md) doesn't let you lay out the details of a contact in the following way:

![contact details](./img/atomic-crm.png)

You can always use your own layout component:

{% raw %}
```tsx
export const ContactShow = () => (
    <ShowBase>
        <ContactShowContent />
    </ShowBase>
);

const ContactShowContent = () => {
    const { record, isLoading } = useShowContext<Contact>();
    if (isLoading || !record) return null;
    return (
        <Box mt={2} display="flex">
            <Box flex="1">
                <Card>
                    <CardContent>
                        <Box display="flex">
                            <Avatar />
                            <Box ml={2} flex="1">
                                <Typography variant="h5">
                                    {record.first_name} {record.last_name}
                                </Typography>
                                <Typography variant="body2">
                                    {record.title} at{' '}
                                    <ReferenceField
                                        source="company_id"
                                        reference="companies"
                                        link="show"
                                    >
                                        <TextField source="name" />
                                    </ReferenceField>
                                </Typography>
                            </Box>
                            <Box>
                                <ReferenceField
                                    source="company_id"
                                    reference="companies"
                                    link="show"
                                >
                                    <LogoField />
                                </ReferenceField>
                            </Box>
                        </Box>
                        <ReferenceManyField
                            target="contact_id"
                            reference="contactNotes"
                            sort={{ field: 'date', order: 'DESC' }}
                        >
                            <NotesIterator showStatus reference="contacts" />
                        </ReferenceManyField>
                    </CardContent>
                </Card>
            </Box>
            <ContactAside />
        </Box>
    );
};
```
{% endraw %}

This example comes from [Atomic CRM](https://marmelab.com/react-admin-crm/#/contacts), one of the react-admin demo applications. 

Never hesitate to replace a react-admin component with your own. React-admin cannot cover all use cases, it provides hooks to plug in your own components, and "It's just React"™.

React-admin will never lock you in a corner.

## User Experience Is King

React-admin has two sets of users:

- End users, who use the react-admin app in their browser
- Developers, who use the react-admin code in their IDE

For each feature, we design the User Experience (UX) and the Developer Experience (DX) carefully. 

For the visual part, react-admin builds upon Material UI, which is the implementation of [Material Design](https://m3.material.io/), a carefully crafted design system for web and mobile apps. It's a great help to build usable, consistent user interfaces, but it's not enough. 

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

In react-admin v4, these libraries are called [react-query](https://tanstack.com/query/v3), [react-router](https://reactrouter.com/en/main), [react-hook-form](https://react-hook-form.com/), [Material UI](https://mui.com/), [emotion](https://emotion.sh/docs/introduction), [testing-library](https://testing-library.com/docs/react-testing-library/intro), [date-fns](https://date-fns.org/), and [lodash](https://lodash.com/).

When a new requirement arises, the react-admin teams always looks for an existing solution, and prefers integrating it rather than redeveloping it.

There is one constraint, though: all react-admin's dependencies must be compatible with the [MIT license](https://github.com/marmelab/react-admin/blob/master/LICENSE.md). 

## Minimal API Surface

Before adding a new hook or a new prop to an existing component, we always check if there isn't a simple way to implement the feature in pure React. If it's the case, then we don't add the new prop. We prefer to keep the react-admin API, code, test, and documentation simple. This choice is crucial to keep the learning curve acceptable, and the maintenance burden low.

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



## Backward Compatibility Is More Important Than New Features

None of us like to update the code of our apps just because an underlying library has published a breaking change. React-admin does its best to avoid losing developers' time.

Some components may have a weird API. That's probably for historical reasons. We prefer to keep the backward compatibility as high as possible - sometimes at the cost of API consistency.

The code of some components may seem convoluted for no apparent reason. It's probably that the component has to support both the old and the new syntax.

This backward compatibility costs a lot in maintenance to the react-admin core team, but it's a huge time saver for react-admin users.

## Principle of Least Surprise

Because we favor [composition](#composition), you should be able to combine react-admin components in all sorts of ways, and it should just work (thanks to [contexts](#context-pull-dont-push)). We have an extensive test suite to ensure that the react-admin components work well together. And TypeScript helps you determine when you are using a component in a way that doesn't make sense.

This leads to strong design choices in the react-admin code.

One of them concerns child inspection, which we tend to avoid at all costs. A counter example is `<Datagrid>`, which inspects its Field children at runtime to determine the column headers. This has serious drawbacks:

- If the child is wrapped inside another component that doesn't use the same API, the feature breaks
- Developers expect that a component affects its subtree, not its ancestors. This leads to inexplicable bugs.

We keep child inspection in `<Datagrid>` because there is no better alternative, but it's a rare exception. Every time we implemented child inspection, we regretted it afterward. 

To avoid surprises, we also avoid `React.cloneElement()`, and passing props down the tree.

## Principle Of Least Documentation

No one reads docs. It's an unfortunate fact that we have learned to live with.

So when we design a new feature, we try to do it in the most intuitive way for developers. We keep the API minimal ([see above](#minimal-api-surface)). We copy the API of well-known libraries. We throw errors with helpful and explicit messages. We provide TypeScript types and JSDoc to help developers discover the API from within their IDE. We publish live examples with commented code.

But because react-admin is a very large library, it also has a lengthy documentation. We cover many, many use cases, and our documentation goes beyond basic usage instructions and API description. And to be sure you find the right information quickly, we often duplicate the same information in several places. We believe in the power of [serendipity](https://en.wikipedia.org/wiki/Serendipity).

Don't be afraid if this documentation seems overwhelming at first. You don't need to read it all. You can start with the Introduction chapter of each section, and read the code of the demos. After a while, you'll get used to the react-admin API, and you'll be able to find the information you need quickly.

## Monorepo

Whenever you import a react-admin component, it's from the `react-admin` package:

```jsx
import { List, Datagrid, TextField } from 'react-admin';
```

But if you look at [the react-admin source code](https://github.com/marmelab/react-admin) (which we encourage you to do), you will find imports like:

```jsx
import { useListController } from 'ra-core';
```

In fact, the `react-admin` package only re-exports components from internal packages. React-admin is a *distribution* of several packages, each of which handles a specific feature. The packages are all located in [the `packages/` directory](https://github.com/marmelab/react-admin/tree/master/packages). The most notable packages are:
    
* `ra-core`: The core react-admin logic, without any UI.
* `ra-ui-materialui`: The Material UI skin for react-admin.
* `ra-data-*`: Data providers for various data backends.
* `ra-language-*`: Interface translations for various languages.
* `react-admin`: the standard distribution of react-admin

You can build your own distribution of react-admin by combining different packages. You can also import hooks and components directly from one of these packages, if you don't want to import the whole react-admin distribution.


