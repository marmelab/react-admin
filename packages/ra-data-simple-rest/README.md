# Simple REST Data Provider For React-Admin

Simple REST Data Provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://vimeo.com/268958716)

## Installation

```sh
npm install --save ra-data-simple-rest
```

## REST Dialect

This Data Provider fits REST APIs using simple GET parameters for filters and sorting. This is the dialect used for instance in [FakeRest](https://github.com/marmelab/FakeRest).

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

An `id` field is required. You can also set [custom identifier or primary key for your resources](https://marmelab.com/react-admin/FAQ.html#can-i-have-custom-identifiersprimary-keys-for-my-resources)

**Note**: The simple REST data provider expects the API to include a `Content-Range` header in the response to `getList` calls. The value must be the total number of resources in the collection. This allows react-admin to know how many pages of resources there are in total, and build the pagination controls.

```txt
Content-Range: posts 0-24/319
```

If your API is on another domain as the JS code, you'll need to whitelist this header with an `Access-Control-Expose-Headers` [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header.

```txt
Access-Control-Expose-Headers: Content-Range
```

## Usage

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://path.to.my.api/')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

### Adding Custom Headers

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

## Note about Content-Range

Historically, Simple REST Data Provider uses the http `Content-Range` header to retrieve the number of items in a collection. But this is a *hack* of the [primary role of this header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range).

However this can be problematic, for example within an infrastructure using a Varnish that may use, modify or delete this header. We also have feedback indicating that using this header is problematic when you host your application on [Vercel](https://vercel.com/).

The solution is to use another http header to return the number of collection's items. The other header commonly used for this is `X-Total-Count`. So if you use `X-Total-Count`, you will have to :

* Whitelist this header with an `Access-Control-Expose-Headers` [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header.

```
Access-Control-Expose-Headers: X-Total-Count
```

* Use the third parameter of `simpleRestProvider` to specify the name of the header to use :
  
```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import { fetchUtils } from 'ra-core';
import simpleRestProvider from 'ra-data-simple-rest';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://path.to.my.api/', fetchUtils.fetchJson, 'X-Total-Count')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

## License

This data provider is licensed under the MIT License, and sponsored by [marmelab](https://marmelab.com).
