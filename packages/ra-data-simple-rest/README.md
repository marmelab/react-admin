# Simple REST Data Provider For React-Admin

Simple REST Data Provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://www.youtube.com/watch?v=bJEo1O1oT6o)

## Installation

```sh
npm install --save ra-data-simple-rest
```

## Usage

Create a Data Provider by calling the `simpleRestProvider` function with the API URL as first argument. Then pass this Data Provider to the `<Admin>` component.

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://my.api.url/')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

The `simpleRestProvider` function accepts a second parameter, which is an HTTP client function. By default, it uses react-admin's [`fetchUtils.fetchJson()`](https://marmelab.com/react-admin/fetchJson.html) as HTTP client. It's similar to HTML5 `fetch()`, except it handles JSON decoding and HTTP error codes automatically.

You can wrap this call in your own function to [add custom headers](#adding-custom-headers), for instance to set an `Authorization` bearer token:

```jsx
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const { token } = JSON.parse(localStorage.getItem('auth'));
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider('http://localhost:3000', httpClient);

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        ...
    </Admin>
);
```

## REST Dialect

This Data Provider fits REST APIs using simple GET parameters for filters and sorting. This is the dialect used for instance in [FakeRest](https://github.com/marmelab/FakeRest).

### Request Format

| Method             | API calls                                                                               |
| ------------------ | --------------------------------------------------------------------------------------- |
| `getList`          | `GET http://my.api.url/posts?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}` |
| `getOne`           | `GET http://my.api.url/posts/123`                                                       |
| `getMany`          | `GET http://my.api.url/posts?filter={"id":[123,456,789]}`                               |
| `getManyReference` | `GET http://my.api.url/posts?filter={"author_id":345}`                                  |
| `create`           | `POST http://my.api.url/posts`                                                          |
| `update`           | `PUT http://my.api.url/posts/123`                                                       |
| `updateMany`       | Multiple calls to `PUT http://my.api.url/posts/123`                                     |
| `delete`           | `DELETE http://my.api.url/posts/123`                                                    |
| `deleteMany`       | Multiple calls to `DELETE http://my.api.url/posts/123`                                  |

### Response Format

An `id` field is required in all records. You can also set [custom identifier or primary key for your resources](https://marmelab.com/react-admin/FAQ.html#can-i-have-custom-identifiersprimary-keys-for-my-resources)

The API response when called by `getList` should look like this:

```json
[
  { "id": 0, "author_id": 0, "title": "Anna Karenina" },
  { "id": 1, "author_id": 0, "title": "War and Peace" },
  { "id": 2, "author_id": 1, "title": "Pride and Prejudice" },
  { "id": 2, "author_id": 1, "title": "Pride and Prejudice" },
  { "id": 3, "author_id": 1, "title": "Sense and Sensibility" }
]
```

### CORS Setup

The simple REST data provider expects the API to include a `Content-Range` header in the response to `getList` calls. The value must be the total number of resources in the collection. This allows react-admin to know how many pages of resources there are in total, and build the pagination controls.

```txt
Content-Range: posts 0-24/319
```

If your API is on another domain as the JS code, the browser won't be able to read the `Content-Range` header unless the server includes [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) headers in the response. So by default, you'll get an error message like this:

```txt
Access to fetch at [API_URL] from origin 'http://localhost:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

To fix this, you need to configure your API server to set the `Access-Control-Expose-Headers` header to `Content-Range` in the CORS response.

```txt
Access-Control-Expose-Headers: Content-Range
```

## Example Calls

### getList

```
## DataProvider
dataProvider.getList('posts', {
    sort: { field: 'title', order: 'ASC' },
    pagination: { page: 1, perPage: 5 },
    filter: { author_id: 12 }
})

## Request
GET http://my.api.url/posts?sort=["title","ASC"]&range=[0, 4]&filter={"author_id":12}

## Response
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

### getOne

```
## DataProvider
dataProvider.getOne('posts', { id: 123 })

## Request
GET http://my.api.url/posts/123

## Response
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }
```

### getMany

```
## DataProvider
dataProvider.getMany('posts', { ids: [123, 124, 125] })

## Request
GET http://my.api.url/posts?filter={"ids":[123,124,125]}

## Response
HTTP/1.1 200 OK
Content-Type: application/json
[
    { "id": 123, "title": "hello, world", "author_id": 12 },
    { "id": 124, "title": "good day sunshine", "author_id": 12 },
    { "id": 125, "title": "howdy partner", "author_id": 12 }
]
```

### getManyReference

```
## DataProvider
dataProvider.getManyReference('comments', {
    target: 'post_id',
    id: 12,
    pagination: { page: 1, perPage: 25 },
    sort: { field: 'created_at', order: 'DESC' }
    filter: {}
})

## Request
GET http://my.api.url/comments?sort=["created_at","DESC"]&range=[0, 24]&filter={"post_id":123}

## Response
HTTP/1.1 200 OK
Content-Type: application/json
Content-Range: comments 0-1/2
[
    { "id": 667, "title": "I agree", "post_id": 123 },
    { "id": 895, "title": "I don't agree", "post_id": 123 }
]
```

### create

```
## DataProvider
dataProvider.create('posts', {
    data: { title: "hello, world", author_id: 12 }
})

## Request
POST http://my.api.url/posts
{ "title": "hello, world", "author_id": 12 }

## Response
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }
```

### update

```
## DataProvider
dataProvider.update('posts', {
    id: 123,
    data: { title: "hello, world" },
    previousData: { title: "hello, partner", author_id: 12 }
})

## Request
PUT http://my.api.url/posts/123
{ "title": "hello, world!" }

## Response
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world!", "author_id": 12 }
```

### updateMany

```
## DataProvider
dataProvider.updateMany('posts', {
    ids: [123, 124, 125],
    data: { title: "hello, world" },
})

## Request 1
PUT http://my.api.url/posts/123
{ "title": "hello, world!" }

## Response 1
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world!", "author_id": 12 }

## Request 2
PUT http://my.api.url/posts/124
{ "title": "hello, world!" }

## Response 2
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 124, "title": "hello, world!", "author_id": 12 }

## Request 3
PUT http://my.api.url/posts/125
{ "title": "hello, world!" }

## Response 3
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 125, "title": "hello, world!", "author_id": 12 }
```

### delete

```
## DataProvider
dataProvider.delete('posts', { id: 123 })

## Request
DELETE http://my.api.url/posts/123

## Response
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }
```

### deleteMany

```
## DataProvider
dataProvider.deleteMany('posts', { ids: [123, 124, 125] })

## Request 1
DELETE http://my.api.url/posts/123

## Response 1
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }

## Request 2
DELETE http://my.api.url/posts/124

## Response 2
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 124, "title": "good day sunshine", "author_id": 12 }

## Request 3
DELETE http://my.api.url/posts/125

## Response 3
HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 125, "title": "howdy partner", "author_id": 12 }
```

## Adding Custom Headers

The provider function accepts an HTTP client function as second argument. By default, they use react-admin's `fetchUtils.fetchJson()` as HTTP client. It's similar to HTML5 `fetch()`, except it handles JSON decoding and HTTP error codes automatically.

That means that if you need to add custom headers to your requests, you just need to *wrap* the `fetchJson()` call inside your own function:

```jsx
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('X-Custom-Header', 'foobar');
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider('http://localhost:3000', httpClient);

render(
    <Admin dataProvider={dataProvider} title="Example Admin">
       ...
    </Admin>,
    document.getElementById('root')
);
```

Now all the requests to the REST API will contain the `X-Custom-Header: foobar` header.

**Tip**: The most common usage of custom headers is for authentication. `fetchJson` has built-on support for the `Authorization` token header:

```js
const httpClient = (url, options = {}) => {
    options.user = {
        authenticated: true,
        token: 'SRTRDFVESGNJYTUKTYTHRG'
    };
    return fetchUtils.fetchJson(url, options);
};
```

Now all the requests to the REST API will contain the `Authorization: SRTRDFVESGNJYTUKTYTHRG` header.

## Enabling Query Cancellation

To enable query cancellation, you need to set the `supportAbortSignal` property of the data provider to `true`. This will allow react-admin to cancel queries when the user navigates away from a view before the query is completed.

```tsx
const dataProvider = simpleRestProvider('https://myapi.com');
dataProvider.supportAbortSignal = true;
```

## Replacing Content-Range With Another Header

An infrastructure using a Varnish may use, modify or delete the `Content-Range` header.

The solution is to use another HTTP header to return the number of collection's items. The other header commonly used for this is `X-Total-Count`. So if you use `X-Total-Count`, you will have to :

* Whitelist this header with an `Access-Control-Expose-Headers` [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header.

```
Access-Control-Expose-Headers: X-Total-Count
```

* Use the third parameter of `simpleRestProvider` to specify the name of the header to use:
  
```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import { fetchUtils } from 'ra-core';
import simpleRestProvider from 'ra-data-simple-rest';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://my.api.url/', fetchUtils.fetchJson, 'X-Total-Count')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

## License

This data provider is licensed under the MIT License, and sponsored by [marmelab](https://marmelab.com).
