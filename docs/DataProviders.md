---
layout: default
title: "Data Providers"
---

# Data Providers

Whenever react-admin needs to communicate with the API, it calls methods on the Data Provider object.

```js
dataProvider
    .getOne('posts', { id: 123 })
    .then(response => {
        console.log(response.data); // { id: 123, title: "hello, world" }
    });
```

It's the Data Provider's job to turn these method calls into HTTP requests, and transform the HTTP responses to the data format expected by react-admin. In technical terms, a Data Provider is an *adapter* for an API. 

And to inject a Data Provider in a react-admin application, pass it as the `dataProvider` prop of the `<Admin>` component, as follows:

```jsx
import { Admin, Resource } from 'react-admin';
import dataProvider from '../myDataProvider';

const App = () => (
    <Admin dataProvider={dataProvider}>
        // ...
    </Admin>
)
```

Thanks to this adapter injection system, react-admin can communicate with any API, whether it uses REST, GraphQL, RPC, or even SOAP, regardless of the dialect it uses. The Data Provider is also the ideal place to add custom HTTP headers, authentication, etc.

![Data Provider architecture](./img/data-provider.png)

A Data Provider must have the following methods:

```jsx
const dataProvider = {
    getList:    (resource, params) => Promise,
    getOne:     (resource, params) => Promise,
    getMany:    (resource, params) => Promise,
    getManyReference: (resource, params) => Promise,
    create:     (resource, params) => Promise,
    update:     (resource, params) => Promise,
    updateMany: (resource, params) => Promise,
    delete:     (resource, params) => Promise,
    deleteMany: (resource, params) => Promise,
}
```

You can find an example Data Provider implementation at the end of this chapter.

**Tip**: A Data Provider can have more methods than the 9 methods listed above. For instance, you create a dataProvider with custom methods for calling non-REST API endpoints, manipulating tree structures, subscribing to real time updates, etc.

**Tip**: In react-admin v2, Data Providers used to be functions, not objects. React-admin v3 can detect a legacy Data Provider and wrap an object around it. So Data Providers developed for react-admin v2 still work with react-admin v3.

## Available Providers

The react-admin project includes 5 Data Providers:

