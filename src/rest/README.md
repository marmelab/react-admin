# REST Clients

Admin-on-rest can communicate with any REST server, regardless of the REST dialect it uses. Whether it's [JSON API](http://jsonapi.org/), [HAL](http://stateless.co/hal_specification.html), [ODatya](http://www.odata.org/) or a custom dialect, the only thing admin-on-rest needs is a REST client function. This is the place to translate REST requests to HTTP requests, and HTTP responses to REST responses.

The `restClient` parameter of the `<Admin>` component, must be a function with the following signature:

```js
/**
 * Execute the REST request and return a promise for a REST response
 *
 * @example
 * restClient(CRUD_GET_ONE, 'posts', { id: 123 })
 *  => new Promise(resolve => resolve({ data: { id: 123, title: "hello, world" } }))
 *
 * @param {string} type Request type, e.g CRUD_GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the action type
 * @returns {Promise} the Promise for a REST response
 */
const restClient = (type, resource, params) => new Promise();
```

You can find a REST client example implementation in `src/rest/simple.js`;

The `restClient` is also the ideal place to add custom HTTP headers, authentication, etc.

## Request Format

REST requests require a *type* (e.g. `CRUD_GET_ONE`), a *resource* (e.g. 'posts') and a set of *parameters*:

```js
const response = restClient(CRUD_GET_ONE, 'posts', { id: 123 });
```

*Tip*: In comparison, HTTP requests require a *verb* (e.g. 'GET'), an *url* (e.g. 'http://myapi.com/posts'), a list of *headers* (like `Content-Type`) and a *body*.

Possible types are:

Type | `params` format
---- | ----------------
`CRUD_GET_LIST` | `{ pagination: { page, perPage }, sort: { field, order } }`
`CRUD_GET_ONE`  | `{ id }`
`CRUD_GET_MANY` | `{ ids }`
`CRUD_CREATE`   | `{ data }`
`CRUD_UPDATE`   | `{ data }`
`CRUD_DELETE`   | `{ id }`

## Response Format

REST responses are objects. The format depends on the type.

```js
restClient(CRUD_GET_ONE, 'posts', { id: 123 })
    .then(response => {
        console.log(response);
        /*
         * {
         *     data: {
         *         id: 123,
         *         title: "hello, world"
         *     }
         * }
         */
    });
```

Type | response format
---- | ----------------
`CRUD_GET_LIST` | `{ data: [], total }`
`CRUD_GET_ONE`  | `{ data }`
`CRUD_GET_MANY` | `{ data: [] }`
`CRUD_CREATE`   | `{ id }`
`CRUD_UPDATE`   | `{ data }`
`CRUD_DELETE`   | `{ data }`

## Error Format

To be completed
