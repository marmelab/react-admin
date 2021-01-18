# JSON Server Data Provider For React-Admin

JSON Server Data Provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://vimeo.com/268958716)

## Installation

```sh
npm install --save ra-data-json-server
```

## REST Dialect

This Data Provider fits REST APIs powered by [JSON Server](https://github.com/typicode/json-server), such as [JSONPlaceholder](https://jsonplaceholder.typicode.com/).

| Method             | API calls                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `getList`          | `GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24&title=bar`                         |
| `getOne`           | `GET http://my.api.url/posts/123`                                                                       |
| `getMany`          | `GET http://my.api.url/posts?id=123&id=456&id=789`     |
| `getManyReference` | `GET http://my.api.url/posts?author_id=345`                                                             |
| `create`           | `POST http://my.api.url/posts`                                                                      |
| `update`           | `PUT http://my.api.url/posts/123`                                                                       |
| `updateMany`       | `PUT http://my.api.url/posts/123`, `PUT http://my.api.url/posts/456`, `PUT http://my.api.url/posts/789` |
| `delete`           | `DELETE http://my.api.url/posts/123`                                                                    |

**Note**: The JSON Server REST Data Provider expects the API to include a `X-Total-Count` header in the response to `getList` and `getManyReference` calls. The value must be the total number of resources in the collection. This allows react-admin to know how many pages of resources there are in total, and build the pagination controls.

```
X-Total-Count: 319
```

If your API is on another domain as the JS code, you'll need to whitelist this header with an `Access-Control-Expose-Headers` [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header.

```
Access-Control-Expose-Headers: X-Total-Count
```

## Usage

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')}>
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
import jsonServerProvider from 'ra-data-json-server';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('X-Custom-Header', 'foobar');
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = jsonServerProvider('http://jsonplaceholder.typicode.com', httpClient);

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

## License

This data provider is licensed under the MIT License, and sponsored by [marmelab](https://marmelab.com).
