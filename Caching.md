---
layout: default
title: "Caching"
---

# Caching

Not hitting the server is the best way to improve a web app performance - and its ecological footprint, too (network and datacenter usage account for about 40% of the CO2 emissions in IT). React-admin comes with a built-in cache-first approach called *optimistic rendering*, and it supports caching both at the HTTP level and the application level. 

## Optimistic Rendering

By default, react-admin stores all the responses from the dataProvider in the Redux store. This allows displaying the cached result first while fetching for the fresh data. **This behavior is automatic and requires no configuration**. 

The Redux store is like a local replica of the API, organized by resource, and shared between all the data provider methods of a given resource. That means that if the `getList('posts')` response contains a record of id 123, a call to `getOne('posts', { id: 123 })` will use that record immediately.

For instance, if the end-user displays a list of posts, then clicks on a post in the list to display the list details, here is what react-admin does:

1. Display the empty List
2. Call `dataProvider.getList('posts')`, and store the result in the Redux store
3. Re-render the List with the data from the Redux store
4. When the user clicks on a post, display immediately the post from the Redux store
5. Call `dataProvider.getOne('posts', { id: 123 })`, and store the result in the Redux store
6. Re-render the detail with the data from the Redux store

In step 4, react-admin displays the post *before* fetching it, because it's already in the Redux store from the previous `getList()` call. In most cases, the post from the `getOne()` response is the same as the one from the `getList()` response, so the re-render of step 6 is invisible to the end-user. If the post was modified on the server side between the `getList()` and the `getOne` calls, the end-user will briefly see the outdated version (at step 4), then the up to date version (at step 6).

Optimistic rendering improves user experience by displaying stale data while getting fresh data from the API, but it does not reduce the ecological footprint of an app, as the web app still makes API requests on every page. 

**Tip**: This design choice explains why react-admin requires that all data provider methods return records of the same shape for a given resource. Otherwise, if the posts returned by `getList()` contain fewer fields than the posts returned by `getOne()`, in the previous scenario, the user will see an incomplete post at step 4.

## HTTP Cache

React-admin supports HTTP cache headers by default, provided your API sends them. 

Data providers almost always rely on `window.fetch()` to call the HTTP API. React-admin's `fetchJSON()`, and third-party libraries like `axios` use `window.fetch()`, too. Fortunately, the `window.fetch()` HTTP client behaves just like your browser and follows the [RFC 7234](https://tools.ietf.org/html/rfc7234) about HTTP cache headers. So if your API includes one of the following cache headers, all data providers support them:

- `Cache-Control`
- `Expires`
- `ETag`
- `Last-Modified`

In other terms, enabling the HTTP cache is entirely a server-side action - **nothing is necessary on the react-admin side**.

For instance, let's imagine that your data provider translates a `getOne('posts', { id: 123 })` call into a `GET https://api.acme.com/posts/123`, and that the server returns the following response:

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf-8
Cache-Control: max-age=120
Age: 0
{
    "id": 123,
    "title": "Hello, world"
}
```

The browser HTTP client knows that the response is valid for the next 2 minutes. If a component makes a new call to `getOne('posts', { id: 123 })` within 2 minutes, `window.fetch()` will return the response from the first call without even calling the API.

Refer to your backend framework or CDN documentation to enable cache headers - and don't forget to whitelist these headers in the `Access-Control-Allow-Headers` CORS header if the API lives in another domain than the web app itself.

HTTP cache can help improve the performance and reduce the ecological footprint of a web app. The main drawback is that responses are cached based on their request signature. The cached responses for `GET https://api.acme.com/posts` and `GET https://api.acme.com/posts/123` live in separate buckets on the client-side, and cannot be shared. As a consequence, the browser still makes a lot of useless requests to the API. HTTP cache also has another drawback: browser caches ignore the REST semantics. That means that a call to `DELETE https://api.acme.com/posts/123` can't invalidate the cache of the `GET https://api.acme.com/posts` request, and therefore the cache is sometimes wrong.

These shortcomings explain why most APIs adopt short expiration or use "validation caching" (based on `Etag` or `Last-Modified` headers) instead of "expiration caching" (based on the `Cache-Control` or `Expires` headers). But with validation caching, the client must send *every request* to the server (sometimes the server returns an empty response, letting the client know that it can use its cache). Validation caching reduces network traffic a lot less than expiration caching and has less impact on performance.

