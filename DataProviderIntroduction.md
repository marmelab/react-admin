---
layout: default
title: "Data Fetching"
---

# Data Fetching

Whenever react-admin needs to communicate with your APIs, it does it through an object called the `dataProvider`. The `dataProvider` exposes a predefined interface that allows react-admin to query any API in a normalized way. 

For instance, to query the API for a single record, react-admin calls `dataProvider.getOne()`: 

```js
dataProvider
    .getOne('posts', { id: 123 })
    .then(response => {
        console.log(response.data); // { id: 123, title: "hello, world" }
    });
```

It's the Data Provider's job to turn these method calls into HTTP requests, and transform the HTTP responses to the data format expected by react-admin. In technical terms, a Data Provider is an *adapter* for an API. 

![Data Provider architecture](./img/data-provider.png)

Thanks to this adapter system, react-admin can communicate with any API, whether it uses REST, GraphQL, RPC, or even SOAP, regardless of the dialect it uses. Check out the [list of supported backends](./DataProviderList.md) to pick an open-source package for your API.

You can also [Write your own Data Provider](./DataProviderWriting.md) so that it fits the particularities of your backend(s). Data Providers can use `fetch`, `axios`, `apollo-client`, or any other library to communicate with APIs. The Data Provider is also the ideal place to add custom HTTP headers, authentication, etc.

A Data Provider must have the following methods:

```jsx
const dataProvider = {
    getList:    (resource, params) => Promise, // get a list of records based on sort, filter, and pagination
    getOne:     (resource, params) => Promise, // get a single record by id
    getMany:    (resource, params) => Promise, // get a list of records based on an array of ids
    getManyReference: (resource, params) => Promise, // get the records referenced to another record, e.g. comments for a post
    create:     (resource, params) => Promise, // create a record
    update:     (resource, params) => Promise, // update a record based on a patch
    updateMany: (resource, params) => Promise, // update a list of records based on an array of ids and a common patch
    delete:     (resource, params) => Promise, // delete a record by id
    deleteMany: (resource, params) => Promise, // delete a list of records based on an array of ids
}
```

**Tip**: A Data Provider can have more methods than the 9 methods listed above. For instance, you create a dataProvider with custom methods for calling non-REST API endpoints, manipulating tree structures, subscribing to real time updates, etc.

The Data Provider is at the heart of react-admin's architecture. By being very opinionated about the Data Provider interface, react-admin can be very flexible AND provide very sophisticated features, including reference handling, optimistic updates, and automated navigation.
