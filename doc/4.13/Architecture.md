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

React-admin does not make any assumptions about the specific structure of your API. Instead, it defines its own syntax for data fetching, authentication, internationalization, and preferences. To interact with your API, react-admin relies on adapters called **providers**.

<img class="no-shadow" src="./img/providers.png" alt="Providers" />

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

By using `useGetList`, you gain various benefits beyond a simple `fetch`: it handles user credentials, triggers loading indicators, manages loading states, handles errors, caches results for future use, and controls the data shape, among other things.

Whenever you need to communicate with a server, you will use these providers. Since they are specialized for their respective domains and tightly integrated with react-admin, they will save you a significant amount of time and effort.

## Smart Components

React-admin was built to avoid rewriting the same code and over again, because most web applications use the same basic building blocks. It provides a library of React components ([more than 150 components to date](./Reference.md#components)). Most of these are **smart components** as they not only handle rendering HTML but also take care of data fetching, state management, and interaction within the application.

<a href="./img/components.webp"><img class="no-shadow" src="./img/components.webp" alt="Smart components" /></a>

It's important to note that react-admin is not merely a UI Kit like Material UI or Bootstrap. It goes beyond presentation to offer building blocks specifically tailored for data-driven applications. While it is built on top of Material UI, you don't need to be familiar with Material UI to use react-admin effectively.

For example, to create a custom menu for your application, you can utilize the `<Menu>` component:

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

In this example, `<Menu.DashboardItem>` links to the `/dashboard` route, `<Menu.ResourceItem>` links to the `list` page defined in the resource configuration from the `<Resource>` component, and `<Menu.Item>` is a generic component that you can use to link to any route in your application. The `<Menu>` component automatically responds to changes on the application location and highlights the current route. Additionally, if you use [Role-Based Access Control](./AuthRBAC.md), users will only see the menu items they have access to.

Before creating your custom component, it's a good practice to check if react-admin already provides a suitable component with a generic name for your purpose. In many cases, react-admin can save you hours, if not days, of development effort.

Some of the other useful react-admin components include those for guided tours, sub-forms, login screens, action buttons, calendars, and much more. Each react-admin component can be customized using props, children, and [theme](./Theming.md) to fit your application's specific needs.

## Composition

React-admin follows the principle of avoiding components that accept an overwhelming number of props, which are often referred to as "God Components." Instead, react-admin encourages the use of composition, where components accept subcomponents (either through children or specific props) to handle a share of the logic.

For example, while you cannot directly pass a list of actions to the `<Edit>` component, you can achieve the same result by passing an `actions` component:

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

This approach enables you to override specific parts of the logic of a component by composing it with another component.

Many react-admin components can be easily customized by passing custom components as children or through props.

The trade-off with this approach is that sometimes react-admin may require you to override several components just to enable one specific feature. For instance, to override the Menu, you must pass a custom Menu component to a custom `<Layout>`, and pass that custom `<Layout>` to the `<Admin>` component:

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

Although this drawback exists, we accept it because the use of composition in react-admin makes the components highly extensible, and it significantly improves the readability and maintainability of the code.

## Hooks

When you find that you cannot tweak a react-admin component using props, you can always turn to the lower-level API: hooks. In fact, react-admin is built on top of a headless library called `ra-core`, which primarily consists of hooks. These hooks hide the framework's implementation details, allowing you to focus on your business logic. It's perfectly normal to use react-admin hooks in your own components if the default UI doesn't meet your specific requirements.

For example, the `<DeleteWithConfirmButton>` button renders a confirmation dialog when clicked and then calls the `dataProvider.delete()` method for the current record. If you want the same feature but with a different UI, you can use the `useDeleteWithConfirmController` hook:

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

The fact that hook names often end with `Controller` is intentional and reflects the use of [the Model-View-Controller (MCV) pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) for complex components in react-admin. 

- The Controller logic is handled by React hooks (e.g. `useListController`).
- The view logic is managed by React components (e.g. `<List>`).
- The model logic is left to the developer, and react-admin simply defines the interface that the model must expose through its Providers.

React-admin exposes [dozens of hooks](./Reference.md#hooks) to assist you in building your own components. You can even construct an entire react-admin application without relying on the Material UI components and use a different UI kit if desired. This flexibility allows you to tailor the application to your specific needs and preferences.

## Context: Pull, Don't Push

Communication between components can be challenging, especially in large React applications, where passing props down several levels can become cumbersome. React-admin addresses this issue using a pull model, where components expose props to their descendants via a context, and descendants can consume these props using custom hooks.

Whenever a react-admin component fetches data or defines a callback, it creates a context and places the data and callback in it.

For instance, the `<Admin>` component creates an `I18NProviderContext`, which exposes the `translate` function. All components in the application can utilize the `useTranslate` hook, which reads the `I18NProviderContext`, for translating labels and messages. 

```jsx
import { useTranslate } from 'react-admin';

export const MyHelloButton = ({ handleClick }) => {
    const translate = useTranslate();
    return (
        <button onClick={handleClick}>{translate('root.hello.world')}</button>
    );
};
```

Similarly, the `<Show>` component fetches a record and exposes it via a `RecordContext`. Inside the `<Show>` component, you can use the `useRecordContext` hook to access the record data. For example, you can use it to display a map of the record's location.

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

This approach eliminates the need for a dependency injection system and provides an elegant solution to access data and callbacks from higher levels in the render tree.

So when you write a component that needs to access data or callbacks defined higher in the render tree, you can always find a context to get it. 

Contexts are fundamental concepts in React Admin. If you are not familiar with them, don't hesitate to read the [React documentation on Context](https://react.dev/learn/passing-data-deeply-with-context). Understanding contexts will greatly enhance your understanding of how react-admin leverages them to create a powerful and flexible framework.

## Batteries Included But Removable

React-admin allows you to build sophisticated web applications using only its built-in components, assuming that its design choices align with your needs. However, if you find that a component's existing capabilities don't meet your specific requirements, you're free to replace it with a custom component.

For example, if [`<SimpleShowLayout>`](./SimpleShowLayout.md) doesn't allow you to arrange the details of a contact as depicted in the image below:

![contact details](./img/atomic-crm.png)

You can create and use your own layout component:

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

This particular example is sourced from [Atomic CRM](https://marmelab.com/react-admin-crm/#/contacts), one of the many [demo applications](./Demos.md) available for react-admin. 

Never hesitate to replace a react-admin component with one of your own design. React-admin does not aim to cover all possible use cases, instead, it provides hooks for incorporating custom components. After all, "It's just React"™.

With react-admin, you'll never find yourself backed into a corner.

## User Experience Is King

React-admin has two distinct sets of users:

- End users, who use the react-admin app in their browser
- Developers, who work with the react-admin code in their IDE

We meticulously design both the User Experience (UX) and the Developer Experience (DX) for each feature.

For the visual part, react-admin builds upon Material UI, which is a practical implementation of [Material Design](https://m3.material.io/). This design system is painstakingly constructed for web and mobile apps and serves as an excellent foundation for creating user-friendly, consistent user interfaces. However, it's only part of the story.

We invest considerable time fine-tuning the UI to be as intuitive as possible. Small alignment discrepancies, screen flashes, and color inconsistencies are under constant scrutiny. We continually iterate based on customer feedback, working diligently to resolve any visual and animation issues that arise in real-world applications.

By default, react-admin produces a purposefully bland user interface because we want the focus to be on the content rather than the aesthetics.

<video controls autoplay playsinline muted loop>
  <source src="./img/sort-button.webm" type="video/webm"/>
  <source src="./img/sort-button.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


Regarding the developer experience, react-admin is always evolving to strike the right balance between an intuitive API, advanced features, a reasonable level of abstraction, and comprehensive documentation. The core team members are the initial testers of react-admin, focusing on productivity, debuggability, discoverability, performance, and reliability of all hooks and components.

## Built On The Shoulders Of Giants

Many excellent open-source libraries already address partial requirements of B2B apps: data fetching, forms, UI components, testing, etc.

Rather than reinventing the wheel, react-admin uses the best tools in each category (in terms of features, developer experience, active maintenance, documentation, user base), and provides a glue around these libraries.

In react-admin v4, these libraries are called [react-query](https://tanstack.com/query/v3), [react-router](https://reactrouter.com/en/main), [react-hook-form](https://react-hook-form.com/), [Material UI](https://mui.com/), [emotion](https://emotion.sh/docs/introduction), [testing-library](https://testing-library.com/docs/react-testing-library/intro), [date-fns](https://date-fns.org/), and [lodash](https://lodash.com/).

When a new requirement arises, the react-admin teams always looks for an existing solution, and prefers integrating it rather than redeveloping it.

There is one constraint, though: all react-admin's dependencies must be compatible with the [MIT license](https://github.com/marmelab/react-admin/blob/master/LICENSE.md). 

## Minimal API Surface

Before introducing a new hook or adding a new prop to an existing component, we always consider whether there's a straightforward way to implement the feature using pure React. If it's feasible, we opt not to add the new prop. Our goal is to maintain simplicity in the react-admin API, code, testing, and documentation. This decision is critical to ensuring a manageable learning curve and a low maintenance burden.

Take the `<SimpleShowLayout>` component as an example, which displays Field elements in a column. Suppose you want to place two fields in a single column. We could introduce a specific syntax to indicate the number of elements per column and per line. However, this would overcomplicate the usage and documentation for simple use cases. Moreover, achieving this is quite doable in pure React, without necessitating any changes in the react-admin core. For instance, you can utilize Material UI's `<Stack>` component:

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

We believe this code snippet is simple enough for a React developer, so we chose not to add core support for multiple elements per line.

If you can't find a specific feature in the react-admin documentation, it's often because it can be quickly achieved using pure React.

## Backward Compatibility Is More Important Than New Features

Nobody enjoys updating their app's code simply because a foundational library has introduced a breaking change. React-admin makes a concerted effort to prevent such disruptions and the unnecessary time loss they cause for developers.

Some components may have peculiar APIs, often for historical reasons. We prioritize maintaining backward compatibility as much as possible, occasionally at the expense of API consistency.

The code for some components may seem unnecessarily complex. This usually happens when a component has to support both old and new syntaxes.

Maintaining this backward compatibility requires a significant effort from the react-admin core team, but it pays off by saving substantial time for react-admin users.

## Principle of Least Surprise

Due to our emphasis on [composition](#composition), you should be able to combine react-admin components in various ways and expect them to work seamlessly (courtesy of to [contexts](#context-pull-dont-push)). We have a comprehensive test suite to ensure that the react-admin components interact well together. Moreover, TypeScript assists in identifying if you're using a component in a manner that isn't supported.

These considerations lead to strong design choices in the react-admin code.

One notable example relates to child inspection, which we strive to avoid whenever possible. An exception is the `<Datagrid>` component, which inspects its Field children at runtime to determine the column headers. This practice has significant drawbacks:

- If a child is wrapped inside another component that doesn't follow the same API, the feature breaks
- Developers typically expect a component to affect its subtree, not its ancestors. Violating this expectation can lead to difficult-to-explain bugs.

We keep child inspection in `<Datagrid>` because there is no superior alternative, but it's an uncommon exception. Every time we've implemented child inspection, we regretted it later. 

To minimize surprises, we also avoid using `React.cloneElement()` and refrain from passing props down the tree.

## Principle Of Least Documentation

No one reads docs. This is an unfortunate reality that we have come to terms with.

Therefore, when designing a new feature, our priority is to make it as intuitive as possible for developers. We keep the API minimal ([see above](#minimal-api-surface)). We emulate the APIs of well-established libraries. We throw errors with clear and informative messages. To aid developers in discovering the API within their IDE, we provide TypeScript types and JSDoc. Furthermore, we publish live examples complemented by annotated code.

Despite this, given the extensive nature of react-admin, it inevitably comes with comprehensive documentation. We cover a wide variety of use cases, extending our documentation beyond mere usage instructions and API descriptions. To ensure that you find the information you need quickly, we frequently duplicate the same information in different places. We truly believe in the power of [serendipity](https://en.wikipedia.org/wiki/Serendipity).

If you find this documentation overwhelming at first, don't fret. There's no need to read everything all at once. Start with the Introduction chapter of each section and examine the demo codes. Over time, you'll become familiar with the react-admin API, and finding the information you need will become a breeze.

## Monorepo

Whenever you import a react-admin component, it's sourced from the `react-admin` package:

```jsx
import { List, Datagrid, TextField } from 'react-admin';
```

But if you peek at [the react-admin source code](https://github.com/marmelab/react-admin) (which we encourage you to do), you will find imports like:

```jsx
import { useListController } from 'ra-core';
```

That's because the `react-admin` package simply re-exports components from internal packages. React-admin is a *distribution* of several packages, each dedicated to a specific feature. These packages can be found in [the `packages/` directory](https://github.com/marmelab/react-admin/tree/master/packages). Some of the more notable packages include:
    
* `ra-core`: The core react-admin logic, without any UI.
* `ra-ui-materialui`: The Material UI skin for react-admin.
* `ra-data-*`: Data providers for various data backends.
* `ra-language-*`: Interface translations for various languages.
* `react-admin`: the standard distribution of react-admin

You can construct your own distribution of react-admin by combining various packages. Alternatively, you can import hooks and components directly from one of these packages if you don't want to import the entire react-admin distribution.