Finally, if your API uses GraphQL, it probably doesn't offer HTTP caching. 

## Application Cache

React-admin comes with its caching system, called *application cache*, to overcome the limitations if the HTTP cache. **This cache is opt-in** - you have to enable it by including validity information in the `dataProvider` response. But before explaining how to configure it, let's see how it works. 

React-admin already stores responses from the `dataProvider` in the Redux store, for the [optimistic rendering](#optimistic-rendering). The application cache checks if this data is valid, and *skips the call to the `dataProvider` altogether* if it's the case. 

For instance, if the end-user displays a list of posts, then clicks on a post in the list to display the list details, here is what react-admin does:

1. Display the empty List
2. Call `dataProvider.getList('posts')`, and store the result in the Redux store
3. Re-render the List with the data from the Redux store
4. When the user clicks on a post, display immediately the post from the Redux store (optimistic rendering)
5. Check the post of id 123 is still valid, and as it's the case, end here

The application cache uses the semantics of the `dataProvider` verb. That means that requests for a list (`getList`) also populate the cache for individual records (`getOne`, `getMany`). That also means that write requests (`create`, `udpate`, `updateMany`, `delete`, `deleteMany`) invalidate the list cache - because after an update, for instance, the ordering of items can be changed.

So the application cache uses expiration caching together with a deeper knowledge of the data model, to allow longer expirations without the risk of displaying stale data. It especially fits admins for API backends with a small number of users (because with a large number of users, there is a high chance that a record kept in the client-side cache for a few minutes may be updated on the backend by another user). It also works with GraphQL APIs. 

To enable it, the `dataProvider` response must include a `validUntil` key, containing the date until which the record(s) is (are) valid.

```diff
// response to getOne('posts', { id: 123 })
{
    "data": { "id": 123, "title": "Hello, world" }
+   "validUntil": new Date('2020-03-02T13:24:05')
}

// response to getMany('posts', { ids: [123, 124] }
{
    "data": [
        { "id": 123, "title": "Hello, world" },
        { "id": 124, "title": "Post title 2" },
    ],
+   "validUntil": new Date('2020-03-02T13:24:05')
}

// response to getList('posts')
{
    "data": [
        { "id": 123, "title": "Hello, world" },
        { "id": 124, "title": "Post title 2" },
        ...

    ],
    "total": 45,
+   "validUntil": new Date('2020-03-02T13:24:05')
}
```

To empty the cache, the `dataProvider` can simply omit the `validUntil` key in the response.

**Tip**: As of writing, the `validUntil` key is only taken into account for `getOne`, `getMany`, and `getList`.

It's your responsibility to determine the validity date based on the API response, or based on a fixed time policy.

For instance, to have a `dataProvider` declare responses for `getOne`, `getMany`, and `getList` valid for 5 minutes, you can wrap it in the following proxy:

```js
// in src/dataProvider.js
import simpleRestProvider from 'ra-data-simple-rest';

const dataProvider = simpleRestProvider('http://path.to.my.api/');

const cacheDataProviderProxy = (dataProvider, duration =  5 * 60 * 1000) =>
    new Proxy(dataProvider, {
        get: (target, name) => (resource, params) => {
            if (name === 'getOne' || name === 'getMany' || name === 'getList') {
                return dataProvider[name](resource, params).then(response => {
                    const validUntil = new Date();
                    validUntil.setTime(validUntil.getTime() + duration);
                    response.validUntil = validUntil;
                    return response;
                });
            }
            return dataProvider[name](resource, params);
        },
    });

export default cacheDataProviderProxy(dataProvider);
```

**Tip**: As caching responses for a fixed period is a common pattern, react-admin exports this `cacheDataProviderProxy` wrapper, so you can write the following instead:

```jsx
// in src/dataProvider.js
import simpleRestProvider from 'ra-data-simple-rest';
import { cacheDataProviderProxy } from 'react-admin'; 

const dataProvider = simpleRestProvider('http://path.to.my.api/');

export default cacheDataProviderProxy(dataProvider);
```

Application cache provides a very significant boost for the end-user and saves a large portion of the network traffic. Even a short expiration date (30 seconds or one minute) can speed up a complex admin with a low risk of displaying stale data. Adding an application cache is, therefore, a warmly recommended practice!
