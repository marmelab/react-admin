---
layout: default
title: "Writing A Data Provider"
---

# Writing A Data Provider

APIs are so diverse that quite often, none of [the available Data Providers](./DataProviderList.md) suit you API. In such cases, you'll have to write your own Data Provider. Don't worry, it usually takes only a couple of hours. 

<iframe src="https://www.youtube-nocookie.com/embed/sciDJAUEu_M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>


The methods of a Data Provider receive a request, and return a promise for a response. Both the request and the response format are standardized.

## Data Provider Methods

A data provider must implement the following methods:

```jsx
const dataProvider = {
    // get a list of records based on sort, filter, and pagination
    getList:    (resource, params) => Promise,
    // get a single record by id
    getOne:     (resource, params) => Promise, 
    // get a list of records based on an array of ids
    getMany:    (resource, params) => Promise, 
    // get the records referenced to another record, e.g. comments for a post
    getManyReference: (resource, params) => Promise, 
    // create a record
    create:     (resource, params) => Promise, 
    // update a record based on a patch
    update:     (resource, params) => Promise, 
    // update a list of records based on an array of ids and a common patch
    updateMany: (resource, params) => Promise, 
    // delete a record by id
    delete:     (resource, params) => Promise, 
    // delete a list of records based on an array of ids
    deleteMany: (resource, params) => Promise, 
}
```

To call the data provider, react-admin combines a *method* (e.g. `getOne`), a *resource* (e.g. 'posts') and a set of *parameters*.

**Tip**: In comparison, HTTP requests require a *verb* (e.g. 'GET'), an *url* (e.g. 'http://myapi.com/posts'), a list of *headers* (like `Content-Type`) and a *body*.

In the rest of this documentation, the term `Record` designates an object literal with at least an `id` property (e.g. `{ id: 123, title: "hello, world" }`).

## `getList`

React-admin calls `dataProvider.getList()` to search records.

**Interface**
```tsx
interface GetListParams {
    pagination: { page: number, perPage: number };
    sort: { field: string, order: 'ASC' | 'DESC' };
    filter: any;
    meta?: any; // request metadata
    signal?: AbortSignal;
}
interface GetListResult {
    data: Record[];
    total?: number;
    // if using partial pagination
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
    meta?: any; // response metadata
}
function getList(resource: string, params: GetListParams): Promise<GetListResult>
```

**Example**

```jsx
// find the first 5 posts whose author_id is 12, sorted by title
dataProvider.getList('posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
    filter: { author_id: 12 },
})
.then(response => console.log(response));
// {
//     data: [
//         { id: 126, title: "allo?", author_id: 12 },
//         { id: 127, title: "bien le bonjour", author_id: 12 },
//         { id: 124, title: "good day sunshine", author_id: 12 },
//         { id: 123, title: "hello, world", author_id: 12 },
//         { id: 125, title: "howdy partner", author_id: 12 },
//     ],
//     total: 27,
//     meta: {
//         facets: [
//             { name: "published", count: 12 },
//             { name: "draft", count: 15 },
//         ],
//     },
// }
```

## `getOne`

React-admin calls `dataProvider.getOne()` to fetch a single record by `id`.

**Interface**

```tsx
interface GetOneParams {
    id: Identifier;
    meta?: any;
    signal?: AbortSignal;
}
interface GetOneResult {
    data: Record;
}
function getOne(resource: string, params: GetOneParams): Promise<GetOneResult>
```

**Example**

```jsx
// find post 123
dataProvider.getOne('posts', { id: 123 })
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world" }
// }
```

## `getMany`

React-admin calls `dataProvider.getMany()` to fetch several records at once using their `id`.

**Interface**

```tsx
interface GetManyParams {
    ids: Identifier[];
    meta?: any;
    signal?: AbortSignal;
}
interface GetManyResult {
    data: Record[];
}
function getMany(resource: string, params: GetManyParams): Promise<GetManyResult>
```

**Example**

```jsx
// find posts 123, 124 and 125
dataProvider.getMany('posts', { ids: [123, 124, 125] })
.then(response => console.log(response));
// {
//     data: [
//         { id: 123, title: "hello, world" },
//         { id: 124, title: "good day sunshine" },
//         { id: 125, title: "howdy partner" },
//     ]
// }
```

