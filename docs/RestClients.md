---
layout: default
title: "REST Clients"
---

# REST Clients

Admin-on-rest can communicate with any REST server, regardless of the REST dialect it uses. Whether it's [JSON API](http://jsonapi.org/), [HAL](http://stateless.co/hal_specification.html), [OData](http://www.odata.org/) or a custom dialect, the only thing admin-on-rest needs is a REST client function. This is the place to translate REST requests to HTTP requests, and HTTP responses to REST responses.

![REST client architecture](./img/rest-client.png)

The `restClient` parameter of the `<Admin>` component must be a function with the following signature:

```jsx
/**
 * Execute the REST request and return a promise for a REST response
 *
 * @example
 * restClient(GET_ONE, 'posts', { id: 123 })
 *  => Promise.resolve({ data: { id: 123, title: "hello, world" } })
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
## Available Clients

Admin-on-rest ships 2 REST client by default:

* simple REST: [simpleRestClient](#simple-rest) serves mostly as an example. Incidentally, it is compatible with the [FakeRest](https://github.com/marmelab/FakeRest) API.
* **[JSON server](https://github.com/typicode/json-server)**: [jsonServerRestClient](#json-server-rest)

You can find REST clients for various backends in third-party repositories:

* **[Epilogue](https://github.com/dchester/epilogue)**: [dunghuynh/aor-epilogue-client](https://github.com/dunghuynh/aor-epilogue-client)
* **[Feathersjs](http://www.feathersjs.com/)**: [josx/aor-feathers-client](https://github.com/josx/aor-feathers-client)
* **[Firebase](https://firebase.google.com/)**: [sidferreira/aor-firebase-client](https://github.com/sidferreira/aor-firebase-client)
* **[GraphQL](http://graphql.org/)**: [marmelab/aor-graphql](https://github.com/marmelab/aor-graphql) (uses [Apollo](http://www.apollodata.com/))
* **[JSON API](http://jsonapi.org/)**: [moonlight-labs/aor-jsonapi-client](https://github.com/moonlight-labs/aor-jsonapi-client)
* Local JSON: [marmelab/aor-json-rest-client](https://github.com/marmelab/aor-json-rest-client). It doesn't even use HTTP. Use it for testing purposes.
* **[Loopback](http://loopback.io/)**: [kimkha/aor-loopback](https://github.com/kimkha/aor-loopback)
* **[Parse Server](https://github.com/ParsePlatform/parse-server)**: [leperone/aor-parseserver-client](https://github.com/leperone/aor-parseserver-client)
* **[PostgREST](http://postgrest.com/en/v0.4/)**: [tomberek/aor-postgrest-client](https://github.com/tomberek/aor-postgrest-client)

If you've written a REST client for another backend, and open-sourced it, please help complete this list with your package.

### Usage

This REST client fits APIs using simple GET parameters for filters and sorting. This is the dialect used for instance in [FakeRest](https://github.com/marmelab/FakeRest).

| REST verb            | API calls
|----------------------|----------------------------------------------------------------
| `GET_LIST`           | `GET http://my.api.url/posts?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}`
| `GET_ONE`            | `GET http://my.api.url/posts/123`
| `CREATE`             | `POST http://my.api.url/posts/123`
| `UPDATE`             | `PUT http://my.api.url/posts/123`
| `DELETE`             | `DELETE http://my.api.url/posts/123`
| `GET_MANY`           | `GET http://my.api.url/posts?filter={ids:[123,456,789]}`
| `GET_MANY_REFERENCE` | `GET http://my.api.url/posts?filter={author_id:345}`

**Note**: The simple REST client expects the API to include a `Content-Range` header in the response to `GET_LIST` calls. The value must be the total number of resources in the collection. This allows admin-on-rest to know how many pages of resources there are in total, and build the pagination controls.

```
Content-Range: posts 0-24/319
```

If your API is on another domain as the JS code, you'll need to whitelist this header with an `Access-Control-Expose-Headers` [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header.

