---
layout: default
title: "REST Clients"
---

# REST Clients

Admin-on-rest can communicate with any REST server, regardless of the REST dialect it uses. Whether it's [JSON API](http://jsonapi.org/), [HAL](http://stateless.co/hal_specification.html), [OData](http://www.odata.org/) or a custom dialect, the only thing admin-on-rest needs is a REST client function. This is the place to translate REST requests to HTTP requests, and HTTP responses to REST responses.

The `restClient` parameter of the `<Admin>` component, must be a function with the following signature:

```js
/**
 * Execute the REST request and return a promise for a REST response
 *
 * @example
 * restClient(GET_ONE, 'posts', { id: 123 })
 *  => new Promise(resolve => resolve({ id: 123, title: "hello, world" }))
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the action type
 * @returns {Promise} the Promise for a REST response
 */
const restClient = (type, resource, params) => new Promise();
```

You can find a REST client example implementation in [`src/rest/simple.js`](https://github.com/marmelab/admin-on-rest/blob/master/src/rest/simple.js);

The `restClient` is also the ideal place to add custom HTTP headers, authentication, etc.

## Core REST clients

Admin-on-rest bundles two REST clients that you can use if your API uses a similar REST dialect.

### Simple REST

This REST client fits APIs using simple GET parameters for filters and sorting. This is the dialect used for instance in [FakeRest](https://github.com/marmelab/FakeRest).

| REST verb      | API calls
|----------------|----------------------------------------------------------------
| `GET_LIST`     | `GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]`
| `GET_MATCHING` | `GET http://my.api.url/posts?filter={title:'bar'}`
| `GET_ONE`      | `GET http://my.api.url/posts/123`
| `GET_MANY`     | `GET http://my.api.url/posts?filter={ids:[123,456,789]}`
| `UPDATE`       | `PUT http://my.api.url/posts/123`
| `CREATE`       | `POST http://my.api.url/posts/123`
| `DELETE`       | `DELETE http://my.api.url/posts/123`

Here is how to use it in your admin:

```js
// in src/App.js
import React from 'react';

import { simpleRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';

const App = () => (
    <Admin restClient={simpleRestClient('http://path.to.my.api/')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

### JSON Server REST

This REST client fits APIs powered by [JSON Server](https://github.com/typicode/json-server), such as [JSONPlaceholder](http://jsonplaceholder.typicode.com/).

| REST verb      | API calls
|----------------|----------------------------------------------------------------
| `GET_LIST`     | `GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24`
| `GET_MATCHING` | `GET http://my.api.url/posts?title=bar`
| `GET_ONE`      | `GET http://my.api.url/posts/123`
| `GET_MANY`     | `GET http://my.api.url/posts/123, GET http://my.api.url/posts/456, GET http://my.api.url/posts/789`
| `UPDATE`       | `PUT http://my.api.url/posts/123`
| `CREATE`       | `POST http://my.api.url/posts/123`
| `DELETE`       | `DELETE http://my.api.url/posts/123`

Here is how to use it in your admin:

```js
// in src/App.js
import React from 'react';

import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

## Writing your own REST client

Quite often, none of the the core REST clients match your API exactly. In such cases, you'll have to write your own REST client. But don't be afraid, it's easy!

### Request Format

REST requests require a *type* (e.g. `GET_ONE`), a *resource* (e.g. 'posts') and a set of *parameters*.

*Tip*: In comparison, HTTP requests require a *verb* (e.g. 'GET'), an *url* (e.g. 'http://myapi.com/posts'), a list of *headers* (like `Content-Type`) and a *body*.

Possible types are:

Type | Params format
---- | ----------------
`GET_LIST`           | `{ pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} } }`
`GET_ONE`            | `{ id: {mixed} }`
`CREATE`             | `{ data: {Object} }`
`UPDATE`             | `{ id: {mixed}, data: {Object} }`
`DELETE`             | `{ id: {mixed} }`
`GET_MANY`           | `{ ids: {mixed[]} }`
`GET_MANY_REFERENCE` | `{ target: {string}, id: {mixed} }`
`GET_MATCHING`       | `{ filter: {Object} }`

Examples:

```js
restClient(GET_LIST, 'posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
});
restClient(GET_ONE, 'posts', { id: 123 });
restClient(CREATE, 'posts', { title: "hello, world" });
restClient(UPDATE, 'posts', { id: 123, { title: "hello, world!" } });
restClient(DELETE, 'posts', { id: 123 });
restClient(GET_MANY, 'posts', { ids: [123, 124, 125] });
restClient(GET_MANY_REFERENCE, 'comments', { target: 'post_id', id: 123 });
restClient(GET_MATCHING, 'posts', { filter: { title: 'hello' } });
```

### Response Format

REST responses are objects. The format depends on the type.

Type | Response format
---- | ----------------
`GET_LIST`           | `{ data: {Record[]}, total: {int} }`
`GET_ONE`            | `{Record}`
`CREATE`             | `{Record}`
`UPDATE`             | `{Record}`
`DELETE`             | `{Record}`
`GET_MANY`           | `{Record[]}`
`GET_MANY_REFERENCE` | `{Record[]}`
`GET_MATCHING`       | `{Record[]}`

A `{Record}` is an object literal with at least an `id` property, e.g. `{ id: 123, title: "hello, world" }`.

Examples:

```js
restClient(GET_LIST, 'posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
}).then(response => console.log(response));
// {
//     data: [
//         { id: 126, title: "allo?" },
//         { id: 127, title: "bien le bonjour" },
//         { id: 124, title: "good day sunshise" },
//         { id: 123, title: "hello, world" },
//         { id: 125, title: "howdy partner" },
//     ],
//     total: 27
// }

restClient(GET_ONE, 'posts', { id: 123 })
.then(record => console.log(record));
// {
//     id: 123,
//     title: "hello, world"
// }

restClient(CREATE, 'posts', { title: "hello, world" });
// {
//     id: 450,
//     title: "hello, world"
// }

restClient(UPDATE, 'posts', { id: 123, { title: "hello, world!" } });
// {
//     id: 123,
//     title: "hello, world!"
// }

restClient(DELETE, 'posts', { id: 123 });
// {
//     id: 123,
//     title: "hello, world"
// }

restClient(GET_MANY, 'posts', { ids: [123, 124, 125] })
.then(records => console.log(records));
// [
//     { id: 123, title: "hello, world" },
//     { id: 124, title: "good day sunshise" },
//     { id: 125, title: "howdy partner" },
// ]

restClient(GET_MANY_REFERENCE, 'comments', { target: 'post_id', id: 123 });
.then(records => console.log(records));
// [
//     { id: 667, title: "I agree", post_id: 123 },
//     { id: 895, title: "I don't agree", post_id: 123 },
// ]

restClient(GET_MATCHING, 'posts', { filter: { title: 'hello' } })
.then(record => console.log(record));
// [
//     { id: 123, title: "hello, world" },
// ]
```

### Error Format

To be completed
