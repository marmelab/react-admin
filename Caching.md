---
layout: default
title: "Caching"
---

# Caching

Not hitting the server is the best way to improve a web app performance, and its ecological footprint too (network and datacenter usage account for about 40% of the CO2 emissions in IT). React-admin comes with a built-in cache-first approach called *optimistic rendering*, and it supports caching both at the HTTP level and the application level. 

## Optimistic Rendering

By default, react-admin stores all the responses from the dataProvider in a local cache. This allows displaying the cached result first while fetching for the fresh data. This behavior is called **"stale-while-revalidate"**, it is enabled by default and requires no configuration.

This accelerates the rendering of pages visited multiple times. For instance, if the user visits the detail page for a post twice, here is what react-admin does:

1. Display the empty detail page
2. Call `dataProvider.getOne('posts', { id: 123 })`, and store the result in local cache
3. Re-render the detail page with the data from the dataProvider
4. The user navigates away, then comes back to the post detail page
5. Render the detail page immediately using the post from the local cache
6. Call `dataProvider.getOne('posts', { id: 123 })`, and store the result in local cache
7. If there is a difference with the previous post, re-render the detail with the data from the dataProvider

In addition, as react-admin knows the *vocabulary* of your data provider, it can reuse data from one call to optimize another. This is called **"optimistic rendering"**, and it is also enabled by default. The optimistic rendering uses the semantics of the `dataProvider` verb. That means that requests for a list (`getList`) also populate the cache for individual records (`getOne`, `getMany`). That also means that write requests (`create`, `update`, `updateMany`, `delete`, `deleteMany`) invalidate the list cache - because after an update, for instance, the ordering of items can be changed.

For instance, if the end user displays a list of posts, then clicks on a post in the list to display the list details, here is what react-admin does:

1. Display the empty List
2. Call `dataProvider.getList('posts')`, and store the result in the local cache, both for the list and for each individual post
3. Re-render the List with the data from the dataProvider
4. When the user clicks on a post, render the detail page immediately using the post from the local cache
5. Call `dataProvider.getOne('posts', { id: 123 })`, and store the result in local cache
6. If there is a difference with the previous post, re-render the detail with the data from the dataProvider

In step 4, react-admin displays the post *before* fetching it, because it's already in the cache from the previous `getList()` call. In most cases, the post from the `getOne()` response is the same as the one from the `getList()` response, so the re-render of step 6 doesn't occur. If the post was modified on the server side between the `getList()` and the `getOne` calls, the end-user will briefly see the outdated version (at step 4), then the up-to-date version (at step 6).

A third optimization used by react-admin is to apply mutations locally before sending them to the dataProvider. This is called **"optimistic updates"**, and it is also enabled by default.

For instance, if a user edits a post, then renders the list, here is what react-admin does:

1. Display the post detail page
2. Upon user submission, update the post that is in the local cache, then call `dataProvider.update('posts', { id: 123, title: 'New title' })`
3. Re-render the list with the data from the store (without waiting for the dataProvider response).

Optimistic updates allow users to avoid waiting for the server feedback for simple mutations. It works on updates and deletions.

These 3 techniques improve user experience by displaying stale data while getting fresh data from the API. But they do not reduce the ecological footprint of an app, as the web app still makes API requests on every page. 

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

React-admin uses react-query for data fetching. React-query comes with its own caching system, allowing you to skip API calls completely. React-admin calls this the *application cache*. It's a good way to overcome the limitations if the HTTP cache. **This cache is opt-in** - you have to enable it by setting a custom `queryClient` in your `<Admin>` with a specific `staleTime` option. 

```jsx
import { QueryClient } from '@tanstack/react-query';
import { Admin, Resource } from 'react-admin';

const App = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes
            },
        },
    });
    return (
        <Admin dataProvider={dataProvider} queryClient={queryClient}>
            <Resource name="posts" />
        </Admin>
    );
}
```

With this setting, all queries will be considered valid for 5 minutes. That means that react-admin *won't refetch* data from the API if the data is already in the cache and younger than 5 minutes.

Check the details about this cache [in the react-query documentation](https://tanstack.com/query/v5/docs/react/guides/caching).

It especially fits admins for API backends with a small number of users (because with a large number of users, there is a high chance that a record kept in the client-side cache for a few minutes may be updated on the backend by another user). It also works with GraphQL APIs. 

Application cache provides a very significant boost for the end-user and saves a large portion of the network traffic. Even a short expiration date (30 seconds or one minute) can speed up a complex admin with a low risk of displaying stale data. Adding an application cache is, therefore, a warmly recommended practice!