```
Access-Control-Expose-Headers: Content-Range
```

Initialize the client with the REST backend URL, and pass the result to the `restClient` prop of the `<Admin>` component:

```jsx
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

Here is how this client maps request types to API calls:

| REST verb            | API calls
|----------------------|----------------------------------------------------------------
| `GET_LIST`           | `GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]&filter={title:'bar'}`
| `GET_ONE`            | `GET http://my.api.url/posts/123`
| `CREATE`             | `POST http://my.api.url/posts/123`
| `UPDATE`             | `PUT http://my.api.url/posts/123`
| `DELETE`             | `DELETE http://my.api.url/posts/123`
| `GET_MANY`           | `GET http://my.api.url/posts?filter={ids:[123,456,789]}`
| `GET_MANY_REFERENCE` | `GET http://my.api.url/posts?filter={author_id:345}`

**Note**: The simple REST client expects the API to include a `Content-Range` header in the response to `GET_LIST` calls. The value must be the total number of resources in the collection. This allows admin-on-rest to know how many pages of resources there are in total, and build the pagination controls.

```
Content-Range: posts 0-24/319
```

If your API is on another domain as the JS code, you'll need to whitelist this header with an `Access-Control-Expose-Headers` [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header.

```
Access-Control-Expose-Headers: Content-Range
```

## Adding Custom Headers

Both the `simpleRestClient` and the `jsonServerRestClient` functions accept an HTTP client function as second argument. By default, they use admin-on-rest's `fetchUtils.fetchJson()` as http client. It's similar to HTML5 `fetch()`, except it handles JSON decoding and HTTP error codes automatically.

That means that if you need to add custom headers to your requests, you can just *wrap* the `fetchJson()` call inside your own function:

```jsx
import { simpleRestClient, fetchUtils, Admin, Resource } from 'admin-on-rest';
const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('X-Custom-Header', 'foobar');
    return fetchUtils.fetchJson(url, options);
}
const restClient = simpleRestClient('http://path.to.my.api/', httpClient);

const App = () => (
    <Admin restClient={restClient} title="Example Admin">
      <Resource name="posts" list={PostList} />
    </Admin>
);
```

Now all the requests to the REST API will contain the `X-Custom-Header: foobar` header.

**Tip**: The most common usage of custom headers is for authentication. `fetchJson` has built-on support for the `Authorization` token header:

```jsx
const httpClient = (url, options = {}) => {
    options.user = {
        authenticated: true,
        token: 'SRTRDFVESGNJYTUKTYTHRG'
    }
    return fetchUtils.fetchJson(url, options);
}
```

Now all the requests to the REST API will contain the `Authorization: SRTRDFVESGNJYTUKTYTHRG` header.

## Decorating your REST Client (Example of File Upload)

Instead of writing your own REST client, you can enhance the capabilities of an existing REST client. You can even restrict the customization on a given resource.

For instance, if you want to use upload components (such as `<ImageInput />` one), you can decorate the provider the following way:

```jsx
// in addUploadFeature.js
/**
 * Convert a `File` object returned by the upload input into a base 64 string. 
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of REST client decoration.
 */
const convertFileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
const addUploadFeature = requestHandler => (type, resource, params) => {
    if (type === 'UPDATE' && resource === 'posts') {
        if (params.data.pictures && params.data.pictures.length) {
            // only freshly dropped pictures are instance of File
            const formerPictures = params.data.pictures.filter(p => !(p instanceof File));
            const newPictures = params.data.pictures.filter(p => p instanceof File);

            return Promise.all(newPictures.map(convertFileToBase64))
                .then(base64Pictures => base64Pictures.map(picture64 => ({
                    src: picture64,
                    title: `${params.data.title}`,
                })))
                .then(transformedNewPictures => requestHandler(type, resource, {
                    ...params,
                    data: {
                        ...params.data,
                        pictures: [...transformedNewPictures, ...formerPictures],
                    },
                }));
        }
    }
    // for other request types and reources, fall back to the defautl request handler
    return requestHandler(type, resource, params);
};

export default addUploadFeature;
```

