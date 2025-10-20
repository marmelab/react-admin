---
title: "Data Fetching"
sidebar:
  order: 2
---

You can use ra-core to build an admin app on top of any API, whether it uses REST, GraphQL, RPC, or even SOAP, regardless of the dialect it uses. This works because ra-core doesn't use `fetch` directly. Instead, it uses a Data Provider object to interface with your API and [React Query](https://tanstack.com/query/v5/docs/react/overview) to handle data fetching.

## The Data Provider

In an ra-core app, you don't write API calls using `fetch` or `axios`. Instead, you communicate with your API through an object called the `dataProvider`.

<img src="../img/data-provider.png" class="no-shadow" alt="Backend agnostic" />

The `dataProvider` exposes a predefined interface that allows ra-core to query any API in a normalized way.

For instance, to query the API for a single record, ra-core calls `dataProvider.getOne()`:

```tsx
const response = await dataProvider.getOne('posts', { id: 123 });
console.log(response.data); // { id: 123, title: "hello, world" }
```

The Data Provider is responsible for transforming these method calls into HTTP requests and converting the responses into the format expected by ra-core. In technical terms, a Data Provider is an *adapter* for an API.

A Data Provider must implement the following methods:

```jsx
const dataProvider = {
    async getList(resource, { sort, filter, pagination }) => ({ data: Record[], total: number }), 
    async getOne(resource, { id }) => ({ data: Record }),
    async getMany(resource, { ids }) => ({ data: Record[] }),
    async getManyReference(resource, { target, id, sort, filter, pagination }) => ({ data: Record[], total: number }), 
    async create(resource, { data }) => ({ data: Record }),
    async update(resource, { id, data }) => ({ data: Record }),
    async updateMany(resource, { ids, data }) => ({ data: Identifier[] }),
    async delete(resource, { id } ) => ({ data: Record }),
    async deleteMany(resource, { ids }) => ({ data: Identifier[] }),
}
```