* Simple REST: [marmelab/ra-data-simple-rest](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest) ([read more below](#usage)). It serves mostly as an example. Incidentally, it is compatible with the [FakeRest](https://github.com/marmelab/FakeRest) API.
* **[JSON server](https://github.com/typicode/json-server)**: [marmelab/ra-data-json-server](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-json-server). Great for prototyping an admin over a yet-to-be-developed REST API.
* [Simple GraphQL](https://graphql.org/): [marmelab/ra-data-graphql-simple](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql-simple). A GraphQL provider built with Apollo and tailored to target a simple GraphQL implementation.
* Local JSON: [marmelab/ra-data-fakerest](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-fakerest). Based on a local object, it doesn't even use HTTP. Use it for testing purposes.
* Local Storage: [marmelab/ra-data-localstorage](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-localstorage). User editions are persisted across refreshes and between sessions. This allows local-first apps, and can be useful in tests.

Developers from the react-admin community have open-sourced Data Providers for many more backends:

* **[AWS Amplify](https://docs.amplify.aws)**: [MrHertal/react-admin-amplify](https://github.com/MrHertal/react-admin-amplify)
* **[Configurable Identity Property REST Client](https://github.com/zachrybaker/ra-data-rest-client)**: [zachrybaker/ra-data-rest-client](https://github.com/zachrybaker/ra-data-rest-client)
* **[coreBOS](https://corebos.com/)**: [React-Admin coreBOS Integration](https://github.com/coreBOS/reactadminportal)
* **[Django Rest Framework](https://www.django-rest-framework.org/)**: [synaptic-cl/ra-data-drf](https://github.com/synaptic-cl/ra-data-drf)
* **[Eve](https://docs.python-eve.org/en/stable/)**: [smeng9/ra-data-eve](https://github.com/smeng9/ra-data-eve)
* **[Express & Sequelize](https://github.com/lalalilo/express-sequelize-crud)**: [express-sequelize-crud](https://github.com/lalalilo/express-sequelize-crud)
* **[Feathersjs](https://www.feathersjs.com/)**: [josx/ra-data-feathers](https://github.com/josx/ra-data-feathers)
* **[Firebase Firestore](https://firebase.google.com/docs/firestore)**: [benwinding/react-admin-firebase](https://github.com/benwinding/react-admin-firebase).
* **[Firebase Realtime Database](https://firebase.google.com/docs/database)**: [aymendhaya/ra-data-firebase-client](https://github.com/aymendhaya/ra-data-firebase-client).
* **[Google Sheets](https://www.google.com/sheets/about/)**: [marmelab/ra-data-google-sheets](https://github.com/marmelab/ra-data-google-sheets)
* **[GraphQL](https://graphql.org/)**: [marmelab/ra-data-graphql](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql) (uses [Apollo](https://www.apollodata.com/))
* **[HAL](http://stateless.co/hal_specification.html)**: [b-social/ra-data-hal](https://github.com/b-social/ra-data-hal)
* **[Hasura](https://github.com/hasura/graphql-engine)**: [hasura/ra-data-hasura](https://github.com/hasura/ra-data-hasura), auto generates valid GraphQL queries based on the properties exposed by the Hasura API.
* **[Hydra](https://www.hydra-cg.com/) / [JSON-LD](https://json-ld.org/)**: [api-platform/admin/hydra](https://github.com/api-platform/admin/blob/master/src/hydra/dataProvider.js)
* **[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)**: [tykoth/ra-data-dexie](https://github.com/tykoth/ra-data-dexie)
* **[JSON API](https://jsonapi.org/)**: [henvo/ra-jsonapi-client](https://github.com/henvo/ra-jsonapi-client)
* **[JSON HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08)**: [ra-data-json-hal](https://www.npmjs.com/package/ra-data-json-hal)
* **[JSON server](https://github.com/typicode/json-server)**: [marmelab/ra-data-json-server](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-json-server).
* **[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)**: [marmelab/ra-data-localstorage](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-localstorage)
* **[Loopback3](https://loopback.io/lb3)**: [darthwesker/react-admin-loopback](https://github.com/darthwesker/react-admin-loopback)
* **[Loopback4](https://loopback.io/)**: [elmaistrenko/react-admin-lb4](https://github.com/elmaistrenko/react-admin-lb4)
* **[Loopback4 CRUD](https://github.com/loopback4/loopback-component-crud)**: [loopback4/ra-data-lb4](https://github.com/loopback4/ra-data-lb4)
* **[Mixer](https://github.com/ckoliber/ra-data-mixer)**: [ckoliber/ra-data-mixer](https://github.com/ckoliber/ra-data-mixer)
* **[Moleculer Microservices](https://github.com/RancaguaInnova/moleculer-data-provider)**: [RancaguaInnova/moleculer-data-provider](https://github.com/RancaguaInnova/moleculer-data-provider)
* **[NestJS CRUD](https://github.com/nestjsx/crud)**: [rayman1104/ra-data-nestjsx-crud](https://github.com/rayman1104/ra-data-nestjsx-crud)
* **[OData](https://www.odata.org/)**: [Groopit/ra-data-odata-server](https://github.com/Groopit/ra-data-odata-server)
* **[OpenCRUD](https://www.opencrud.org/)**: [weakky/ra-data-opencrud](https://github.com/Weakky/ra-data-opencrud)
* **[Parse](https://parseplatform.org/)**: [almahdi/ra-data-parse](https://github.com/almahdi/ra-data-parse)
* **[PostGraphile](https://www.graphile.org/postgraphile/)**: [bowlingx/ra-postgraphile](https://github.com/BowlingX/ra-postgraphile)
* **[PostgREST](https://postgrest.org/)**: [raphiniert-com/ra-data-postgrest](https://github.com/raphiniert-com/ra-data-postgrest)
* **[Prisma](https://github.com/weakky/ra-data-prisma)**: [weakky/ra-data-prisma](https://github.com/weakky/ra-data-prisma)
* **[Prisma Version 2](https://www.prisma.io/)**: [panter/ra-data-prisma](https://github.com/panter/ra-data-prisma)
* **[ProcessMaker3](https://www.processmaker.com/)**: [ckoliber/ra-data-processmaker3](https://github.com/ckoliber/ra-data-processmaker3)
* **[REST-HAPI](https://github.com/JKHeadley/rest-hapi)**: [ra-data-rest-hapi](https://github.com/mkg20001/ra-data-rest-hapi)
* **[Sails.js](https://sailsjs.com/)**: [mpampin/ra-data-json-sails](https://github.com/mpampin/ra-data-json-sails)
* **[Spring Boot](https://spring.io/projects/spring-boot)**: [vishpat/ra-data-springboot-rest](https://github.com/vishpat/ra-data-springboot-rest) 
* **[Strapi](https://strapi.io/)**: [nazirov91/ra-strapi-rest](https://github.com/nazirov91/ra-strapi-rest)

If you've written a Data Provider for another backend, and open-sourced it, please help complete this list with your package.

**Tip**: In version 1, react-admin was called [admin-on-rest](https://github.com/marmelab/admin-on-rest) (AOR), and developers shared Data Providers for even more backends. Due to breaking changes in v2, these providers are no longer working. Fortunately, Data Providers aren't complex pieces of code, and using legacy Data Provider with a recent react-admin version requires minimal changes. If you are a maintainer of one of these projects, we would warmly welcome an upgrade.

* **[DynamoDb](https://github.com/abiglobalhealth/aor-dynamodb-client)**: [abiglobalhealth/aor-dynamodb-client](https://github.com/abiglobalhealth/aor-dynamodb-client)
* **[Epilogue](https://github.com/dchester/epilogue)**: [dunghuynh/aor-epilogue-client](https://github.com/dunghuynh/aor-epilogue-client)
* **[Parse Server](https://github.com/ParsePlatform/parse-server)**: [leperone/aor-parseserver-client](https://github.com/leperone/aor-parseserver-client)
* **[Xmysql](https://github.com/o1lab/xmysql)**: [soaserele/aor-xmysql](https://github.com/soaserele/aor-xmysql)

## Usage

As an example, let's focus on the Simple REST data provider. It fits REST APIs using simple GET parameters for filters and sorting.

Install the `ra-data-simple-rest` package to use this provider.

```sh
yarn add ra-data-simple-rest
```

Then, initialize the provider with the REST backend URL, and pass the result to the `dataProvider` prop of the `<Admin>` component:

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

Here is how this Data Provider maps react-admin calls to API calls:

| Method name        | API call                                                                                |
| ------------------ | --------------------------------------------------------------------------------------- |
| `getList`          | `GET http://my.api.url/posts?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}` |
| `getOne`           | `GET http://my.api.url/posts/123`                                                       |
| `getMany`          | `GET http://my.api.url/posts?filter={"id":[123,456,789]}`                               |
| `getManyReference` | `GET http://my.api.url/posts?filter={"author_id":345}`                                  |
| `create`           | `POST http://my.api.url/posts`                                                      |
| `update`           | `PUT http://my.api.url/posts/123`                                                       |
| `updateMany`       | Multiple calls to `PUT http://my.api.url/posts/123`                                     |
| `delete`           | `DELETE http://my.api.url/posts/123`                                                    |
| `deleteMany`       | Multiple calls to `DELETE http://my.api.url/posts/123`                                  |

**Note**: The simple REST client expects the API to include a `Content-Range` header in the response to `getList` calls. The value must be the total number of resources in the collection. This allows react-admin to know how many pages of resources there are in total, and build the pagination controls.

```
Content-Range: posts 0-24/319
```

If your API is on another domain as the JS code, you'll need to whitelist this header with an `Access-Control-Expose-Headers` [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) header.

```
Access-Control-Expose-Headers: Content-Range
```

## Adding Custom Headers

The `simpleRestProvider` function accepts an HTTP client function as second argument. By default, it uses react-admin's `fetchUtils.fetchJson()` function as HTTP client. It's similar to HTML5 `fetch()`, except it handles JSON decoding and HTTP error codes automatically.

That means that if you need to add custom headers to your requests, you can just *wrap* the `fetchJson()` call inside your own function:

```jsx
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const fetchJson = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('X-Custom-Header', 'foobar');
    return fetchUtils.fetchJson(url, options);
}
const dataProvider = simpleRestProvider('http://path.to.my.api/', fetchJson);

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

Now all the requests to the REST API will contain the `X-Custom-Header: foobar` header.

**Tip**: The most common usage of custom headers is for authentication. `fetchJson` has built-on support for the `Authorization` token header:

```js
const fetchJson = (url, options = {}) => {
    options.user = {
        authenticated: true,
        token: 'SRTRDFVESGNJYTUKTYTHRG'
    };
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider('http://path.to.my.api/', fetchJson);
```

Now all the requests to the REST API will contain the `Authorization: SRTRDFVESGNJYTUKTYTHRG` header.

## Extending a Data Provider (Example of File Upload)

As Data Providers are just objects, you can extend them with custom logic for a given method, or a given resource. 

For instance, the following Data Provider extends the `ra-data-simple-rest` provider, and adds image upload support for the `update('posts')` call (react-admin offers an `<ImageInput />` component that allows image upload).

```js
import simpleRestProvider from 'ra-data-simple-rest';

const dataProvider = simpleRestProvider('http://path.to.my.api/');

const myDataProvider = {
    ...dataProvider,
    update: (resource, params) => {
        if (resource !== 'posts' || !params.data.pictures) {
            // fallback to the default implementation
            return dataProvider.update(resource, params);
        }
        /**
         * For posts update only, convert uploaded image in base 64 and attach it to
         * the `picture` sent property, with `src` and `title` attributes.
         */
        
        // Freshly dropped pictures are File objects and must be converted to base64 strings
        const newPictures = params.data.pictures.filter(
            p => p.rawFile instanceof File
        );
        const formerPictures = params.data.pictures.filter(
            p => !(p.rawFile instanceof File)
        );

        return Promise.all(newPictures.map(convertFileToBase64))
            .then(base64Pictures =>
                base64Pictures.map(picture64 => ({
                    src: picture64,
                    title: `${params.data.title}`,
                }))
            )
            .then(transformedNewPictures =>
                dataProvider.update(resource, {
                    ...params,
                    data: {
                        ...params.data,
                        pictures: [
                            ...transformedNewPictures,
                            ...formerPictures,
                        ],
                    },
                })
            );
    },
};

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file.rawFile);
    });

export default myDataProvider;
```

Using this technique, you can also combine two Data Providers for two backends into a single object, or use a Proxy to transform responses for all methods.

## Writing Your Own Data Provider

APIs are so diverse that quite often, none of the available Data Providers suit you API. In such cases, you'll have to write your own Data Provider. Don't worry, it usually takes only a couple of hours. 

The methods of a Data Provider receive a request, and return a promise for a response. Both the request and the response format are standardized.

**Caution**: A Data Provider should return the same shape in `getList` and `getOne` for a given resource. This is because react-admin uses "optimistic rendering", and renders the Edit and Show view *before* calling `dataProvider.getOne()` by reusing the response from `dataProvider.getList()` if the user has displayed the List view before. If your API has different shapes for a query for a unique record and for a query for a list of records, your Data Provider should make these records consistent in shape before returning them to react-admin.

For instance, the following Data Provider returns more details in `getOne` than in `getList`:

```jsx
const { data } = await dataProvider.getList('posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
    filter: { author_id: 12 },
})
// [
//   { id: 123, title: "hello, world", author_id: 12 },
//   { id: 125, title: "howdy partner", author_id: 12 },
//  ],

const { data } = dataProvider.getOne('posts', { id: 123 })
// {
//     data: { id: 123, title: "hello, world", author_id: 12, body: 'Lorem Ipsum Sic Dolor Amet' }
// }
```

This will cause the Edit view to blink on load. If you have this problem, modify your Data Provider to return the same shape for all methods. 

## Request Format

Data queries require a *method* (e.g. `getOne`), a *resource* (e.g. 'posts') and a set of *parameters*.

**Tip**: In comparison, HTTP requests require a *verb* (e.g. 'GET'), an *url* (e.g. 'http://myapi.com/posts'), a list of *headers* (like `Content-Type`) and a *body*.

Standard methods are:

| Method             | Usage                                           | Parameters format                                                                                                                               |
| ------------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `getList`          | Search for resources                            | `{ pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }`                                |
| `getOne`           | Read a single resource, by id                   | `{ id: {mixed} }`                                                                                                                               |
| `getMany`          | Read a list of resource, by ids                 | `{ ids: {mixed[]} }`                                                                                                                            |
| `getManyReference` | Read a list of resources related to another one | `{ target: {string}, id: {mixed}, pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }` |
| `create`           | Create a single resource                        | `{ data: {Object} }`                                                                                                                            |
| `update`           | Update a single resource                        | `{ id: {mixed}, data: {Object}, previousData: {Object} }`                                                                                       |
| `updateMany`       | Update multiple resources                       | `{ ids: {mixed[]}, data: {Object} }`                                                                                                            |
| `delete`           | Delete a single resource                        | `{ id: {mixed}, previousData: {Object} }`                                                                                                       |
| `deleteMany`       | Delete multiple resources                       | `{ ids: {mixed[]} }`                                                                                                                            |

Here are several examples of how react-admin can call the Data Provider:

```js
dataProvider.getList('posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
    filter: { author_id: 12 },
});
dataProvider.getOne('posts', { id: 123 });
dataProvider.getMany('posts', { ids: [123, 124, 125] });
dataProvider.getManyReference('comments', {
    target: 'post_id',
    id: 123,
    sort: { field: 'created_at', order: 'DESC' }
});
dataProvider.update('posts', {
    id: 123,
    data: { title: "hello, world!" },
    previousData: { title: "previous title" }
});
dataProvider.updateMany('posts', {
    ids: [123, 234],
    data: { views: 0 },
});
dataProvider.create('posts', { data: { title: "hello, world" } });
dataProvider.delete('posts', {
    id: 123,
    previousData: { title: "hello, world" }
});
dataProvider.deleteMany('posts', { ids: [123, 234] });
```

**Tip**: If your API supports more request types, you can add more methods to the Data Provider (for instance to support upserts, aggregations, or Remote Procedure Call). React-admin won't call these methods directly, but you can call them in your own component thanks to the `useDataProvider` hook described in the [Querying the API](./Actions.md) documentation.

## Response Format

Data Providers methods must return a Promise for an object with a `data` property.

| Method             | Response format                                                 |
| ------------------ | --------------------------------------------------------------- |
| `getList`          | `{ data: {Record[]}, total: {int}, validUntil?: {Date} }`       |
| `getOne`           | `{ data: {Record}, validUntil?: {Date} }`                       |
| `getMany`          | `{ data: {Record[]}, validUntil?: {Date} }`                     |
| `getManyReference` | `{ data: {Record[]}, total: {int} }`                            |
| `create`           | `{ data: {Record} }`                                            |
| `update`           | `{ data: {Record} }`                                            |
| `updateMany`       | `{ data: {mixed[]} }` The ids which have been updated           |
| `delete`           | `{ data: {Record} }` The record that has been deleted           |
| `deleteMany`       | `{ data: {mixed[]} }` The ids of the deleted records (optional) |

A `{Record}` is an object literal with at least an `id` property, e.g. `{ id: 123, title: "hello, world" }`.

Building up on the previous example, here are example responses matching the format expected by react-admin:

```js
dataProvider.getList('posts', {
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

dataProvider.getOne('posts', { id: 123 })
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world" }
// }

dataProvider.getMany('posts', { ids: [123, 124, 125] })
.then(response => console.log(response));
// {
//     data: [
//         { id: 123, title: "hello, world" },
//         { id: 124, title: "good day sunshise" },
//         { id: 125, title: "howdy partner" },
//     ]
// }

dataProvider.getManyReference('comments', {
    target: 'post_id',
    id: 123,
    sort: { field: 'created_at', order: 'DESC' }
})
.then(response => console.log(response));

// {
//     data: [
//         { id: 667, title: "I agree", post_id: 123 },
//         { id: 895, title: "I don't agree", post_id: 123 },
//     ],
//     total: 2,
// }

dataProvider.create('posts', { data: { title: "hello, world" } })
.then(response => console.log(response));
// {
//     data: { id: 450, title: "hello, world" }
// }

dataProvider.update('posts', {
    id: 123,
    data: { title: "hello, world!" },
    previousData: { title: "previous title" }
})
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world!" }
// }

dataProvider.updateMany('posts', {
    ids: [123, 234],
    data: { views: 0 },
})
.then(response => console.log(response));
// {
//     data: [123, 234]
// }

dataProvider.delete('posts', {
    id: 123,
    previousData: { title: "hello, world!" }
})
.then(response => console.log(response));
// {
//     data: { id: 123, title: "hello, world" }
// }

dataProvider.deleteMany('posts', { ids: [123, 234] })
.then(response => console.log(response));
// {
//     data: [123, 234]
// }
```

**Tip**: The `validUntil` field in the response is optional. It enables the Application cache, a client-side optimization to speed up rendering and reduce network traffic. Check [the Caching documentation](./Caching.md#application-cache) for more details.

## Error Format

When the API backend returns an error, the Data Provider should return a rejected Promise containing an `Error` object. This object should contain a `status` property with the HTTP response code (404, 500, etc.). React-admin inspects this error code, and uses it for [authentication](./Authentication.md) (in case of 401 or 403 errors). Besides, react-admin displays the error `message` on screen in a temporary notification.

If you use `fetchJson`, you don't need to do anything: HTTP errors are automatically decorated as expected by react-admin.

If you use another HTTP client, make sure you return a rejected Promise. You can use the `HttpError` class to throw an error with status in one line:

```js
import { HttpError } from 'react-admin';

export default {
    getList: (resource, params) => {
        return new Promise((resolve, reject) => {
            myApiClient(url, { ...options, headers: requestHeaders })
                .then(response =>
                    response.text().then(text => ({
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers,
                        body: text,
                    }))
                )
                .then(({ status, statusText, headers, body }) => {
                    let json;
                    try {
                        json = JSON.parse(body);
                    } catch (e) {
                        // not json, no big deal
                    }
                    if (status < 200 || status >= 300) {
                        return reject(
                            new HttpError(
                                (json && json.message) || statusText,
                                status,
                                json
                            )
                        );
                    }
                    return resolve({ status, headers, body, json });
                });
        });
    },
    // ...
};
```

## Example Implementation

Let's say that you want to map the react-admin requests to a REST backend exposing the following API:


### getList

```
GET http://path.to.my.api/posts?sort=["title","ASC"]&range=[0, 4]&filter={"author_id":12}

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
GET http://path.to.my.api/posts/123

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }
```

### getMany

```
GET http://path.to.my.api/posts?filter={"id":[123,124,125]}

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
GET http://path.to.my.api/comments?sort=["created_at","DESC"]&range=[0, 24]&filter={"post_id":123}

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
POST http://path.to.my.api/posts
{ "title": "hello, world", "author_id": 12 }

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }
```

### update

```
PUT http://path.to.my.api/posts/123
{ "title": "hello, world!" }

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world!", "author_id": 12 }
```

### updateMany

```
PUT http://path.to.my.api/posts?filter={"id":[123,124,125]}
{ "title": "hello, world!" }

HTTP/1.1 200 OK
Content-Type: application/json
[123, 124, 125]
```

### delete

```
DELETE http://path.to.my.api/posts/123

HTTP/1.1 200 OK
Content-Type: application/json
{ "id": 123, "title": "hello, world", "author_id": 12 }
```

### deleteMany

```
DELETE http://path.to.my.api/posts?filter={"id":[123,124,125]}

HTTP/1.1 200 OK
Content-Type: application/json
[123, 124, 125]
```

Here is an example implementation, that you can use as a base for your own Data Providers:

```js
import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = 'https://my.api.com/';
const httpClient = fetchUtils.fetchJson;

export default {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },
};
```

## Using The Data Provider In Components

React-admin stores the Data Provider passed to `<Admin>` in a React context, so you can access it from anywhere in your code. To facilitate usage, react-admin provides many data provider hooks:

* `useDataProvider`
* `useQuery`
* `useQueryWithStore`
* `useMutation`
* `useGetList`
* `useGetOne`
* `useGetMany`
* `useGetManyReference`
* `useCreate`
* `useUpdate`
* `useUpdateMany`
* `useDelete`
* `useDeleteMany`

Here is a glimpse of the `useGetOne` hook usage:

```jsx
import { useGetOne } from 'react-admin';

const UserProfile = ({ record }) => {
    const { data, loading, error } = useGetOne('users', record.id);
    if (loading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

You will find complete usage documentation for the data provider hooks in the [Querying the API](./Actions.md) documentation chapter.

## Real-Time Updates And Locks

Teams where several people work in parallel on a common task need to allow live updates, real-time notifications, and prevent data loss when two editors work on the same resource concurrently. 

[`ra-realtime`](https://marmelab.com/ra-enterprise/modules/ra-realtime) (an [Enterprise Edition <img class="icon" src="./img/premium.svg" />](https://marmelab.com/ra-enterprise) module) provides hooks and UI components to lock records, and update views when the underlying data changes. It's based on the Publish / Subscribe (PubSub) pattern, and requires a backend supporting this pattern (like GraphQL, Mercure). 

For instance, here is how to enable live updates on a List view:

```diff
import {
-   List,
    Datagrid,
    TextField,
    NumberField,
    Datefield,
} from 'react-admin';
+import { RealTimeList } from '@react-admin/ra-realtime';

const PostList = props => (
-   <List {...props}>
+   <RealTimeList {...props}>
        <Datagrid>
            <TextField source="title" />
            <NumberField source="views" />
            <DateField source="published_at" />
        </Datagrid>
-   </List>
+   </RealTimeList>
);
```

Check [the `ra-realtime` documentation](https://marmelab.com/ra-enterprise/modules/ra-realtime) for more details.