## `getManyReference`

React-admin calls `dataProvider.getManyReference()` to fetch the records related to another record. Although similar to `getList`, this method is designed for relationships. It is necessary because some APIs require a different query to fetch related records (e.g. `GET /posts/123/comments` to fetch comments related to post 123).

**Interface**

```tsx
interface GetManyReferenceParams {
    target: string;
    id: Identifier;
    pagination: { page: number, perPage: number };
    sort: { field: string, order: 'ASC' | 'DESC' };
    filter: any;
    meta?: any; // request metadata
    signal?: AbortSignal;
}
interface GetManyReferenceResult {
    data: Record[];
    total?: number;
    // if using partial pagination
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
    meta?: any; // response metadata
}
function getManyReference(resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult>
```

**Example**

```jsx
// find all comments related to post 123
dataProvider.getManyReference('comments', {
    target: 'post_id',
    id: 123,
    sort: { field: 'created_at', order: 'DESC' }
})
.then(response => console.log(response));

// {
//     data: [
//         { id: 667, title: "I agree", post_id: 123 },
//         { id: 895, title: "I don't agree", post_id: 123 },
//     ],
//     total: 2,
// }
```

## `create`

React-admin calls `dataProvider.create()` to create a new record.

**Interface**

```tsx
interface CreateParams {
    data: Partial<Record>;
    meta?: any;
}

interface CreateResult {
    data: Record;
}
function create(resource: string, params: CreateParams): Promise<CreateResult>
```

**Example**

```jsx
// create a new post with title "hello, world"
dataProvider.create('posts', { data: { title: "hello, world" } })
.then(response => console.log(response));
// {
//     data: { id: 450, title: "hello, world" }
// }
```

## `update`

React-admin calls `dataProvider.update()` to update a record.

**Interface**

```tsx
interface UpdateParams {
    id: Identifier;
    data: Partial<Record>;
    previousData: Record;
    meta?: any;
}
interface UpdateResult {
    data: Record;
}
function update(resource: string, params: UpdateParams): Promise<UpdateResult>
```

**Example**

```jsx
// update post 123 with title "hello, world!"
dataProvider.update('posts', {
    id: 123,
    data: { title: "hello, world!" },
    previousData: { id: 123, title: "previous title" }
})
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world!" }
// }
```

## `updateMany`

React-admin calls `dataProvider.updateMany()` to update several records by `id` with a unified changeset.

**Interface**

```tsx
interface UpdateManyParams {
    ids: Identifier[];
    data: Partial<Record>;
    meta?: any;
}
interface UpdateManyResult {
    data: Identifier[];
}
function updateMany(resource: string, params: UpdateManyParams): Promise<UpdateManyResult>
```

**Example**

```jsx
// update posts 123 and 234 to set views to 0
dataProvider.updateMany('posts', {
    ids: [123, 234],
    data: { views: 0 },
})
.then(response => console.log(response));
// {
//     data: [123, 234]
// }
```

## `delete`

React-admin calls `dataProvider.delete()` to delete a record by `id`.

**Interface**

```tsx
interface DeleteParams {
    id: Identifier;
    previousData?: Record;
    meta?: any;
}
interface DeleteResult {
    data: Record;
}
function _delete(resource: string, params: DeleteParams): Promise<DeleteResult>
```

**Example**

```jsx
// delete post 123
dataProvider.delete('posts', {
    id: 123,
    previousData: { id: 123, title: "hello, world!" }
})
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world" }
// }
```

## `deleteMany`

React-admin calls `dataProvider.deleteMany()` to delete several records by `id`.

**Interface**

```tsx
interface DeleteManyParams {
    ids: Identifier[];
    meta?: any;
}
interface DeleteManyResult {
    data: Identifier[];
}
function deleteMany(resource: string, params: DeleteManyParams): Promise<DeleteManyResult>
```

**Example**

```jsx
// delete posts 123 and 234
dataProvider.deleteMany('posts', { ids: [123, 234] })
.then(response => console.log(response));
// {
//     data: [123, 234]
// }
```

## Partial Pagination

