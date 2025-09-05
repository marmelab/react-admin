---
title: "General Concepts"
sidebar:
  order: 1
---

Ra-core relies on a several design decisions that structure its codebase.

## Single-Page Application

Ra-core is specifically designed to build [Single-Page Applications (SPA)](https://en.wikipedia.org/wiki/Single-page_application). In a ra-core app, the browser fetches the required HTML, CSS, and JavaScript to render the application only once. Subsequently, data is fetched from APIs through AJAX calls. This is in contrast to traditional web applications, where the browser fetches a new HTML page for each screen.

<img class="no-shadow" src="../img/SPA-lifecycle.png" alt="SPA lifecycle" />

The SPA architecture ensures that ra-core apps are [exceptionally fast](./Features.md#fast), easy to host, and compatible with existing APIs without requiring a dedicated backend. 

To achieve this, ra-core utilizes an internal router, powered by `react-router`, to display the appropriate screen when the user clicks on a link. Developers can define routes using the [`<Resource>`](./Resource.md) component for CRUD routes and the [`<CustomRoutes>`](./CustomRoutes.md) component for other routes.

For example, the following ra-core application:

```jsx
import { CoreAdmin, Resource, CustomRoutes } from 'ra-core';
import { Route } from 'react-router-dom';

export const App = () => (
    <CoreAdmin dataProvider={dataProvider}>
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
    </CoreAdmin>
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

The `<Resource>` component allows ra-core to automatically link CRUD pages between them, including those for related entities. This approach allows you to think about your application in terms of entities, rather than getting bogged down by managing routes.

## Providers

Ra-core does not make any assumptions about the specific structure of your API. Instead, it defines its own syntax for data fetching, authentication, internationalization, and preferences. To interact with your API, ra-core relies on adapters called **providers**.

<img class="no-shadow" src="../img/providers.png" alt="Providers" />

For example, to fetch a list of records from the API, you would use the `dataProvider` object as follows:

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

The `dataProvider.getList()` method is responsible for translating this request into the appropriate HTTP request to your API. When using the REST data provider, the above code will translate to:

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

Ra-core comes with [more than 50 data providers](./DataProviderList.md) for various backends, including REST, GraphQL, Firebase, Django REST Framework, API Platform, and more. If these providers do not suit your API, you have the flexibility to [develop a custom provider](./DataProviderWriting.md).

This approach is why ra-core components do not call `fetch` or `axios` directly. Instead, they rely on the data provider to fetch data from the API. Similarly, it is recommended that your custom components follow the same pattern and utilize [data provider hooks](./Actions.md), such as [`useGetList`](./useGetList.md):

```jsx
import { useGetList } from 'ra-core';

const MyComponent = () => {
    const { data, total, isLoading, error } = useGetList('posts', {
        pagination: { page: 1, perPage: 5 },
        sort: { field: 'title', order: 'ASC' },
        filter: { author_id: 12 },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
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

By using `useGetList`, you gain various benefits beyond a simple `fetch`: it handles user credentials, triggers loading indicators, manages loading states, handles errors, caches results for future use, and controls the data shape, among other things.

Whenever you need to communicate with a server, you will use these providers. Since they are specialized for their respective domains and tightly integrated with ra-core, they will save you a significant amount of time and effort.

## Composition

Ra-core avoids components that accept an overwhelming number of props, which are often referred to as "God Components." Instead, ra-core encourages the use of composition, where components accept subcomponents (either through children or specific props) to handle a share of the logic.

For example, while you cannot directly pass a custom menu to the `<CoreAdmin>` component, you can achieve the same result by passing a `layout` component, containing the menu:

```jsx
// in src/MyLayout.js
import { useResourceDefinitions } from 'ra-core';

export const MyLayout = ({ children }) => {
    const resources = useResourceDefinitions();
    
    return (
        <div className="admin-layout">
            <nav>
                {Object.keys(resources).map(name => (
                    <a key={name} href={`/${name}`}>{name}</a>
                ))}
            </nav>
            <main>{children}</main>
        </div>
    );
};

// in src/App.js
import { CoreAdmin } from 'ra-core';
import { MyLayout }  from './MyLayout';

const App = () => (
    <CoreAdmin layout={MyLayout} dataProvider={...}>
        // ...
    </CoreAdmin>
);
```

This approach enables you to override specific parts of the logic of a component by composing it with another component.

The trade-off with this approach is that sometimes ra-core may require you to override several components just to enable one specific feature.

Although this drawback exists, we accept it because the use of composition in ra-core makes the components highly extensible, and it significantly improves the readability and maintainability of the code.

## Hooks

The `ra-core` library consists primarily of hooks. These hooks hide the framework's implementation details, allowing you to focus on your business logic. They play a central role in any UI implementation of ra-core, but they can also come in handy to users if the default UI doesn't meet their specific requirements. 

For example, in React Admin, the [`<DeleteButton>`](https://marmelab.com/react-admin/DeleteButton.html) used in `pessimistic` mode renders a confirmation dialog when clicked and then calls the `dataProvider.delete()` method for the current record. If you want the same feature but with a different UI, you can use the `useDeleteWithConfirmController` hook:

```jsx
import { useResourceContext, useRecordContext, useDeleteWithConfirmController } from 'ra-core';
import { Fragment } from 'react';

const DeleteButton = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const {
        open,
        isPending,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    } = useDeleteWithConfirmController({ redirect: 'list' });

    return (
        <Fragment>
            <button onClick={handleDialogOpen}>
                Delete
            </button>
            {open && (
                <div className="confirm-dialog">
                    <p>Are you sure you want to delete this {resource}?</p>
                    <button onClick={handleDelete} disabled={isPending}>
                        {isPending ? 'Deleting...' : 'Confirm'}
                    </button>
                    <button onClick={handleDialogClose}>Cancel</button>
                </div>
            )}
        </Fragment>
    );
};
```

The fact that hook names often end with `Controller` is intentional and reflects the use of [the Model-View-Controller (MVC) pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) for complex components in ra-core. 

Ra-core exposes dozens of hooks to assist you in building your own components. You can construct an entire admin application using only the headless ra-core package and any UI library of your choice (see for instance [shadcn-admin-kit](https://github.com/marmelab/shadcn-admin-kit), a library for building admin apps with Shadcn UI). This flexibility allows you to tailor the application to your specific needs and preferences.

## Context: Pull, Don't Push

Communication between components can be challenging, especially in large React applications, where passing props down several levels can become cumbersome. Ra-core addresses this issue using a pull model, where components expose props to their descendants via a context, and descendants can consume these props using custom hooks.

Whenever a ra-core component fetches data or defines a callback, it creates a context and places the data and callback in it.

For instance, the `<CoreAdmin>` component creates an `I18NProviderContext`, which exposes the `translate` function. All components in the application can utilize the `useTranslate` hook, which reads the `I18NProviderContext`, for translating labels and messages. 

```jsx
import { useTranslate } from 'ra-core';

export const MyHelloButton = ({ handleClick }) => {
    const translate = useTranslate();
    return (
        <button onClick={handleClick}>{translate('root.hello.world')}</button>
    );
};
```

Similarly, the `<ShowBase>` component fetches a record and exposes it via a `RecordContext`. Inside the `<ShowBase>` component, you can use the `useRecordContext` hook to access the record data. For example, you can use it to display a map of the record's location.

```jsx
import { ShowBase, useRecordContext } from 'ra-core';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { TextField } from './TextField';

const LocationField = ({ source }) => {
    // use the RecordContext created by <ShowBase>
    const record = useRecordContext(props);
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
    <ShowBase> {/* create a RecordContext */}
        <div>
            <TextField source="name" />
            <LocationField source="location" />
        </div>
    </ShowBase>
)
```

This approach eliminates the need for a dependency injection system and provides an elegant solution to access data and callbacks from higher levels in the render tree.

So when you write a component that needs to access data or callbacks defined higher in the render tree, you can always find a context to get it. 

Contexts are fundamental concepts in React Admin. If you are not familiar with them, don't hesitate to read the [React documentation on Context](https://react.dev/learn/passing-data-deeply-with-context). Understanding contexts will greatly enhance your understanding of how ra-core leverages them to create a powerful and flexible framework.