To enhance a client with the upload feature, compose the `addUploadFeature` function with the REST client function:

```jsx
import jsonRestClient from 'aor-json-rest-client';
import addUploadFeature from './addUploadFeature';

const restClient = jsonRestClient('http://path.to.my.api/');
const uploadCapableClient = addUploadFeature(restClient);

const App = () => (
    <Admin restClient={uploadCapableClient} title="Example Admin">
      <Resource name="posts" list={PostList} />
    </Admin>
);

```

## Writing Your Own REST Client

Quite often, there is no REST client that suits you API - either in the core clients, or in the third-party clients. In such cases, you'll have to write your own REST client.

A REST client is a function that receives a request, and returns a promise for a response. Both the request and the response format are standardized.

```jsx
/**
 * Query a REST client and return a promise for a response
 *
 * @example
 * restClient(GET_ONE, 'posts', { id: 123 })
 *  => Promise.resolve({ data: { id: 123, title: "hello, world" } })
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the action type
 * @returns {Promise} the Promise for a response
 */
const restClient = (type, resource, params) => new Promise();
```

When you write a REST client, your job is to route requests to your API backend(s), then transform their response to match the format returned by the REST client.

### Request Format

REST requests require a *type* (e.g. `GET_ONE`), a *resource* (e.g. 'posts') and a set of *parameters*.

*Tip*: In comparison, HTTP requests require a *verb* (e.g. 'GET'), an *url* (e.g. 'http://myapi.com/posts'), a list of *headers* (like `Content-Type`) and a *body*.

Possible types are:

Type                 | Usage                                            | Params format
-------------------- | ------------------------------------------------ | ----------------
`GET_LIST`           | Search for resources                             | `{ pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }`
`GET_ONE`            | Read a single resource, by id                    | `{ id: {mixed} }`
`CREATE`             | Create a single resource                         | `{ data: {Object} }`
`UPDATE`             | Update a single resource                         | `{ id: {mixed}, data: {Object}, previousData: {Object} }`
`DELETE`             | Delete a single resource                         | `{ id: {mixed}, previousData: {Object} }`
`GET_MANY`           | Read a list of resource, by ids                  | `{ ids: {mixed[]} }`
`GET_MANY_REFERENCE` | Read a list of resources related to another one  | `{ target: {string}, id: {mixed}, pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }`

Here are several examples of how Admin-on-rest can call the REST client with these types:

```jsx
restClient(GET_LIST, 'posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
    filter: { author_id: 12 },
});
restClient(GET_ONE, 'posts', { id: 123 });
restClient(CREATE, 'posts', { data: { title: "hello, world" } });
restClient(UPDATE, 'posts', {
    id: 123,
    data: { title: "hello, world!" },
    previousData: { title: "previous title" }
});
restClient(DELETE, 'posts', {
    id: 123,
    previousData: { title: "hello, world" }
});
restClient(GET_MANY, 'posts', { ids: [123, 124, 125] });
restClient(GET_MANY_REFERENCE, 'comments', {
    target: 'post_id',
    id: 123,
    sort: { field: 'created_at', order: 'DESC' }
});
```

### Example Request Processing

Let's say that you want to map the REST client requests to a REST backend, like so:

 * `GET_LIST  => GET http://path.to.my.api/posts?sort=['title','ASC']&range=[0, 24]&filter={author_id:12}`
 * `GET_ONE   => GET http://path.to.my.api/posts/123`
 * `CREATE    => POST http://path.to.my.api/posts`
 * `UPDATE    => PUT http://path.to.my.api/posts/123`
 * `DELETE    => DELETE http://path.to.my.api/posts/123`
 * `GET_MANY  => GET http://path.to.my.api/posts?filter={ids:[123,124,125]}`
 * `GET_MANY_REFERENCE  => GET http://path.to.my.api/comments?sort=['created_at','DESC']&range=[0, 24]&filter={post_id:123}`