The `getList()` and `getManyReference()` methods return paginated responses. Sometimes, executing a "count" server-side to return the `total` number of records is expensive. In this case, you can omit the `total` property in the response, and pass a `pageInfo` object instead, specifying if there are previous and next pages:

```js
dataProvider.getList('posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
    filter: { author_id: 12 },
})
.then(response => console.log(response));
// {
//     data: [
//         { id: 126, title: "allo?", author_id: 12 },
//         { id: 127, title: "bien le bonjour", author_id: 12 },
//         { id: 124, title: "good day sunshine", author_id: 12 },
//         { id: 123, title: "hello, world", author_id: 12 },
//         { id: 125, title: "howdy partner", author_id: 12 },
//     ],
//     pageInfo: {
//         hasPreviousPage: false,    
//         hasNextPage: true,
//     }
// }
```

React-admin's `<Pagination>` component will automatically handle the `pageInfo` object and display the appropriate pagination controls.

## Error Format

When the API backend returns an error, the Data Provider should return a rejected Promise containing an `Error` object. This object should contain a `status` property with the HTTP response code (404, 500, etc.). React-admin inspects this error code, and uses it for [authentication](./Authentication.md) (in case of 401 or 403 errors). Besides, react-admin displays the error `message` on screen in a temporary notification.

If you use `fetchJson`, you don't need to do anything: HTTP errors are automatically decorated as expected by react-admin.

If you use another HTTP client, make sure you return a rejected Promise. You can use the `HttpError` class to throw an error with status in one line:

```js
import { HttpError } from 'react-admin';

export default {
    getList: (resource, params) => {
        return new Promise((resolve, reject) => {
            myApiClient(url, { ...options, headers: requestHeaders })
                .then(response =>
                    response.text().then(text => ({
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers,
                        body: text,
                    }))
                )
                .then(({ status, statusText, headers, body }) => {
                    let json;
                    try {
                        json = JSON.parse(body);
                    } catch (e) {
                        // not json, no big deal
                    }
                    if (status < 200 || status >= 300) {
                        return reject(
                            new HttpError(
                                (json && json.message) || statusText,
                                status,
                                json
                            )
                        );
                    }
                    return resolve({ status, headers, body, json });
                });
        });
    },
    // ...
};
```

## Handling Authentication

Your API probably requires some form of authentication (e.g. a token in the `Authorization` header). It's the responsibility of [the `authProvider`](./Authentication.md) to log the user in and obtain the authentication data. React-admin doesn't provide any particular way of communicating this authentication data to the Data Provider. Most of the time, storing the authentication data in the  `localStorage` is the best choice - and allows uses to open multiple tabs without having to log in again.