**Tip**: A Data Provider can have [additional methods](./Actions.md#calling-custom-methods) beyond these 9. For example, you can add custom methods for non-REST API endpoints, tree structure manipulations, or realtime updates.

The Data Provider is a key part of ra-core's architecture. By standardizing the Data Provider interface, ra-core can offer powerful features, like reference handling, optimistic updates, and data management for CRUD components.

## Backend Agnostic

Thanks to this adapter system, ra-core can communicate with any API. It doesn't care if your API is a REST API, a GraphQL API, a SOAP API, a JSON-RPC API, or even a local API. It doesn't care if your API is written in PHP, Python, Ruby, Java, or JavaScript. It doesn't care if your API is a third-party API or a homegrown API.

Ra-core is compatible with [more than 50 data providers](./DataProviderList.md) for popular API flavors.

You can also [write your own Data Provider](./DataProviderWriting.md) to fit your backend's particularities. Data Providers can use `fetch`, `axios`, `apollo-client`, or any other library to communicate with APIs. The Data Provider is also the ideal place to add custom HTTP headers, authentication, etc.

Check out the [Data Provider Setup](./DataProviders.md) documentation for more details on how to set up a Data Provider in your app.

## Calling The Data Provider

Many ra-core components use the Data Provider: page components like `<ListBase>` and `<EditBase>`, reference components like `<ReferenceFieldBase>` and `<ReferenceInputBase>`, controller hooks like `useListController` and `useEditController`, and data fetching hooks.

If you need to call the Data Provider directly from your components, you can use the specialized hooks provided by ra-core:

* [`useGetList`](./useGetList.md)
* [`useGetOne`](./useGetOne.md)
* [`useGetMany`](./useGetMany.md)
* [`useGetManyReference`](./useGetManyReference.md)
* [`useCreate`](./useCreate.md)
* [`useUpdate`](./useUpdate.md)
* [`useUpdateMany`](./useUpdateMany.md)
* [`useDelete`](./useDelete.md)
* [`useDeleteMany`](./useDeleteMany.md)

For instance, to call `dataProvider.getOne()`, use the `useGetOne` hook:

```jsx
import { useGetOne } from 'ra-core';

const UserProfile = ({ userId }) => {
    const { data: user, isPending, error } = useGetOne('users', { id: userId });

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return null;

    return (
        <ul>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
        </ul>
    )
};
```

You can also call the `useDataProvider` hook to access the `dataProvider` directly:

```jsx
import { useDataProvider } from 'ra-core';

const BanUserButton = ({ userId }) => {
    const dataProvider = useDataProvider();
    const handleClick = () => {
        dataProvider.update('users', { id: userId, data: { isBanned: true } });
    };
    return <button onClick={handleClick}>Ban user</button>;
};
```

The [Querying the API](./Actions.md) documentation lists all the hooks available for querying the API, as well as the options and return values for each.

## React Query

Ra-core uses [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) to call the Data Provider. Specialized hooks like `useGetOne` use TanStack Query's hooks under the hood and accept the same options.

You can use any of TanStack Query's hooks in your code:

- [`useQuery`](https://tanstack.com/query/latest/docs/framework/react/guides/queries) for reading data
- [`useMutation`](https://tanstack.com/query/latest/docs/framework/react/guides/mutations) for writing data.

For instance, you can use `useMutation` to call the `dataProvider.update()` directly. This lets you track the mutation's status and add side effects:

```jsx
import { useDataProvider, useNotify } from 'ra-core';
import { useMutation } from '@tanstack/react-query';

const BanUserButton = ({ userId }) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const { mutate, isPending } = useMutation({
        mutationFn: () => dataProvider.update('users', { id: userId, data: { isBanned: true } }),
        onSuccess: () => notify('User banned'),
    });
    return <button onClick={() => mutate()} disabled={isPending}>Ban user</button>;
};
```

Check out the [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview) for more information on how to use it.

## Local API Mirror

Ra-core caches query data locally in the browser and automatically reuses it to answer future queries whenever possible. By structuring and indexing the data by resource name and ID, ra-core offers several advantages:

- **Stale-While-Revalidate**: Ra-core renders the UI immediately using cached data while fetching fresh data from the server in the background. Once the server response arrives, the UI seamlessly updates with the latest data.
- **Data Sharing Between Views**: When navigating from a list view to a show view, ra-core reuses data from the list to render the show view instantly, eliminating the need to wait for the `dataProvider.getOne()` response.
- **Optimistic Updates**: When a user deletes or updates a record, ra-core immediately updates the local cache to reflect the change, providing instant UI feedback. The server request follows, and if it fails, ra-core reverts the local data and notifies the user.
- **Auto Refresh**: Ra-core invalidates dependent queries after a successful mutation. TanStack Query then refetches the necessary data, ensuring the UI remains up-to-date automatically.

For example, when a user deletes a book in a list, Ra-core immediately removes it, making the row disappear. After the API confirms the deletion, Ra-core invalidates the list’s cache, refreshes it, and another record appears at the end of the list.

<video controls autoplay playsinline muted loop width="100%">
  <source src="../img/AutoRefresh.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

The local API mirror significantly enhances both the user experience (with a snappy and responsive UI) and the developer experience (by abstracting caching, invalidation, and optimistic updates).

## Mutation Mode

Ra-core provides three approaches for handling updates and deletions:

- **Undoable** (default): Ra-core updates the UI immediately and displays an undo button. During this time, it doesn't send a request to the server. If the user clicks the undo button, ra-core restores the previous UI state and cancels the server request. If the user doesn't click the undo button, it sends the request to the server after the delay.
- **Optimistic**: Ra-core updates the UI immediately and sends the request to the server simultaneously. If the server request fails, the UI is reverted to its previous state to maintain consistency.
- **Pessimistic**: Ra-core sends the request to the server first. After the server confirms success, the UI is updated. If the request fails, it displays an error message to inform the user.

![Success message with undo](../../img/DeleteButton_success.png)

For each mutation hook or component, you can specify the mutation mode:

```jsx
const DeletePostButton = ({ record }) => {
    const [deleteOne] = useDelete(
        'posts',
        { id: record.id },
        { mutationMode: 'pessimistic' }
    );
    const handleClick = () => deleteOne();
    return <button onClick={handleClick}>Delete</button>;
};
```

For details, refer to the [Querying the API](./Actions.md#optimistic-rendering-and-undo) chapter.

## Custom Data Provider Methods

Your API backend may expose non-CRUD endpoints, e.g., for calling Remote Procedure Calls (RPC).

For instance, let's say your API exposes an endpoint to ban a user based on its `id`:

```
POST /api/user/123/ban
```

The ra-core way to expose these endpoints to the app components is to add a custom method in the `dataProvider`:

```tsx
import simpleRestDataProvider from 'ra-data-simple-rest';

const baseDataProvider = simpleRestDataProvider('http://path.to.my.api/');

export const dataProvider = {
    ...baseDataProvider,
    banUser: (userId: string) => {
        return fetch(`/api/user/${userId}/ban`, { method: 'POST' })
            .then(response => response.json());
    },
}

export interface MyDataProvider extends DataProvider {
    banUser: (userId: string) => Promise<Record<string, any>>;
}
```

Then you can use react-query's `useMutation` hook to call the `dataProvider.banUser()` method:

```tsx
import { useDataProvider } from 'ra-core';
import { useMutation } from '@tanstack/react-query';

import type { MyDataProvider } from './dataProvider';

const BanUserButton = ({ userId }: { userId: string }) => {
    const dataProvider = useDataProvider<MyDataProvider>();
    const { mutate, isPending } = useMutation({
        mutationFn: () => dataProvider.banUser(userId)
    });
    return <button onClick={() => mutate()} disabled={isPending}>Ban</button>;
};
```

Check the [Calling Custom Methods](./Actions.md#calling-custom-methods) documentation for more details.

## Authentication

The `dataProvider` often needs to send an authentication token in API requests. The [`authProvider`](./Authentication.md) manages the authentication process. Here's how the two work together:

1. The user logs in with their email and password
2. Ra-core calls `authProvider.login()` with these credentials.
3. The `authProvider` sends the login request to the authentication backend.
4. The backend validates the credentials and returns an authentication token.
5. The `authProvider` stores the token in `localStorage`
6. When making requests, the `dataProvider` reads the token from `localStorage` and adds it to the request headers.

You must implement the interaction between the `authProvider` and `dataProvider`. Here's an example for the auth provider:

```jsx
// in authProvider.js
const authProvider = {
    async login({ username, password })  {
        const request = new Request('https://mydomain.com/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        let response;
        try {
            response = await fetch(request);
        } catch (_error) {
            throw new Error('Network error');
        }
        if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
        }
        const { token } = await response.json();
        localStorage.setItem('token', token);
    },
    async logout() {
        localStorage.removeItem('token');
    },
    // ...
};
```

Many Data Providers, like `simpleRestProvider`, support authentication. Here's how you can configure it to include the token:

```js
// in dataProvider.js
import { fetchUtils } from 'ra-core';
import simpleRestProvider from 'ra-data-simple-rest';

const fetchJson = (url, options = {}) => {
    options.user = {
        authenticated: true,
        token: localStorage.getItem('token') // Include the token
    };
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider('http://path.to.my.api/', fetchJson);
```

Check your Data Provider's documentation for specific configuration options.

## Relationships

Ra-core simplifies working with relational APIs by managing related records at the component level. You can leverage relationship support without modifying your Data Provider or API.

For instance, let's imagine an API exposing CRUD endpoints for books and authors:

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

The Book show page should display a book title and the name of its author. In a server-side framework, you would issue a SQL query with a JOIN clause. In ra-core, components request only the data they need, and ra-core handles the relationship resolution.

```jsx
import { ShowBase, ReferenceFieldBase } from 'ra-core';
import { TextField } from './TextField';
import { FunctionField } from './FunctionField';

const BookShow = () => (
    <ShowBase>
        <div>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceFieldBase source="author_id" reference="authors">
                <FunctionField render={record => `${record.first_name} ${record.last_name}`} />
            </ReferenceFieldBase>
            <TextField source="year" />
        </div>
    </ShowBase>
);
```

In the example above, two components call the Data Provider on mount:

- The `ShowBase` component calls `dataProvider.getOne('books')` and receives a book with an `author_id` field
- The `ReferenceFieldBase` component reads the current book record and calls `dataProvider.getOne('authors')` using the `author_id` value

This approach improves the developer experience as you don't need to build complex queries for each page. Components remain independent of each other and are easy to compose.

However, this cascade of Data Provider requests can appear inefficient regarding user-perceived performance. Ra-core includes several optimizations to mitigate this:

- [**Local API Mirror**](#local-api-mirror) (see above)
- **Partial Rendering**: Ra-core first renders the page with the book data and updates it when the author data arrives. This ensures users see data as soon as possible.
- **Query Aggregation**: Ra-core intercepts all calls to `dataProvider.getOne()` for related data when a `<ReferenceFieldBase>` is used in a list. It aggregates and deduplicates the requested ids and issues a single `dataProvider.getMany()` request. This technique effectively addresses the n+1 query problem, reduces server queries, and accelerates list view rendering.
- **Loading Indicators**: `<ReferenceFieldBase>` supports passing a custom loading indicator component to be displayed while the related data is being fetched.
- **Embedded Data** and **Prefetching**: Data providers can return data from related resources in the same response as the requested resource. Ra-core uses this feature to avoid additional network requests and to display related data immediately.

Even on complex pages that aggregate data from multiple resources, Reference components optimize API requests, reducing their number while ensuring users quickly see the data they need.

Relationship support in ra-core works out of the box with any API that provides foreign keys. No special configuration is required for your API or Data Provider.

Here is a list of ra-core's [relationship components](./Features.md#relationships):

- [`<ReferenceFieldBase>`](./ReferenceFieldBase.md)
- [`<ReferenceArrayFieldBase>`](./ReferenceArrayFieldBase.md)
- [`<ReferenceManyFieldBase>`](./ReferenceManyFieldBase.md)
- [`<ReferenceOneFieldBase>`](./ReferenceOneFieldBase.md)
- [`<ReferenceManyCountBase>`](./ReferenceManyCountBase.md)
- `<ReferenceInputBase>`
- `<ReferenceArrayInputBase>`

To learn more about relationships, check out this tutorial: [Handling Relationships in React Admin](https://marmelab.com/blog/2025/02/06/handling-relationships-in-react-admin.html).

If a relationship component doesn't fit your specific use case, you can always use a [custom data provider method](./Actions.md#calling-custom-methods) to fetch the required data.