REST clients often use a `switch` statement, and finish by a call to `fetch()`. Here is an example implementation:

```js
// in myRestClient.js
import { stringify } from 'query-string';
import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    GET_MANY,
    GET_MANY_REFERENCE,
} from 'admin-on-rest';

const apiUrl = 'http://path.to.my.api/';

/**
 * Maps admin-on-rest queries to my REST API
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a data response
 */
export default (type, resource, params) => {
    let url = '';
    const options = { 
        headers : new Headers({
            Accept: 'application/json',
        }),
    };
    switch (type) {
        case GET_LIST: {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const query = {
                sort: JSON.stringify([field, order]),
                range: JSON.stringify([
                    (page - 1) * perPage,
                    page * perPage - 1,
                ]),
                filter: JSON.stringify(params.filter),
            };
            url = `${apiUrl}/${resource}?${stringify(query)}`;
            break;
        }
        case GET_ONE:
            url = `${apiUrl}/${resource}/${params.id}`;
            break;
        case CREATE:
            url = `${apiUrl}/${resource}`;
            options.method = 'POST';
            options.body = JSON.stringify(params.data);
            break;
        case UPDATE:
            url = `${apiUrl}/${resource}/${params.id}`;
            options.method = 'PUT';
            options.body = JSON.stringify(params.data);
            break;
        case DELETE:
            url = `${apiUrl}/${resource}/${params.id}`;
            options.method = 'DELETE';
            break;
        case GET_MANY: {
            const query = {
                filter: JSON.stringify({ id: params.ids }),
            };
            url = `${apiUrl}/${resource}?${stringify(query)}`;
            break;
        }
        case GET_MANY_REFERENCE: {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const query = {
                sort: JSON.stringify([field, order]),
                range: JSON.stringify([
                    (page - 1) * perPage,
                    page * perPage - 1,
                ]),
                filter: JSON.stringify({
                    ...params.filter,
                    [params.target]: params.id,
                }),
            };
            url = `${apiUrl}/${resource}?${stringify(query)}`;
            break;
        }
        default:
            throw new Error(`Unsupported REST client request type ${type}`);
    }

    return fetch(url, options)
        .then(res => res.json())
        .then(response =>
            /* Convert HTTP Response to REST client Response */
            /* Covered in the next section */
        );
};
```

### Response Format

Admin-on-rest expects responses from REST clients to be objects with a `data` property. The data format depends on the request type.

Type                 | Response format
-------------------- | ----------------
`GET_LIST`           | `{ data: {Record[]}, total: {int} }`
`GET_ONE`            | `{ data: {Record} }`
`CREATE`             | `{ data: {Record} }`
`UPDATE`             | `{ data: {Record} }`
`DELETE`             | `{ data: {Record} }`
`GET_MANY`           | `{ data: {Record[]} }`
`GET_MANY_REFERENCE` | `{ data: {Record[]}, total: {int} }`

A `{Record}` is an object literal with at least an `id` property, e.g. `{ id: 123, title: "hello, world" }`.

Building up on the previous example, here are example responses matching the format expected by Admin-on-rest:

```jsx
restClient(GET_LIST, 'posts', {
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

restClient(GET_ONE, 'posts', { id: 123 })
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world" }
// }

restClient(CREATE, 'posts', { data: { title: "hello, world" } })
.then(response => console.log(response));
// {
//     data: { id: 450, title: "hello, world" }
// }

restClient(UPDATE, 'posts', {
    id: 123,
    data: { title: "hello, world!" },
    previousData: { title: "previous title" }
})
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world!" }
// }

restClient(DELETE, 'posts', {
    id: 123,
    previousData: { title: "hello, world!" }
})
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world" }
// }

restClient(GET_MANY, 'posts', { ids: [123, 124, 125] })
.then(response => console.log(response));
// {
//     data: [
//         { id: 123, title: "hello, world" },
//         { id: 124, title: "good day sunshise" },
//         { id: 125, title: "howdy partner" },
//     ]
// }

restClient(GET_MANY_REFERENCE, 'comments', {
    target: 'post_id',
    id: 123,
    sort: { field: 'created_at', order: 'DESC' }
});
.then(response => console.log(response));
// {
//     data: [
//         { id: 667, title: "I agree", post_id: 123 },
//         { id: 895, title: "I don't agree", post_id: 123 },
//     ],
//     total: 2,
// }
```

