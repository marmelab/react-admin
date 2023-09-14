---
layout: default
title: "Writing A Data Provider"
---

# Writing A Data Provider

APIs are so diverse that quite often, none of [the available Data Providers](./DataProviderList.md) suit you API. In such cases, you'll have to write your own Data Provider. Don't worry, it usually takes only a couple of hours. 

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
    meta?: any;
}
interface GetListResult {
    data: Record[];
    total?: number;
    // if using partial pagination
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
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
//     total: 27
// }
```

## `getOne`

React-admin calls `dataProvider.getOne()` to fetch a single record by `id`.

**Interface**

```tsx
interface GetOneParams {
    id: Identifier;
    meta?: any;
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

React-admin calls `dataProvider.getManyReference()` to fetch several records related to another one.

**Interface**

```tsx
interface GetManyReferenceParams {
    target: string;
    id: Identifier;
    pagination: { page: number, perPage: number };
    sort: { field: string, order: 'ASC' | 'DESC' };
    filter: any;
    meta?: any;
}
interface GetManyReferenceResult {
    data: Record[];
    total?: number;
    // if using partial pagination
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
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
function delete(resource: string, params: DeleteParams): Promise<DeleteResult>
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

## The `meta` Parameter

All data provider methods accept a `meta` parameter. React-admin core components never set this `meta` when calling the data provider. It's designed to let you pass additional parameters to your data provider.

For instance, you could pass an option to embed related records in the response:

```jsx
const { data, isLoading, error } = useGetOne(
    'books',
    { id, meta: { _embed: 'authors' } },
);
```

It's up to you to use this `meta` parameter in your data provider.

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
        const { json, headers } = await httpClient(url);
        return {
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        };
    },

    getOne: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`
        const { json } = await httpClient(url);
        return { data: json };
    },

    getMany: async (resource, params) => {
        const query = {
            filter: JSON.stringify({ ids: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url);
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
        const { json, headers } = await httpClient(url);
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
  getList: (resource, { sort, pagination, filter }) => {
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
      })
      .then((result) => ({ data: result.data[resource] }));
  },
  getManyReference: (
    resource,
    { target, id, sort, pagination, filter }
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