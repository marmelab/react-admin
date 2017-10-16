---
layout: default
title: "Data Providers"
---

# Data Providers

React-admin can communicate with any API, whether it uses REST, GraphQL, or even SOAP, regardless of the dialect it uses. For REST servers, it can be [JSON API](http://jsonapi.org/), [HAL](http://stateless.co/hal_specification.html), [OData](http://www.odata.org/) or a custom dialect. The only thing react-admin needs is a Data Provider function. This is the place to translate data queries to HTTP requests, and HTTP responses to data responses.

![Data Provider architecture](./img/rest-client.png)

The `dataProvider` parameter of the `<Admin>` component, must be a function with the following signature:

```jsx
/**
 * Query a data provider and return a promise for a response
 *
 * @example
 * dataProvider(GET_ONE, 'posts', { id: 123 })
 *  => Promise.resolve({ data: { id: 123, title: "hello, world" } })
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the action type
 * @returns {Promise} the Promise for a response
 */
const dataProvider = (type, resource, params) => new Promise();
```

You can find a Data Provider example implementation in [`packages/ra-data-simple-rest/src/index.js`](https://github.com/marmelab/react-admin/blob/master/packages/ra-data-simple-rest/src/index.js);

The `dataProvider` is also the ideal place to add custom HTTP headers, authentication, etc.

## Available Providers

the react-admin projects includes 2 Data Providers:

* simple REST: [simpleRestClient](#simple-rest) serves mostly as an example. Incidentally, it is compatible with the [FakeRest](https://github.com/marmelab/FakeRest) API.
* **[JSON server](https://github.com/typicode/json-server)**: [jsonServerRestClient](#json-server-rest)

You can find Data Providers for various backends in third-party repositories:

* **[Epilogue](https://github.com/dchester/epilogue)**: [dunghuynh/aor-epilogue-client](https://github.com/dunghuynh/aor-epilogue-client)
* **[Feathersjs](http://www.feathersjs.com/)**: [josx/aor-feathers-client](https://github.com/josx/aor-feathers-client)
* **[Firebase](https://firebase.google.com/)**: [sidferreira/aor-firebase-client](https://github.com/sidferreira/aor-firebase-client)
* **[GraphQL](http://graphql.org/)**: [marmelab/aor-simple-graphql-client](https://github.com/marmelab/aor-simple-graphql-client) (uses [Apollo](http://www.apollodata.com/))
* **[JSON API](http://jsonapi.org/)**: [moonlight-labs/aor-jsonapi-client](https://github.com/moonlight-labs/aor-jsonapi-client)
* Local JSON: [marmelab/aor-json-rest-client](https://github.com/marmelab/aor-json-rest-client). It doesn't even use HTTP. Use it for testing purposes.
* **[Loopback](http://loopback.io/)**: [kimkha/aor-loopback](https://github.com/kimkha/aor-loopback)
* **[Parse Server](https://github.com/ParsePlatform/parse-server)**: [leperone/aor-parseserver-client](https://github.com/leperone/aor-parseserver-client)
* **[PostgREST](http://postgrest.com/en/v0.4/)**: [tomberek/aor-postgrest-client](https://github.com/tomberek/aor-postgrest-client)

If you've written a Data Provider for another backend, and open-sourced it, please help complete this list with your package.

### Simple REST

This Data Provider fits REST APIs using simple GET parameters for filters and sorting. This is the dialect used for instance in [FakeRest](https://github.com/marmelab/FakeRest).

| REST verb            | API calls
|----------------------|----------------------------------------------------------------
| `GET_LIST`           | `GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]&filter={title:'bar'}`
| `GET_ONE`            | `GET http://my.api.url/posts/123`
| `CREATE`             | `POST http://my.api.url/posts/123`
| `UPDATE`             | `PUT http://my.api.url/posts/123`
| `DELETE`             | `DELETE http://my.api.url/posts/123`
| `GET_MANY`           | `GET http://my.api.url/posts?filter={ids:[123,456,789]}`
| `GET_MANY_REFERENCE` | `GET http://my.api.url/posts?filter={author_id:345}`

**Note**: The simple REST client expects the API to include a `Content-Range` header in the response to `GET_LIST` calls. The value must be the total number of resources in the collection. This allows react-admin to know how many pages of resources there are in total, and build the pagination controls.

```
Content-Range: posts 0-24/319
```

If your API is on another domain as the JS code, you'll need to whitelist this header with an `Access-Control-Expose-Headers` [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header.

```
Access-Control-Expose-Headers: Content-Range
```

Here is how to use it in your admin:

```jsx
// in src/App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import simpleRestClient from 'ra-data-simple-rest';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={simpleRestClient('http://path.to.my.api/')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

### JSON Server REST

This Data Provider fits REST APIs powered by [JSON Server](https://github.com/typicode/json-server), such as [JSONPlaceholder](http://jsonplaceholder.typicode.com/).

| REST verb            | API calls
|----------------------|----------------------------------------------------------------
| `GET_LIST`           | `GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24&title=bar`
| `GET_ONE`            | `GET http://my.api.url/posts/123`
| `CREATE`             | `POST http://my.api.url/posts/123`
| `UPDATE`             | `PUT http://my.api.url/posts/123`
| `DELETE`             | `DELETE http://my.api.url/posts/123`
| `GET_MANY`           | `GET http://my.api.url/posts/123, GET http://my.api.url/posts/456, GET http://my.api.url/posts/789`
| `GET_MANY_REFERENCE` | `GET http://my.api.url/posts?author_id=345`

**Note**: The JSON Server REST Data Provider expects the API to include a `X-Total-Count` header in the response to `GET_LIST` calls. The value must be the total number of resources in the collection. This allows react-admin to know how many pages of resources there are in total, and build the pagination controls.

```
X-Total-Count: 319
```

If your API is on another domain as the JS code, you'll need to whitelist this header with an `Access-Control-Expose-Headers` [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header.

```
Access-Control-Expose-Headers: X-Total-Count
```

Here is how to use it in your admin:

```jsx
// in src/App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerRestClient from 'ra-data-json-server';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

### Adding Custom Headers

Both the `simpleRestClient` and the `jsonServerRestClient` functions accept an HTTP client function as second argument. By default, they use react-admin's `fetchUtils.fetchJson()` as HTTP client. It's similar to HTML5 `fetch()`, except it handles JSON decoding and HTTP error codes automatically.

That means that if you need to add custom headers to your requests, you just need to *wrap* the `fetchJson()` call inside your own function:

```jsx
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestClient from 'ra-data-simple-rest';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('X-Custom-Header', 'foobar');
    return fetchUtils.fetchJson(url, options);
}
const dataProvider = simpleRestClient('http://localhost:3000', httpClient);

render(
    <Admin dataProvider={dataProvider} title="Example Admin">
       ...
    </Admin>,
    document.getElementById('root')
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

## Decorating your Data Provider (Example of File Upload)

Instead of writing your own Data Provider or using a third-party one, you can enhance its capabilities on a given resource. For instance, if you want to use upload components (such as `<ImageInput />` one), you can decorate it the following way:

```jsx
/**
 * Convert a `File` object returned by the upload input into
 * a base 64 string. That's easier to use on FakeRest, used on
 * the ng-admin example. But that's probably not the most optimized
 * way to do in a production database.
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
const addUploadCapabilities = requestHandler => (type, resource, params) => {
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

    return requestHandler(type, resource, params);
};

export default addUploadCapabilities;
```

This way, you can use simply your upload-capable client to your app calling this decorator:

```jsx
import jsonServerRestClient from 'ra-data-json-server';
import addUploadFeature from './addUploadFeature';

const dataProvider = jsonServerdataProvider(data, true);
const uploadCapableDataProvider = addUploadFeature(dataProvider);

render(
    <Admin restClient={uploadCapableDataProvider} title="Example Admin">
        // [...]
    </Admin>,
    document.getElementById('root'),
);

```

## Writing Your Own Data Provider

Quite often, none of the the core Data Providers match your API exactly. In such cases, you'll have to write your own Data Provider. But don't be afraid, it's easy!

### Request Format

Data queries require a *type* (e.g. `GET_ONE`), a *resource* (e.g. 'posts') and a set of *parameters*.

*Tip*: In comparison, HTTP requests require a *verb* (e.g. 'GET'), an *url* (e.g. 'http://myapi.com/posts'), a list of *headers* (like `Content-Type`) and a *body*.

Possible types are:

Type                 | Params format
-------------------- | ----------------
`GET_LIST`           | `{ pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }`
`GET_ONE`            | `{ id: {mixed} }`
`CREATE`             | `{ data: {Object} }`
`UPDATE`             | `{ id: {mixed}, data: {Object}, previousData: {Object} }`
`DELETE`             | `{ id: {mixed}, previousData: {Object} }`
`GET_MANY`           | `{ ids: {mixed[]} }`
`GET_MANY_REFERENCE` | `{ target: {string}, id: {mixed}, pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }`

Examples:

```jsx
dataProvider(GET_LIST, 'posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
    filter: { author_id: 12 },
});
dataProvider(GET_ONE, 'posts', { id: 123 });
dataProvider(CREATE, 'posts', { data: { title: "hello, world" } });
dataProvider(UPDATE, 'posts', {
    id: 123,
    data: { title: "hello, world!" },
    previousData: { title: "previous title" }
});
dataProvider(DELETE, 'posts', {
    id: 123,
    previousData: { title: "hello, world" }
});
dataProvider(GET_MANY, 'posts', { ids: [123, 124, 125] });
dataProvider(GET_MANY_REFERENCE, 'comments', {
    target: 'post_id',
    id: 123,
    sort: { field: 'created_at', order: 'DESC' }
});
```

### Response Format

Data responses are objects. The format depends on the type.

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

Examples:

```jsx
dataProvider(GET_LIST, 'posts', {
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

dataProvider(GET_ONE, 'posts', { id: 123 })
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world" }
// }

dataProvider(CREATE, 'posts', { data: { title: "hello, world" } })
.then(response => console.log(response));
// {
//     data: { id: 450, title: "hello, world" }
// }

dataProvider(UPDATE, 'posts', {
    id: 123,
    data: { title: "hello, world!" },
    previousData: { title: "previous title" }
})
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world!" }
// }

dataProvider(DELETE, 'posts', {
    id: 123,
    previousData: { title: "hello, world!" }
})
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world" }
// }

dataProvider(GET_MANY, 'posts', { ids: [123, 124, 125] })
.then(response => console.log(response));
// {
//     data: [
//         { id: 123, title: "hello, world" },
//         { id: 124, title: "good day sunshise" },
//         { id: 125, title: "howdy partner" },
//     ]
// }

dataProvider(GET_MANY_REFERENCE, 'comments', {
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

### Error Format

When the API returns an error, the Data Provider should `throw` an `Error` object. This object should contain a `status` property with the HTTP response code (404, 500, etc.). React-admin inspects this error code, and uses it for [authentication](./Authentication.md) (in case of 401 or 403 errors).

### Example implementation

Check the code from the [simple REST client](https://github.com/marmelab/react-admin/blob/master/packages/ra-data-simple-rest/src/index.js): it's a good starting point for a custom Data Provider implementation.