### Example Response Processing

Let's continue with the REST backend example. This backend returns responses as follows:

```
GET http://path.to.my.api/posts?sort=['title','ASC']&range=[0, 4]&filter={author_id:12}
Content-Range: posts 0-4/27
[
    { "id": 126, "title": "allo?", "author_id": 12 },
    { "id": 127, "title": "bien le bonjour", "author_id": 12 },
    { "id": 124, "title": "good day sunshine", "author_id": 12 },
    { "id": 123, "title": "hello, world", "author_id": 12 },
    { "id": 125, "title": "howdy partner", "author_id": 12 }
]

GET http://path.to.my.api/posts/123
{ "id": 123, "title": "hello, world", "author_id": 12 }

POST http://path.to.my.api/posts
{ "id": 123, "title": "hello, world", "author_id": 12 }

PUT http://path.to.my.api/posts/123
{ "id": 123, "title": "hello, world", "author_id": 12 }

DELETE http://path.to.my.api/posts/123
{ "id": 123, "title": "hello, world", "author_id": 12 }

GET http://path.to.my.api/posts?filter={ids:[123,124,125]}
[
    { "id": 123, "title": "hello, world", "author_id": 12 },
    { "id": 124, "title": "good day sunshine", "author_id": 12 },
    { "id": 125, "title": "howdy partner", "author_id": 12 }
]

GET http://path.to.my.api/comments?sort=['created_at','DESC']&range=[0, 24]&filter={post_id:123}
Content-Range: comments 0-1/2
[
    { "id": 667, "title": "I agree", "post_id": 123 },
    { "id": 895, "title": "I don't agree", "post_id": 123 }
]
```

The REST client must therefore transform the response from the API backend to the expected response format.

```js
// in myRestClient.js
import { stringify } from 'query-string';
import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    GET_MANY,
    GET_MANY_REFERENCE,
} from 'admin-on-rest';

const apiUrl = 'http://path.to.my.api/';

/**
 * Maps admin-on-rest queries to my REST API
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a data response
 */
export default (type, resource, params) => {
    let url = '';
    const options = { 
        headers : new Headers({
            Accept: 'application/json',
        }),
    };
    switch (type) {
        /* Prepare url and options as above */
    }

    let headers;
    return fetch(url, options)
        .then(res => {
            headers = res.headers;
            return res.json();
        })
        .then(json => {
            switch (type) {
                case GET_LIST:
                case GET_MANY_REFERENCE:
                    if (!headers.has('content-range')) {
                        throw new Error(
                            'The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?'
                        );
                    }
                    return {
                        data: json,
                        total: parseInt(
                            headers
                                .get('content-range')
                                .split('/')
                                .pop(),
                            10
                        ),
                    };
                case CREATE:
                    return { data: { ...params.data, id: json.id } };
                default:
                    return { data: json };
            }
        });
};
```

### Error Format

When the API backend returns an error, the REST client should `throw` an `Error` object. This object should contain a `status` property with the HTTP response code (404, 500, etc.). Admin-on-rest inspects this error code, and uses it for [authentication](./Authentication.md) (in case of 401 or 403 errors). Besides, Admin-on-rest displays the error `message` on screen in a temporary notification.

### Example implementation

Check the code from the [simple REST client](https://github.com/marmelab/admin-on-rest/blob/master/src/rest/simple.js): it's a good starting point for a custom rest client implementation.