Check the [Handling Authentication](./DataProviders.md#handling-authentication) section in the Data Providers introduction for an example of such a setup.

## Testing Data Provider Methods

A good way to test your data provider is to build a react-admin app with components that depend on it. Here is a list of components calling the data provider methods:

| Method             | Components |
| ------------------ | --------- |
| `getList`          | [`<List>`](./List.md), [`<ListGuesser>`](./ListGuesser.md), [`<ListBase>`](./ListBase.md), [`<InfiniteList>`](./InfiniteList.md), [`<Count>`](./Count.md), [`<Calendar>`](./Calendar.md), [`<ReferenceInput>`](./ReferenceInput.md), [`<ReferenceArrayInput>`](./ReferenceArrayInput.md), [`<ExportButton>`](./Buttons.md#exportbutton), [`<PrevNextButtons>`](./PrevNextButtons.md) |
| `getOne`           | [`<Show>`](./Show.md), [`<ShowGuesser>`](./ShowGuesser.md), [`<ShowBase>`](./ShowBase.md), [`<Edit>`](./Edit.md), [`<EditGuesser>`](./EditGuesser.md), [`<EditBase>`](./EditBase.md) |
| `getMany`          | [`<ReferenceField>`](./ReferenceField.md), [`<ReferenceArrayField>`](./ReferenceArrayField.md), [`<ReferenceInput>`](./ReferenceInput.md), [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) |
| `getManyReference` | [`<ReferenceManyField>`](./ReferenceManyField.md), [`<ReferenceOneField>`](./ReferenceOneField.md), [`<ReferenceManyInput>`](./ReferenceManyInput.md), [`<ReferenceOneInput>`](./ReferenceOneInput.md) |
| `create`           | [`<Create>`](./Create.md), [`<CreateBase>`](./CreateBase.md), [`<EditableDatagrid>`](./EditableDatagrid.md), [`<CreateInDialogButton>`](./CreateInDialogButton.md) |
| `update`           | [`<Edit>`](./Edit.md), [`<EditGuesser>`](./EditGuesser.md), [`<EditBase>`](./EditBase.md), [`<EditableDatagrid>`](./EditableDatagrid.md), [`<EditInDialogButton>`](./EditInDialogButton.md), [`<UpdateButton>`](./UpdateButton.md) |
| `updateMany`       | [`<BulkUpdateButton>`](./Buttons.md#bulkupdatebutton) |
| `delete`           | [`<DeleteButton>`](./Buttons.md#deletebutton), [`<EditableDatagrid>`](./EditableDatagrid.md) |
| `deleteMany`       | [`<BulkDeleteButton>`](./Buttons.md#bulkdeletebutton) |

A simple react-admin app with one `<Resource>` using [guessers](./Features.md#guessers--scaffolding) for the `list`, `edit`, and `show` pages is a good start.

## The `meta` Parameter

All data provider methods accept a `meta` query parameter and can return a `meta` response key. React-admin core components never set the query `meta`. It's designed to let you pass additional parameters to your data provider.

For instance, you could pass an option to embed related records in the response (see [Embedded data](#embedded-data) below):

```jsx
const { data } = await dataProvider.getOne(
    'books',
    { id, meta: { embed: ['authors'] } },
);
```

It's up to you to use this `meta` parameter in your data provider.

## Embedded Data

Some API backends with knowledge of the relationships between resources can [embed related records](./DataProviders.md#embedding-relationships) in the response. If you want your data provider to support this feature, use the `meta.embed` query parameter to specify the relationships that you want to embed.

```jsx
const { data } = await dataProvider.getOne(
    'posts',
    { id: 123, meta: { embed: ['author'] } }
);
// {
//    id: 123,
//    title: "Hello, world",
//    author_id: 456,
//    author: { id: 456, name: "John Doe" },
// }
```

For example, the [JSON server](https://github.com/typicode/json-server?tab=readme-ov-file#embed) backend supports embedded data using the `_embed` query parameter:

```txt
GET /posts/123?_embed=author
```

The [JSON Server Data Provider](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-json-server) therefore passes the `meta.embed` query parameter to the API:

```tsx
const apiUrl = 'https://my.api.com/';
const httpClient = fetchUtils.fetchJson;

const dataProvider = {
    getOne: async (resource, params) => {
        let query = `${apiUrl}/${resource}/${params.id}`;
        if (params.meta?.embed) {
            query += `?_embed=${params.meta.embed.join(',')}`;
        }
        const { json: data } = await httpClient(query);
        return { data };
    },
    // ...
}
```

As embedding is an optional feature, react-admin doesn't use it by default. It's up to you to implement it in your data provider to reduce the number of requests to the API.

## Prefetching

Similar to embedding, [prefetching](./DataProviders.md#prefetching-relationships) is an optional data provider feature that saves additional requests by returning related records in the response.

Use the `meta.prefetch` query parameter to specify the relationships that you want to prefetch.

```jsx
const { data } = await dataProvider.getOne(
    'posts',
    { id: 123, meta: { prefetch: ['author'] } }
);
// {
//     data: {
//         id: 123,
//         title: "Hello, world",
//         author_id: 456,
//     },
//     meta: {
//         prefetched: {
//             authors: [{ "id": 456, "name": "John Doe" }]
//         }
//     }
// }
```

By convention, the `meta.prefetched` response key must be an object where each key is the name of the embedded resource, and each value is an array of records.

It's the Data Provider's job to build the `meta.prefetched` object based on the API response.

For example, the [JSON server](https://github.com/typicode/json-server?tab=readme-ov-file#embed) backend supports embedded data using the `_embed` query parameter:

```txt
GET /posts/123?_embed=author
```

```json
{
    "id": 123,
    "title": "Hello, world",
    "author_id": 456,
    "author": {
        "id": 456,
        "name": "John Doe"
    }
}
```

To add support for prefetching, the [JSON Server Data Provider](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-json-server) extracts the embedded data from the response, and puts them in the `meta.prefetched` property:

```jsx
const dataProvider = {
    getOne: async (resource, params) => {
        let query = `${apiUrl}/${resource}/${params.id}`;
        if (params.meta?.prefetch) {
            query += `?_embed=${params.meta.prefetch.join(',')}`;
        }
        const { json: data } = await httpClient(query);
        const prefetched = {};
        if (params.meta?.prefetch) {
            params.meta.prefetch.forEach(name => {
                if (data[name]) {
                    const prefetchKey = name.endsWith('s') ? name : `${name}s`;
                    if (!prefetched[prefetchKey]) {
                        prefetched[prefetchKey] = [];
                    }
                    if (!prefetched[prefetchKey].find(r => r.id === data[name].id)) {
                        prefetched[prefetchKey].push(data[name]);
                    }
                    delete data[name];
                }
            });
        }
        return { data };
    },
    // ...
}
```

Use the same logic to implement prefetching in your data provider.

## The `signal` Parameter

All data provider queries can be called with an extra `signal` parameter. This parameter will receive an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that can be used to abort the request.

To enable this feature, your data provider must have a `supportAbortSignal` property set to `true`. This is necessary to avoid queries to be sent twice in `development` mode when rendering your application inside [`<React.StrictMode>`](https://react.dev/reference/react/StrictMode).

```tsx
const dataProvider = simpleRestProvider('https://myapi.com');
dataProvider.supportAbortSignal = true;
// You can set this property depending on the production mode, e.g in Vite
dataProvider.supportAbortSignal = import.meta.env.MODE === 'production';
```

When React Admin calls a data provider query method, it wraps it using [React Query](https://tanstack.com/query/v5/docs/react/overview), which supports automatic [Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation) thanks to the `signal` parameter.

You can also benefit from this feature if you wrap your calls to the dataProvider with `useQuery`, and pass the `signal` parameter to the dataProvider:

```jsx
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDataProvider, Loading, Error } from 'react-admin';

const UserProfile = ({ userId }) => {
    const dataProvider = useDataProvider();
    const { data, isPending, error } = useQuery({
        queryKey: ['users', 'getOne', { id: userId }], 
        queryFn: ({ signal }) => dataProvider.getOne('users', { id: userId, signal })
    });

    if (isPending) return <Loading />;
    if (error) return <Error />;
    if (!data) return null;

    return (
        <ul>
            <li>Name: {data.data.name}</li>
            <li>Email: {data.data.email}</li>
        </ul>
    )
};
```

It's then the responsibility of the dataProvider to use this `signal` parameter, and pass it to the library responsible for making the HTTP requests, like `fetch`, `axios`, `XMLHttpRequest` , `apollo`, `graphql-request`, etc.

You can find example implementations in the [Query Cancellation guide](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation).

## `getList` and `getOne` Shared Cache

A Data Provider should return the same shape in `getList` and `getOne` for a given resource. This is because react-admin uses "optimistic rendering", and renders the Edit and Show view *before* calling `dataProvider.getOne()` by reusing the response from `dataProvider.getList()` if the user has displayed the List view before. If your API has different shapes for a query for a unique record and for a query for a list of records, your Data Provider should make these records consistent in shape before returning them to react-admin.

For instance, the following Data Provider returns more details in `getOne` than in `getList`:

```jsx
const { data } = await dataProvider.getList('posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
    filter: { author_id: 12 },
})
// [
//   { id: 123, title: "hello, world", author_id: 12 },
//   { id: 125, title: "howdy partner", author_id: 12 },
//  ],

const { data } = dataProvider.getOne('posts', { id: 123 })
// {
//     data: { id: 123, title: "hello, world", author_id: 12, body: 'Lorem Ipsum Sic Dolor Amet' }
// }
```

This will cause the Edit view to blink on load. If you have this problem, modify your Data Provider to return the same shape for all methods.

**Note**: If the `getList` and `getOne` methods use different `meta` parameters, they won't share the cache. You can use this as an escape hatch to avoid flickering in the Edit view.

```jsx
const { data } = dataProvider.getOne('posts', { id: 123, meta: { page: 'getOne' } })
```

This also explains why using [Embedding relationships](./DataProviders.md#embedding-relationships) may make the navigation slower, as the `getList` and `getOne` methods will return different shapes.

## `fetchJson`: Built-In HTTP Client

Although your Data Provider can use any HTTP client (`fetch`, `axios`, etc.), react-admin suggests using a helper function called `fetchJson` that it provides.

`fetchJson` is a wrapper around the `fetch` API that automatically handles JSON deserialization, rejects when the HTTP response isn't 2XX or 3XX, and throws a particular type of error that allows the UI to display a meaningful notification. `fetchJson` also lets you add an `Authorization` header if you pass a `user` option.

Here is how you can use it in your Data Provider:

```diff
+import { fetchUtils } from 'react-admin';

+const fetchJson = (url, options = {}) => {
+   options.user = {
+       authenticated: true,
+       // use the authentication token from local storage (given the authProvider added it there)
+       token: localStorage.getItem('token')
+   };
+   return fetchUtils.fetchJson(url, options);
+};
// ...

const dataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
-       return fetch(url, { method: 'GET' });
+       return fetchJson(url, { method: 'GET' });
    },
    // ...
};
```

## Example REST Implementation

Let's say that you want to map the react-admin requests to a REST backend exposing the following API:

**getList**

```
GET http://path.to.my.api/posts?sort=["title","ASC"]&range=[0, 4]&filter={"author_id":12}

HTTP/1.1 200 OK
Content-Type: application/json
Content-Range: posts 0-4/27
[
    { "id": 126, "title": "allo?", "author_id": 12 },
    { "id": 127, "title": "bien le bonjour", "author_id": 12 },
    { "id": 124, "title": "good day sunshine", "author_id": 12 },
    { "id": 123, "title": "hello, world", "author_id": 12 },
    { "id": 125, "title": "howdy partner", "author_id": 12 }
]
```

**getOne**

```
GET http://path.to.my.api/posts/123

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }
```

**getMany**

```
GET http://path.to.my.api/posts?filter={"ids":[123,124,125]}

HTTP/1.1 200 OK
Content-Type: application/json
[
    { "id": 123, "title": "hello, world", "author_id": 12 },
    { "id": 124, "title": "good day sunshine", "author_id": 12 },
    { "id": 125, "title": "howdy partner", "author_id": 12 }
]
```

**getManyReference**

```
GET http://path.to.my.api/comments?sort=["created_at","DESC"]&range=[0, 24]&filter={"post_id":123}

HTTP/1.1 200 OK
Content-Type: application/json
Content-Range: comments 0-1/2
[
    { "id": 667, "title": "I agree", "post_id": 123 },
    { "id": 895, "title": "I don't agree", "post_id": 123 }
]
```

**create**

```
POST http://path.to.my.api/posts
{ "title": "hello, world", "author_id": 12 }

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }
```

**update**

```
PUT http://path.to.my.api/posts/123
{ "title": "hello, world!" }

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world!", "author_id": 12 }
```

**updateMany**

```
PUT http://path.to.my.api/posts?filter={"id":[123,124,125]}
{ "title": "hello, world!" }

HTTP/1.1 200 OK
Content-Type: application/json
[123, 124, 125]
```

**delete**

```
DELETE http://path.to.my.api/posts/123

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }
```

**deleteMany**

```
DELETE http://path.to.my.api/posts?filter={"id":[123,124,125]}

HTTP/1.1 200 OK
Content-Type: application/json
[123, 124, 125]
```

Here is an example implementation, that you can use as a base for your own Data Providers:

```js
import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = 'https://my.api.com/';
const httpClient = fetchUtils.fetchJson;

export default {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json, headers } = await httpClient(url, { signal: params.signal });
        return {
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        };
    },

    getOne: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`
        const { json } = await httpClient(url, { signal: params.signal });
        return { data: json };
    },

    getMany: async (resource, params) => {
        const query = {
            filter: JSON.stringify({ ids: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, { signal: params.signal });
        return { data: json };
    },

    getManyReference: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json, headers } = await httpClient(url, { signal: params.signal });
        return {
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        };
    },

    create: async (resource, params) => {
        const { json } = await httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        })
        return { data: json };
    },

    update: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        })
        return { data: json };
    },

    updateMany: async (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        })
        return { data: json };
    },

    delete: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url, {
            method: 'DELETE',
        });
        return { data: json };
    },

    deleteMany: async (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        });
        return { data: json };
    },
};
```

**Tip:** You may have noticed that we pass the `signal` parameter to the `httpClient` function in all query functions. This is to support automatic [Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation). You can learn more about this parameter in the section dedicated to [the `signal` parameter](#the-signal-parameter).

## Example GraphQL Implementation

There are two ways to implement a GraphQL Data Provider: 

- Write the queries and mutations by hand - that's what's described in this section.
- Take advantage of GraphQL introspection capabilities, and let the data provider "guess" the queries and mutations. For this second case, use [ra-data-graphql](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql) as the basis of your provider.

Let’s say that you want to map the react-admin requests to a GraphQL backend exposing the following API (inspired by [the Hasura GraphQL syntax](https://hasura.io/docs/latest/graphql/core/api-reference/graphql-api/index/)):

**getList**

```
query {
    posts(limit: 4, offset: 0, order_by: { title: 'asc' }, where: { author_id: { _eq: 12 } }) {
        id
        title
        body
        author_id
        created_at
    }
    posts_aggregate(where: where: { author_id: { _eq: 12 } }) {
        aggregate {
            count
        }
    }
}
```

**getOne**

```
query {
    posts_by_pk(id: 123) {
        id
        title
        body
        author_id
        created_at
    }
}
```

**getMany**

```
query {
    posts(where: { id: { _in: [123, 124, 125] } }) {
        id
        title
        body
        author_id
        created_at
    }
}
```

**getManyReference**

```
query {
    posts(where: { author_id: { _eq: 12 } }) {
        id
        title
        body
        author_id
        created_at
    }
}
```

**create**

```
mutation {
    insert_posts_one(objects: { title: "hello, world!", author_id: 12 }) {
        id
        title
        body
        author_id
        created_at
    }
}
```

**update**

```
mutation {
    update_posts_by_pk(pk_columns: { id: 123 }, _set: { title: "hello, world!" }) {
        id
        title
        body
        author_id
        created_at
    }
}
```

**updateMany**

```
mutation {
    update_posts(where: { id: { _in: [123, 124, 125] } }, _set: { title: "hello, world!" }) {
        affected_rows
    }
}
```

**delete**

```
mutation {
    delete_posts_by_pk(id: 123) {
        id
        title
        body
        author_id
        created_at
    }
}
```

**deleteMany**

```
mutation {
    delete_posts(where: { id: { _in: [123, 124, 125] } }) {
        affected_rows
    }
}
```

Here is an example implementation, that you can use as a base for your own Data Providers:

```js
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { omit } from "lodash";

const apiUrl = 'https://my.api.com/v1/graphql';

const client = new ApolloClient({
  uri: apiUrl,
  headers: { "x-graphql-token": "YYY" },
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }
});

const fields = {
  posts: "id title body author_id created_at",
  authors: "id name"
};

export const dataProvider = {
  getList: (resource, { sort, pagination, filter, signal }) => {
    const { field, order } = sort;
    const { page, perPage } = pagination;
    return client
      .query({
        query: gql`
            query ($limit: Int, $offset: Int, $order_by: [${resource}_order_by!], $where: ${resource}_bool_exp) {
                ${resource}(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
                    ${fields[resource]}
                }
                ${resource}_aggregate(where: $where) {
                    aggregate {
                        count
                    }
                }
            }`,
        variables: {
          limit: perPage,
          offset: (page - 1) * perPage,
          order_by: { [field]: order.toLowerCase() },
          where: Object.keys(filter).reduce(
            (prev, key) => ({
              ...prev,
              [key]: { _eq: filter[key] },
            }),
            {}
          ),
        },
        context: {
            fetchOptions: {
                signal,
            },
        },
      })
      .then((result) => ({
        data: result.data[resource],
        total: result.data[`${resource}_aggregate`].aggregate.count,
      }));
  },
  getOne: (resource, params) => {
    return client
      .query({
        query: gql`
            query ($id: Int!) {
                ${resource}_by_pk(id: $id) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          id: params.id,
        },
        context: {
            fetchOptions: {
                signal: params.signal,
            },
        },
      })
      .then((result) => ({ data: result.data[`${resource}_by_pk`] }));
  },
  getMany: (resource, params) => {
    return client
      .query({
        query: gql`
            query ($where: ${resource}_bool_exp) {
                ${resource}(where: $where) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          where: {
            id: { _in: params.ids },
          },
        },
        context: {
            fetchOptions: {
                signal: params.signal,
            },
        },
      })
      .then((result) => ({ data: result.data[resource] }));
  },
  getManyReference: (
    resource,
    { target, id, sort, pagination, filter, signal }
  ) => {
    const { field, order } = sort;
    const { page, perPage } = pagination;
    return client
      .query({
        query: gql`
            query ($limit: Int, $offset: Int, $order_by: [${resource}_order_by!], $where: ${resource}_bool_exp) {
                ${resource}(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
                    ${fields[resource]}
                }
                ${resource}_aggregate(where: $where) {
                    aggregate {
                        count
                    }
                }
            }`,
        variables: {
          limit: perPage,
          offset: (page - 1) * perPage,
          order_by: { [field]: order.toLowerCase() },
          where: Object.keys(filter).reduce(
            (prev, key) => ({
              ...prev,
              [key]: { _eq: filter[key] },
            }),
            { [target]: { _eq: id } }
          ),
        },
        context: {
            fetchOptions: {
                signal,
            },
        },
      })
      .then((result) => ({
        data: result.data[resource],
        total: result.data[`${resource}_aggregate`].aggregate.count,
      }));
  },
  create: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($data: ${resource}_insert_input!) {
                insert_${resource}_one(object: $data) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          data: omit(params.data, ['__typename']),
        },
      })
      .then((result) => ({
        data: result.data[`insert_${resource}_one`],
      }));
  },
  update: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($id: Int!, $data: ${resource}_set_input!) {
                update_${resource}_by_pk(pk_columns: { id: $id }, _set: $data) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          id: params.id,
          data: omit(params.data, ['__typename']),
        },
      })
      .then((result) => ({
        data: result.data[`update_${resource}_by_pk`],
      }));
  },
  updateMany: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($where: ${resource}_bool_exp!, $data: ${resource}_set_input!) {
                update_${resource}(where: $where, _set: $data) {
                    affected_rows
                }
            }`,
        variables: {
          where: {
            id: { _in: params.ids },
          },
          data: omit(params.data, ['__typename']),
        },
      })
      .then((result) => ({
        data: params.ids,
      }));
  },
  delete: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($id: Int!) {
                delete_${resource}_by_pk(id: $id) {
                    ${fields[resource]}
                }
            }`,
        variables: {
          id: params.id,
        },
      })
      .then((result) => ({
        data: result.data[`delete_${resource}_by_pk`],
      }));
  },
  deleteMany: (resource, params) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($where: ${resource}_bool_exp!) {
                delete_${resource}(where: $where) {
                    affected_rows
                }
            }`,
        variables: {
          where: {
            id: { _in: params.ids },
          },
        },
      })
      .then((result) => ({
        data: params.ids,
      }));
  },
};
```

**Tip:** You may have noticed that we pass the `signal` parameter to the apollo client in all query functions. This is to support automatic [Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation). You can learn more about this parameter in the section dedicated to [the `signal` parameter](#the-signal-parameter).

## Resource-Specific Business Logic

If you need to add custom business logic to a generic `dataProvider` for a specific resource, you can use the `withLifecycleCallbacks` helper:

```jsx
// in src/dataProvider.js
import { withLifecycleCallbacks } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = withLifecycleCallbacks(baseDataProvider, [
    {
        resource: 'posts',
        beforeDelete: async (params, dataProvider) => {
            // delete all comments related to the post
            // first, fetch the comments
            const { data: comments } = await dataProvider.getList('comments', {
                filter: { post_id: params.id },
                pagination: { page: 1, perPage: 1000 },
                sort: { field: 'id', order: 'DESC' },
            });
            // then, delete them
            await dataProvider.deleteMany('comments', { ids: comments.map(comment => comment.id) });

            return params;
        },
    },
]);
```

Check the [withLifecycleCallbacks](./withLifecycleCallbacks.md) documentation for more details.
