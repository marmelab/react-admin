---
layout: default
title: "fetchJson"
---

# `fetchJson`

React-admin includes a `fetchJson` utility function to make HTTP calls. It's a wrapper around the browser's `fetch` function, that adds the following features:

-   It adds the `Content-Type='application/json'` header to all non GET requests
-   It adds the `Authorization` header with optional parameters
-   It makes it easier to add custom headers to all requests
-   It handles the JSON decoding of the response
-   It handles HTTP errors codes by throwing an `HttpError`

## Usage

You can use it to make HTTP calls directly, to build a custom [`dataProvider`](./DataProviderIntroduction.md), or pass it directly to any `dataProvider` that supports it, such as [`ra-data-simple-rest`](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest).

```jsx
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { PostList } from './posts';

const httpClient = async (url, options = {}) => {
    const { status, headers, body, json } = await fetchUtils.fetchJson(url, options);
    console.log('fetchJson result', { status, headers, body, json });
    return { status, headers, body, json };
}
const dataProvider = simpleRestProvider('http://path.to.my.api/', httpClient);

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

**Tip:** `fetchJson` is included in the `fetchUtils` object exported by the `react-admin` package.

## Parameters

`fetchJson(url, options)` expects the following parameters:

-   `url` **string** The URL to fetch
-   `options` **Object** The options to pass to the fetch call. Defaults to `{}`.
-   `options.user` **Object** The user object, used for the `Authorization` header
-   `options.user.token` **string** The token to pass as the `Authorization` header
-   `options.user.authenticated` **boolean** Whether the user is authenticated or not (the `Authorization` header will be set only if this is true)
-   `options.headers` **Headers** The headers to pass to the fetch call

## Return Value

`fetchJson` returns an object with the following properties:

-   `status` **number** The HTTP status code
-   `headers` **Headers** The response headers
-   `body` **string** The response body
-   `json` **Object** The response body, parsed as JSON

## Adding Custom Headers

Here is an example of how to add custom headers to all requests:

```jsx
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { PostList } from './posts';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('X-Custom-Header', 'foobar');
    return fetchUtils.fetchJson(url, options);
}
const dataProvider = simpleRestProvider('http://path.to.my.api/', httpClient);

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

## TypeScript Support

For TypeScript users, here is a typed example of a custom `httpClient` that adds custom headers to all requests:

```ts
import { fetchUtils } from 'react-admin';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    const customHeaders = (options.headers ||
        new Headers({
            Accept: 'application/json',
        })) as Headers;
    // add your own headers here
    customHeaders.set('X-Custom-Header', 'foobar');
    options.headers = customHeaders;
    return fetchUtils.fetchJson(url, options);
}
```

## Adding The `Authorization` Header

Here is an example of how to add the `Authorization` header to all requests, using a token stored in the browser's local storage:

```jsx
import { fetchUtils } from 'react-admin';

const httpClient = (url, options = {}) => {
    const token = localStorage.getItem('token');
    const user = { token: `Bearer ${token}`, authenticated: !!token };
    return fetchUtils.fetchJson(url, {...options, user});
}
```

**Tip:** The `Authorization` header will only be added to the request if `user.authenticated` is `true`.

## Handling HTTP Errors

The `fetchJson` function rejects with an `HttpError` when the HTTP response status code is not in the 2xx range.

```jsx
import { fetchUtils } from 'react-admin';

fetchUtils.fetchJson('https://jsonplaceholder.typicode.com/posts/1')
    .then(({ json }) => console.log('HTTP call succeeded. Return value:', json))
    .catch(error => console.log('HTTP call failed. Error message:', error));
```
