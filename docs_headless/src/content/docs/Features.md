---
title: "Features"
sidebar:
  order: 9
  label: All Features
---

Ra-core is a **rich framework** that covers most of the needs of typical admin & B2B applications. Its headless core (ra-core) provides powerful business logic and data management capabilities without being tied to any specific UI library. This flexibility unlocks your creativity and helps you build great apps with your preferred UI library.

## Headless Core

Ra-core's strength lies in its **headless architecture**. The ra-core package provides all the business logic, data management, and state handling without being tied to any specific UI library. This allows you to use ra-core's powerful features with [Ant Design](https://ant.design/), [Daisy UI](https://daisyui.com/), [Chakra UI](https://chakra-ui.com/), [Shadcn UI](https://ui.shadcn.com/), or any custom UI library.

The **headless logic** behind ra-core is exposed via `...Base` components and controller hooks that you can use with any UI framework.

For instance, [`shadcn-admin-kit`](https://github.com/marmelab/shadcn-admin-kit) is a ra-core distribution that uses [Shadcn UI](https://ui.shadcn.com/) with ra-core's headless core.

[![Shadcn admin kit](https://github.com/marmelab/shadcn-admin-kit/raw/main/public/shadcn-admin-kit.webp)](https://github.com/marmelab/shadcn-admin-kit)

`shadcn-admin-kit` follows the same syntax conventions as ra-core, so most of the ra-core documentation still applies. For example, the `<ProductEdit>` component looks like this:

```tsx
import {
  AutocompleteInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "@/components/admin";
import { required } from "ra-core";

export const ProductEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="reference" label="Reference" validate={required()} />
      <ReferenceInput source="category_id" reference="categories">
        <AutocompleteInput label="Category" validate={required()} />
      </ReferenceInput>
      <TextInput source="width" type="number" />
      <TextInput source="height" type="number" />
      <TextInput source="price" type="number" />
      <TextInput source="stock" label="Stock" type="number" />
    </SimpleForm>
  </Edit>
);
```

Here is another example: a List view built with [Ant Design](https://ant.design/):

![List view built with Ant Design](../../img/list_ant_design.png)

It leverages the `useListController` hook:

```jsx
import { useListController } from 'ra-core'; 
import { Card, Table, Button } from 'antd';
import {
  CheckCircleOutlined,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const PostList = () => {
  const { data, page, total, setPage, isPending } = useListController({
    sort: { field: 'published_at', order: 'DESC' },
    perPage: 10,
  });
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
  };
  return (
    <>
      <div style={{ margin: 10, textAlign: 'right' }}>
        <Link to="/posts/create">
          <Button icon={<PlusOutlined />}>Create</Button>
        </Link>
      </div>
      <Card bodyStyle={{ padding: '0' }} loading={isPending}>
        <Table
          size="small"
          dataSource={data}
          columns={columns}
          pagination={{ current: page, pageSize: 10, total }}
          onChange={handleTableChange}
        />
      </Card>
    </>
  );
};

const columns = [
  { title: 'Id', dataIndex: 'id', key: 'id' },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  {
    title: 'Publication date',
    dataIndex: 'published_at',
    key: 'pub_at',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    title: 'Commentable',
    dataIndex: 'commentable',
    key: 'commentable',
    render: (value) => (value ? <CheckCircleOutlined /> : null),
  },
  {
    title: 'Actions',
    render: (_, record) => (
      <Link to={`/posts/${record.id}`}>
        <Button icon={<EditOutlined />}>Edit</Button>
      </Link>
    ),
  },
];

export default PostList;
```

Check the following hooks to learn more about headless controllers:

- [`useListController`](./useListController.md)
- [`useEditController`](./useEditController.md)
- [`useCreateController`](./useCreateController.md)
- [`useShowController`](./useShowController.md)

And for a more in-depth tutorial about using ra-core with your favorite UI library, check the following article: [Building an admin with DaisyUI, Tailwind CSS, Tanstack Table and React-Aria](https://marmelab.com/blog/2023/11/28/using-react-admin-with-your-favorite-ui-library.html).


## Awesome Developer Experience

With ra-core's headless core, developers assemble application components focusing on business logic rather than low-level data management details. The ra-core package provides all the essential hooks and controllers you need to build admin interfaces with any UI library.

We've crafted the API of ra-core's components and hooks to be as **intuitive** as possible. The ra-core core team uses ra-core every day, and we're always looking for ways to improve the developer experience.

Ra-core provides the **best-in-class documentation**, demo apps, and support. Error messages are clear and actionable. Thanks to extensive TypeScript types and JSDoc, it's easy to use ra-core in any IDE. The API is stable and **breaking changes are very rare**. You can debug your app with the [query](./DataProviders.md#enabling-query-logs) and [form](https://react-hook-form.com/dev-tools) developer tools, and inspect the ra-core code right in your browser.

That probably explains why more than 3,000 new apps are published every month using ra-core.

So ra-core is not just the assembly of [React Query](https://react-query.tanstack.com/), [react-hook-form](https://react-hook-form.com/), and [react-router](https://reacttraining.com/react-router/). It's a **framework** made to speed up and facilitate the development of single-page apps in React, with a headless core that can work with any UI library.

## Basic CRUD

Most admin and B2B apps start with a few basic screens to manipulate records:

- A list page, including the ability to filter, paginate and sort the records
- A read-only page, displaying the record details
- An edition page, allowing to update the record via a form
- A creation page

We call this type of interface a "CRUD" interface because it allows us to Create, Read, Update and Delete records.

Ra-core's headless core provides powerful components to generate such CRUD interfaces with any UI library. These components and hooks are tailored to be very easy to customize.

The basic building blocks of a CRUD interface in ra-core are:

- [`<Resource>`](./Resource.md), which defines CRUD routes for given API resource
- [`<ListBase>`](./ListBase.md), which provides headless list functionality
- [`<EditBase>`](./EditBase.md), which provides headless form editing functionality
- [`<CreateBase>`](./CreateBase.md), which provides headless form creation functionality
- [`<ShowBase>`](./ShowBase.md), which provides headless record display functionality

These headless components handle all the data fetching, state management, and business logic, while letting you build the UI with any components you prefer.

Of course, ra-core is not limited to CRUD interfaces. It also provides components to build tailored interfaces for your needs.

## Backend Agnostic

Ra-core apps run in the browser - they are "Single-Page Apps". They rely on APIs to fetch and update data.

Which kind of API? **All kinds**. Ra-core is backend agnostic. It doesn't care if your API is a REST API, a GraphQL API, a SOAP API, a JSON-RPC API, or even a local API. It doesn't care if your API is written in PHP, Python, Ruby, Java, or even JavaScript. It doesn't care if your API is a third-party API or a home-grown API.

Ra-core ships with [more than 50 adapters](./DataProviderList.md) for popular API flavors, and gives you all the tools to build your own adapter. This works thanks to a powerful abstraction layer called the [Data Provider](./DataProviders.md).

In a ra-core app, you don't write API Calls. Instead, you communicate with your API using a set of high-level functions, called "Data Provider methods". For instance, to fetch a list of posts, you call the `getList()` method, passing the resource name and the query parameters.

```jsx
import { useState, useEffect } from 'react';
import { useDataProvider } from 'ra-core';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState();
    const [isPending, setIsPending] = useState(true);
    const dataProvider = useDataProvider();
    useEffect(() => {
        dataProvider.getList('posts', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' },
            filter: { status: 'published' }
        })
            .then(({ data }) => setPosts(data))
            .catch(error => setError(error))
            .finally(() => setIsPending(false));
    }, []);
    if (isPending) { return <p>Loading</p>; }
    if (error) { return <p>ERROR</p>; }
    return (
        <ul>
            {posts.map(post => (
                <li key={post.id}>{post.title}</li>
            ))}
        </ul>
    );
};
```

The data provider object is responsible for translating the data provider method calls into HTTP requests, and for translating the HTTP responses into data provider method results.

And by the way, using `useEffect` for data fetching is cumbersome. Instead, you can rely on the [specialized data provider hooks](./Actions.md#query-hooks), such as `useGetList`:

```jsx
import { useGetList } from 'ra-core';

const PostList = () => {
    const { data, isPending, error } = useGetList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'published_at', order: 'DESC' },
        filter: { status: 'published' }
    });
    if (isPending) { return <div>Loading...</div>; }
    if (error) { return <div>ERROR</div>; }
    return (
        <ul>
            {data.map(post => (
                <li key={post.id}>{post.title}</li>
            ))}
        </ul>
    );
};
```

Ra-core is also **backend agnostic for authentication and authorization**. Whether your API uses JWT, OAuth, a third-party provider like Auth0 or Cognito, or even Microsoft Entra ID, you can communicate with the authentication backend through an adapter object called [the Auth Provider](./Authentication.md).

You can then use specialized hooks on your components to restrict access. For instance, to forbid anonymous access, use `useAuthenticated`:

```jsx
import { useAuthenticated } from 'ra-core';

const MyPage = () => {
    useAuthenticated(); // redirects to login if not authenticated
    return (
        <div>
            ...
        </div>
    )
};

export default MyPage;
```

## Relationships

APIs often expose a relational model, i.e. endpoints returning foreign keys to other endpoints. **Ra-core leverages relational APIs** to provide smart components that display related records and components that allow editing of related records.

```
┌──────────────┐       ┌────────────────┐
│ books        │       │ authors        │
│--------------│       │----------------│
│ id           │   ┌───│ id             │
│ author_id    │╾──┘   │ first_name     │
│ title        │       │ last_name      │
│ published_at │       │ date_of_birth  │
└──────────────┘       └────────────────┘
```

The ra-core package provides headless components like `<ReferenceFieldBase>` that handle the data fetching logic for related records:

```jsx
const BookList = () => (
    <ListBase>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author_id">
                <ReferenceFieldBase source="author_id" reference="authors">
                    <TextField source="name" />
                </ReferenceFieldBase>
            </DataTable.Col>
            <DataTable.Col source="year" />
        </DataTable>
    </ListBase>
);
```

![ReferenceField](../../img/reference-field-link.png)

You don't need anything fancy on the API side to support that. Simple CRUD routes for both the `books` and `authors` resources are enough. `<ReferenceFieldBase>` will fetch the book authors via one single API call:

```
GET https://my.api.url/authors?filter={ids:[1,2,3,4,5,6,7]}
```

`<ReferenceFieldBase>` is smart enough to **aggregate the calls for related authors** and avoid [the N+1 query problem](https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping), without the need for embeddings or sub-queries on the server-side.

Similarly, reference Input components let users update a reference. For instance, to edit the category of a product:

```jsx
const ProductEdit = () => (
    <EditBase>
        <Form>
            <TextInput source="name" />
            <NumberInput source="price" />
            <ReferenceInputBase source="category_id" reference="categories">
                <SelectInput optionText="name" />
            </ReferenceInputBase>
        </Form>
    </EditBase>
);
```

Reference Input components are also very useful to filter a view by a related record. For instance, to display the list of books of a given author:

```jsx
const BookList = () => (
    <ListBase>
        <div class="filters">
            <FilterLiveForm>
                <ReferenceInput source="authorId" reference="authors">
                    <SelectInput optionText="name" />
                </ReferenceInput>
            </FilterLiveForm>
        </div>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="authorId">
                <ReferenceFieldBase source="authorId" reference="authors">
                    <TextField source="name" />
                </ReferenceFieldBase>
            </DataTable.Col>
            <DataTable.Col source="year" />
        </DataTable>
    </ListBase>
);
```

<video controls autoplay playsinline muted loop width="100%">
  <source src="../img/reference-input-filter.webm" type="video/webm" />
  <source src="../img/reference-input-filter.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Ra-core supports **one-to-many**, **many-to-one** and **one-to-one relationships** through headless components available in ra-core:

- [`<ReferenceFieldBase>`](./ReferenceFieldBase.md)
- [`<ReferenceArrayFieldBase>`](./ReferenceArrayFieldBase.md)
- [`<ReferenceManyFieldBase>`](./ReferenceManyFieldBase.md)
- [`<ReferenceOneFieldBase>`](./ReferenceOneFieldBase.md)
- [`<ReferenceManyCountBase>`](./ReferenceManyCountBase.md)
- `<ReferenceInputBase>`
- `<ReferenceArrayInputBase>`

Reference components are a tremendous development accelerator for complex frontend features. They also liberate the backend developers from the burden of implementing complex joins.

To learn more about relationships, check out this tutorial: [Handling Relationships in React Admin](https://marmelab.com/blog/2025/02/06/handling-relationships-in-react-admin.html).

## Forms & Validation

Many admin apps let users perform complex tasks implying the update of many fields and records. To allow such complex workflows, developers must be able to build sophisticated forms, with elaborate validation rules.

Ra-core offers a **set of components and hooks** to build forms, powered by [react-hook-form](https://react-hook-form.com/). Ra-core's form component also takes care of binding the form values to the record being edited and validating the form inputs.

### Validation

Ra-core ships with a powerful and versatile validation engine.

![Validation example](../../img/validation.png)

Ra-core forms support the most common validation strategies:

- [per field validators](./Validation.md#per-input-validation-built-in-field-validators),
- [form validation](./Validation.md#global-validation),
- [validation schema powered by yup or zod](./Validation.md#schema-validation),
- [server-side validation](./Validation.md#server-side-validation).

Here is an example of per-field validation:

```jsx
import {
    CreateBase,
    Form,
    required,
    minLength,
    maxLength,
    minValue,
    maxValue,
    number,
    regex,
    email,
    choices
} from 'ra-core';
import { TextInput, SelectInput } from './Inputs';

const validateFirstName = [required(), minLength(2), maxLength(15)];
const validateEmail = email();
const validateAge = [number(), minValue(18)];
const validateZipCode = regex(/^\d{5}$/, 'Must be a valid Zip Code');
const validateGender = choices(['m', 'f', 'nc'], 'Please choose one of the values');

export const UserCreate = () => (
    <CreateBase>
        <Form>
            <TextInput label="First Name" source="firstName" validate={validateFirstName} />
            <TextInput label="Email" source="email" validate={validateEmail} />
            <TextInput label="Age" source="age" validate={validateAge}/>
            <TextInput label="Zip Code" source="zip" validate={validateZipCode}/>
            <SelectInput label="Gender" source="gender" choices={[
                { id: 'm', name: 'Male' },
                { id: 'f', name: 'Female' },
                { id: 'nc', name: 'Prefer not say' },
            ]} validate={validateGender}/>
        </Form>
    </CreateBase>
);
```

Ra-core provides a complete validation system that works with any UI library. The validation logic is separated from the UI components, making it perfect for headless applications.

### Dependent Inputs

You can build dependent inputs, using the [react-hook-form's `useWatch` hook](https://react-hook-form.com/docs/usewatch). For instance, here is a `CityInput` that displays the cities of the selected country:

```jsx
import * as React from 'react';
import { EditBase, Form } from 'ra-core';
import { useWatch } from 'react-hook-form';
import { SelectInput } from './SelectInput';

const countries = ['USA', 'UK', 'France'];
const cities = {
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    UK: ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol'],
    France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
};
const toChoices = items => items.map(item => ({ id: item, name: item }));
// toChoices(coutries) should be [{ id: 'USA', name: 'USA' }, ...]


const CityInput = () => {
    const country = useWatch({ name: 'country' });
    return (
        <SelectInput
            choices={country ? toChoices(cities[country]) : []}
            source="cities"
        />
    );
};

const OrderEdit = () => (
    <EditBase>
        <Form>
            <SelectInput source="country" choices={toChoices(countries)} />
            <CityInput />
        </Form>
    </EditBase>
);

export default OrderEdit;
```


## Fast

Ra-core takes advantage of the Single-Page-Application architecture, implementing various performance optimizations that make ra-core apps incredibly fast by default.

- **Non-Blocking Data Fetching**: Instead of waiting for API data before starting to render the UI, Ra-core initiates the rendering process immediately. This strategy ensures a snappy application where user interactions receive instant feedback, outperforming Server-side Rendered apps by eliminating waiting times for server responses.
- **Stale While Revalidate**: This technique allows pages to display data from previous requests while newer data is being fetched. In most instances, the fresh data remains the same (e.g., when revisiting a list page), ensuring users won't notice any delays due to network requests.
- **Local Database Mirror**: Ra-core populates its internal cache with individual records fetched using `dataProvider.getList()`. When a user views a specific record, Ra-core leverages its internal database to pre-fill the `dataProvider.getOne()` query response. As a result, record details are displayed instantaneously, without any wait time for server responses.
- **Optimistic Updates**: When a user edits a record and hits the "Save" button, Ra-core immediately updates its local database and displays the revised data, prior to sending the update query to the server. The resulting UI changes are instant - no server response wait time required. The same logic applies to record deletions.
- **Query Deduplication**: Ra-core identifies instances where multiple components on a page call the same data provider query for identical data. In such cases, it ensures only a single call to the data provider is made.
- **Query Aggregation**: Ra-core intercepts all calls to `dataProvider.getOne()` for related data when a `<ReferenceField>` is used in a list. It aggregates and deduplicates the requested ids, and issues a single `dataProvider.getMany()` request. This technique effectively addresses the n+1 query problem, reduces server queries, and accelerates list view rendering.
- **Opt-In Query Cache**: Ra-core provides an option to prevent refetching an API endpoint for a specified duration, which can be used when you're confident that the API response will remain consistent over time.
- **Embedded Data** and **Prefetching**: Data providers can return data from related resources in the same response as the requested resource. Ra-core uses this feature to avoid additional network requests and to display related data immediately.

## Undo

When users submit a form, or delete a record, the UI reflects their change immediately. They also see a confirmation message for the change, containing an "Undo" button. If they click on it before the confirmation slides out (the default delay is 5s), ra-core reverts to the previous state and cancels the call to the data provider.

<video controls autoplay playsinline muted loop>
  <source src="../img/tutorial_post_edit_undo.webm" type="video/webm"/>
  <source src="../img/tutorial_post_edit_undo.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

This undo feature is enabled by default, and requires no particular setup on the server side. In fact, ra-core delays the call to the data provider for mutations, to give users a "grace" period. That's why the actual call to `dataProvider.update()` occurs 5 seconds after the user submits an update form - even though the UI reflects the changes immediately.

You can disable this feature page by page, by choosing a different [mutationMode](./EditBase.md#mutationmode).

## Roles & Permissions

It's the server's responsibility to check that an action is allowed for a given user, and to filter the content based on user permissions. But roles and permissions are also a client-side concern, because you want to hide or disable actions based on the user's role. For example, you may not want to show a "Delete" button for users who don't have the `admin` role.

Ra-core lets you **customize the user interface based on a simple set of rules**, and to define the permissions for each role in a centralized place. Whether you need to have custom pages for specific roles, or to change the props of a component based on the user's role, ra-core lets you do it. This feature uses the same adapter approach as for the `dataProvider`, which means you can use any authentication backend you want.

<video controls="controls" style="max-width: 100%">
    <source src="../img/ra-rbac.mp4" type="video/mp4" />
</video>

You can define permissions for pages, fields, buttons, etc. Roles and permissions are managed by the `authProvider`, which means you can use any data source you want (including an ActiveDirectory server).

The above demo uses the following set of permissions:

```jsx
const roles = {
    accountant: [
        { action: ['list', 'show'], resource: 'products' },
        { action: 'read', resource: 'products.*' },
        { type: 'deny', action: 'read', resource: 'products.description' },
        { action: 'list', resource: 'categories' },
        { action: 'read', resource: 'categories.*' },
        { action: ['list', 'show'], resource: 'customers' },
        { action: 'read', resource: 'customers.*' },
        { action: '*', resource: 'invoices' },
    ],
    contentEditor: [
        {
            action: ['list', 'create', 'edit', 'delete', 'export'],
            resource: 'products',
        },
        { action: 'read', resource: 'products.*' },
        { type: 'deny', action: 'read', resource: 'products.stock' },
        { type: 'deny', action: 'read', resource: 'products.sales' },
        { action: 'write', resource: 'products.*' },
        { type: 'deny', action: 'write', resource: 'products.stock' },
        { type: 'deny', action: 'write', resource: 'products.sales' },
        { action: 'list', resource: 'categories' },
        { action: ['list', 'edit'], resource: 'customers' },
        { action: ['list', 'edit'], resource: 'reviews' },
    ],
    stockManager: [
        { action: ['list', 'edit', 'export'], resource: 'products' },
        { action: 'read', resource: 'products.*' },
        {
            type: 'deny',
            action: 'read',
            resource: 'products.description',
        },
        { action: 'write', resource: 'products.stock' },
        { action: 'write', resource: 'products.sales' },
        { action: 'list', resource: 'categories' },
    ],
    administrator: [{ action: '*', resource: '*' }],
};
```

To learn more about authentication, roles, and permissions, check out the following pages:

- The [Security introduction](./Authentication.md)
- [Authorization and access control](./Permissions.md)
- [`<Authenticated>`](./Authenticated.md)
- [`<CanAccess>`](./CanAccess.md)
- [`useAuthenticated`](./useAuthenticated.md)
- [`useAuthState`](./useAuthState.md)
- [`useLogin`](./useLogin.md)
- [`useLogout`](./useLogout.md)
- [`useGetIdentity`](./useGetIdentity.md)
- [`useCanAccess`](./useCanAccess.md)
- [`usePermissions`](./usePermissions.md)
- [`useAuthProvider`](./useAuthProvider.md)



## Preferences

End-users tweak the UI to their liking, and **they expect these preferences to be saved** so that they don't need to do it again the next time they visit the app. Ra-core provides a persistent `Store` for user preferences and uses it in many components.

For instance, the list parameters (like current filters, sorting order and pagination preferences) are automatically saved and restored when the user revisits the app.

To learn more about the `Store` and how to use it, check the following sections:

- [The `Store`](./Store.md)
- [`useStore`](./useStore.md)
- [`useStoreContext`](./useStoreContext.md)
- [`useResetStore`](./useResetStore.md)


## I18n

Ra-core is **fully internationalized**.

<video controls autoplay playsinline muted loop>
  <source src="../img/LocalesMenuButton.webm" type="video/webm"/>
  <source src="../img/LocalesMenuButton.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

The default interface messages (for buttons, tooltips, input labels, etc.) are in English. You can translate them to any of [the 30+ languages supported by ra-core](./TranslationLocales.md) by importing the appropriate translation package. For instance, to translate to French:

```jsx
import { CoreAdmin } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import fr from 'ra-language-french';

export const i18nProvider = polyglotI18nProvider(() => fr, 'fr');

export const App = () => (
    <Admin i18nProvider={i18nProvider}>
        // ...
    </Admin>
);
```

If you need to translate to a language not yet supported by ra-core, you can write a custom translation package. Check the [Writing a Custom Translation Package](./TranslationWriting.md) page for details.

In your components, to translate a message, use the `useTranslate` hook:

```jsx
import { useTranslate } from 'ra-core';

const MyHelloButton = () => {
    const translate = useTranslate();
    return (
        <button>{translate('myroot.hello.world')}</button>
    );
};

export default MyHelloButton;
```

The underlying translation library, [polyglot.js](https://airbnb.io/polyglot.js/), supports [pluralization](https://airbnb.io/polyglot.js/#pluralization) and [interpolation](https://airbnb.io/polyglot.js/#interpolation). It is popular, fast, and lightweight. But if you prefer to store your translations in GETTEXT or YAML files rather than JSON, the adapter approach lets you use any translation library you want.

Ra-core is used by thousands of companies across the world, so the internationalization support is mature and well-tested. Check the following sections to learn more about ra-core's i18n support:

- [The `i18nProvider` prop](./Translation.md)
- [Translation messages](./TranslationTranslating.md)
- [`useTranslate`](./useTranslate.md)
- [`useLocaleState`](./useLocaleState.md)

## Type-Safe

Ra-core is written in TypeScript. That doesn't mean you have to use TypeScript to use ra-core - **you can write ra-core apps in JavaScript**. But if you do, you get compile-time type checking for your components, hooks, data providers, auth providers, translation messages, and more.

And if your IDE supports TypeScript, you get autocompletion and inline documentation for all ra-core components and hooks.

<video controls autoplay playsinline muted loop width="100%">
  <source src="../img/typescript.webm" type="video/webm" />
  <source src="../img/typescript.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Building ra-core apps with TypeScript brings more safety and productivity to your development workflow.

## Sustainable

Last but not least, ra-core is here to stay. That's because the development of the open-source project is **funded by the customers** of the [Enterprise Edition](https://react-admin-ee.marmelab.com/).

Maintaining a large open-source project in the long term is a challenge. But the ra-core core team, hosted by [Marmelab](https://marmelab.com), doesn't have to worry about the next funding round, or about paying back venture capital by raising prices. Ra-core has zero debt, has already **passed the break-even point**, and the team will only grow as the number of customers grows.

The core team is fortunate to be able to work full-time on ra-core, and this allows us to:

- release bug fixes every week
- release new features every month
- provide support to our customers
- maintain the documentation
- refactor the codebase
- create demos and tutorials
- stay up-to-date with the latest React and libraries versions
- contribute to the open-source community

At Marmelab, "sustainable" also means **low carbon footprint**. Ra-core is regularly audited with [GreenFrame](https://greenframe.io/), a tool that measures the carbon footprint of software projects. Technical choices are also made with the environment in mind. For instance, the use of [React Query](https://tanstack.com/query/v5/) for caching data in ra-core reduces the number of HTTP requests, and thus reduces the carbon footprint of the application.

## Conclusion

Ra-core's headless architecture provides the data management, authentication, authorization, internationalization, caching, and validation features you need to build modern admin applications with any UI library of your choice. By using the `ra-core` package and controller hooks, you get all the power of ra-core without being tied to Material UI.

The framework is actively maintained by the team at [Marmelab](https://marmelab.com/) with regular updates and improvements to the headless capabilities.
