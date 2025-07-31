---
title: "Key Concepts"
---

React-admin relies on a several design decisions that structure its codebase.

## Single-Page Application

React-admin is specifically designed to build [Single-Page Applications (SPA)](https://en.wikipedia.org/wiki/Single-page_application). In a react-admin app, the browser fetches the required HTML, CSS, and JavaScript to render the application only once. Subsequently, data is fetched from APIs through AJAX calls. This is in contrast to traditional web applications, where the browser fetches a new HTML page for each screen.

![SPA lifecycle](../../../../assets/SPA-lifecycle.png)

The SPA architecture ensures that react-admin apps are [exceptionally fast](./Features.md#fast), easy to host, and compatible with existing APIs without requiring a dedicated backend. 

To achieve this, react-admin utilizes an internal router, powered by `react-router`, to display the appropriate screen when the user clicks on a link. Developers can define routes using the [`<Resource>`](./Resource.md) component for CRUD routes and the [`<CustomRoutes>`](./CustomRoutes.md) component for other routes.

For example, the following react-admin application:

```jsx
import { CoreAdminContext, CoreAdminUI, Resource, CustomRoutes } from 'ra-core';
import { Route } from 'react-router-dom';

export const App = () => (
    <CoreAdminContext dataProvider={dataProvider}>
        <CoreAdminUI>
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
        </CoreAdminUI>
    </CoreAdminContext>
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

React-admin does not make any assumptions about the specific structure of your API. Instead, it defines its own syntax for data fetching, authentication, internationalization, and preferences. To interact with your API, react-admin relies on adapters called **providers**.

![Providers](../../../../assets/providers.png)

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

React-admin comes with [more than 50 data providers](./DataProviderList.md) for various backends, including REST, GraphQL, Firebase, Django REST Framework, API Platform, and more. If these providers do not suit your API, you have the flexibility to [develop a custom provider](./DataProviderWriting.md).

This approach is why react-admin components do not call `fetch` or `axios` directly. Instead, they rely on the data provider to fetch data from the API. Similarly, it is recommended that your custom components follow the same pattern and utilize [data provider hooks](./Actions.md), such as [`useGetList`](./useGetList.md):

```jsx
import { useGetList } from 'ra-core';

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

By using `useGetList`, you gain various benefits beyond a simple `fetch`: it handles user credentials, triggers loading indicators, manages loading states, handles errors, caches results for future use, and controls the data shape, among other things.

Whenever you need to communicate with a server, you will use these providers. Since they are specialized for their respective domains and tightly integrated with react-admin, they will save you a significant amount of time and effort.

## Composition

React-admin avoids components that accept an overwhelming number of props, which are often referred to as "God Components." Instead, react-admin encourages the use of composition, where components accept subcomponents (either through children or specific props) to handle a share of the logic.

This approach enables you to override specific parts of the logic of a component by composing it with another component.

For instance, the `<CanAccess>` component accepts an `accessDenied` prop that allows you to define what to render when users don't have the required permissions:

```jsx
import { CanAccess } from 'ra-core';
import { PremiumStatsFeature } from './PremiumStatsFeature';
import { UpgradeToPremium } from './UpgradeToPremium';

export const Dashboard = ({ children }) => (
    <div>
        <CanAccess accessDenied={<UpgradeToPremium />}>
            <PremiumStatsFeature />
        </CanAccess>
    </div>
);
```

## Hooks

`ra-core` consists of hooks and headless components that hide the framework's implementation details, allowing you to focus on your business logic.

For example, the `useDeleteWithConfirmController` button used in `pessimistic` mode renders a confirmation dialog when clicked and then calls the `dataProvider.delete()` method for the current record. If you want the same feature but with a different UI, you can use the `useDeleteWithConfirmController` hook:

```jsx
import { useDeleteWithConfirmController, useRecordContext, useResourceContext } from 'ra-core';
import { Button, Confirm } from 'my-awesome-ui-library';

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
            <Button onClick={handleDialogOpen} label="ra.action.delete">
                {icon}
            </Button>
            <Confirm
                isOpen={open}
                loading={isPending}
                title="ra.message.delete_title"
                content="ra.message.delete_content"
                titleTranslateOptions={{
                    name: resource,
                    id: record.id,
                }}
                contentTranslateOptions={{
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

The fact that hook names often end with `Controller` is intentional and reflects the use of [the Model-View-Controller (MVC) pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) for complex components in react-admin. 

- The Controller logic is handled by React hooks (e.g. `useDeleteWithConfirmController`).
- The view logic is managed by React components (e.g. `<DeleteButton>`).
- The model logic is left to the developer, and react-admin simply defines the interface that the model must expose through its Providers.

React-admin exposes [dozens of hooks](./Reference.md#hooks) to assist you in building your own components. You can construct an entire react-admin application by using one of our UI packages such as `ra-ui-materialui` for Material UI components or [shadcn-admin-kit](https://github.com/marmelab/shadcn-admin-kit) for Shadcn UI or build your own UI layer. This flexibility allows you to tailor the application to your specific needs and preferences.

## Context: Pull, Don't Push

Communication between components can be challenging, especially in large React applications, where passing props down several levels can become cumbersome. React-admin addresses this issue using a pull model, where components expose props to their descendants via a context, and descendants can consume these props using custom hooks.

Whenever a react-admin component fetches data or defines a callback, it creates a context and places the data and callback in it.

For instance, the `<CoreAdminContext>` component creates an `I18NProviderContext`, which exposes the `translate` function. All components in the application can use the `useTranslate` hook or the `<Translate>` component, which reads the `I18NProviderContext`, for translating labels and messages. 

```jsx
import { Translate, useTranslate } from 'ra-core';

export const MyHelloButton = () => {
    const translate = useTranslate();
    const handleClick = () => {
        alert(translate('root.button.hello_world.message'))
    }
    return (
        <button onClick={handleClick}>
            <Translate i18nKey="root.button.hello_world.label">
        </button>
    );
};
```

Similarly, the `<ShowBase>` component fetches a record and exposes it via a `RecordContext`. Inside the `<ShowBase>` component, you can use the `useRecordContext` hook to access the record data. For example, you can use it to display a map of the record's location.

```jsx
import { ShowBase, useRecordContext } from 'ra-core';
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
    <ShowBase> {/* create a RecordContext */}
        <div className="flex flex-col gap-6">
            <LocationField source="location" />
        </div>
    </ShowBase>
)
```

This approach eliminates the need for a dependency injection system and provides an elegant solution to access data and callbacks from higher levels in the render tree.

So when you write a component that needs to access data or callbacks defined higher in the render tree, you can always find a context to get it. 

Contexts are fundamental concepts in React Admin. If you are not familiar with them, don't hesitate to read the [React documentation on Context](https://react.dev/learn/passing-data-deeply-with-context). Understanding contexts will greatly enhance your understanding of how react-admin leverages them to create a powerful and flexible framework.

## Awesome Developer Experience

With react-admin, developers assemble application components without having to worry about low-level details. They need less code for the same result, and they can **focus on the business logic** of their app.

We've crafted the API of react-admin's components and hooks to be as **intuitive** as possible. The react-admin core team uses react-admin every day, and we're always looking for ways to improve the developer experience.

React-admin provides the **best-in-class documentation**, demo apps, and support. Error messages are clear and actionable. Thanks to extensive TypeScript types and JSDoc, it's easy to use react-admin in any IDE. The API is stable and **breaking changes are very rare**. You can debug your app with the [query](./DataProviders.md#enabling-query-logs) and [form](https://react-hook-form.com/dev-tools) developer tools, and inspect the react-admin code right in your browser.

That probably explains why more than 3,000 new apps are published every month using react-admin.

So react-admin is not just the assembly of [React Query](https://react-query.tanstack.com/), [react-hook-form](https://react-hook-form.com/) and [react-router](https://reacttraining.com/react-router/). It's a **framework** made to speed up and facilitate the development of single-page apps in React.