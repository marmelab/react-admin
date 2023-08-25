---
layout: default
title: "withLifecycleCallbacks"
---

# `withLifecycleCallbacks`

This helper function adds logic to an existing [`dataProvider`](./DataProviders.md) for particular resources, using pre- and post- event handlers like `beforeGetOne` and `afterSave`.

**Note**: It's always preferable to **define custom business logic on the server side**. This helper is useful when you can't alter the underlying API, but has some serious [limitations](#limitations).

## Usage

Use `withLifecycleCallbacks` to decorate an existing data provider. In addition to the base data provider, this function takes an array of objects that define the callbacks for one resource.

For instance, to delete the comments related to a post before deleting the post itself:

```jsx
// in src/dataProvider.js
import { withLifecycleCallbacks } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = withLifecycleCallbacks(baseDataProvider, [
    {
        resource: 'posts',
        beforeDelete: async (params, dataProvider) => {
            // delete all comments related to the post
            // first, fetch the comments
            const { data: comments } = await dataProvider.getList('comments', {
                filter: { post_id: params.id },
                pagination: { page: 1, perPage: 1000 },
                sort: { field: 'id', order: 'DESC' },
            });
            // then, delete them
            await dataProvider.deleteMany('comments', { ids: comments.map(comment => comment.id) });

            return params;
        },
    },
]);
```

Then, inject the decorated data provider in the `<Admin>` component:

```jsx
// in src/App.js
import { Admin } from 'react-admin';
import { dataProvider } from './dataProvider';

export const App = () => (
    <Admin dataProvider={dataProvider}>
        {/* ... */}
    </Admin>
)
```

Lifecycle callbacks are a good way to:

- Add custom parameters before a `dataProvider` method is called (e.g. to set the query `meta` parameter based on the user profile),
- Clean up the data before it's sent to the API (e.g. to transform two `lat` and `long` values into a single `location` field),
- Add or rename fields in the data returned by the API before using it in react-admin (e.g. to add a `fullName` field based on the `firstName` and `lastName` fields),
- Update related records when a record is created, updated, or deleted (e.g. update the `post.nb_comments` field after a `comment` is created or deleted)
- Remove related records when a record is deleted (similar to a server-side `ON DELETE CASCADE`)

Here is another usage example:

```jsx
const dataProvider = withLifecycleCallbacks(
  jsonServerProvider("http://localhost:3000"),
  [
    {
      resource: "posts",
      afterRead: async (data, dataProvider) => {
        // rename field to the record
        data.user_id = data.userId;
        return data;
      },
      // executed after create, update and updateMany
      afterSave: async (record, dataProvider) => {
        // update the author's nb_posts
        const { total } = await dataProvider.getList("users", {
          filter: { id: record.user_id },
          pagination: { page: 1, perPage: 1 },
        });
        await dataProvider.update("users", {
          id: user.id,
          data: { nb_posts: total },
          previousData: user,
        });
        return record;
      },
      beforeDelete: async (params, dataProvider) => {
        // delete all comments linked to the post
        const { data: comments } = await dataProvider.getManyReference(
          "comments",
          {
            target: "post_id",
            id: params.id,
          }
        );
        if (comments.length > 0) {
          await dataProvider.deleteMany("comments", {
            ids: comments.map((comment) => comment.id),
          });
        }
        // update the author's nb_posts
        const { data: post } = await dataProvider.getOne("posts", {
          id: params.id,
        });
        const { total } = await dataProvider.getList("users", {
          filter: { id: post.user_id },
          pagination: { page: 1, perPage: 1 },
        });
        await dataProvider.update("users", {
          id: user.id,
          data: { nb_posts: total - 1 },
          previousData: user,
        });
        return params;
      },
    },
  ]
);
```

## `dataProvider`

The first argument must be a valid `dataProvider` object - for instance, [any third-party data provider](./DataProviderList.md). 

```jsx
// in src/dataProvider.js
import { withLifecycleCallbacks } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = withLifecycleCallbacks(baseDataProvider, [ /* lifecycle callbacks */ ]);
```

## `lifecycleCallbacks`

The second argument is an array of objects that define the callbacks to execute. One lifecycle callback object is required for each resource that needs to be decorated. One lifecycle callback object can define callbacks for multiple events.

```jsx
import jsonServerProvider from "ra-data-json-server";

export const dataProvider = withLifecycleCallbacks(
  jsonServerProvider("http://localhost:3000"),
  [
    {
        resource: "posts",
        afterRead: async (data, dataProvider) => { /* ... */ },
        afterSave: async (record, dataProvider) => { /* ... */ },
        beforeDelete: async (params, dataProvider) => { /* ... */ },
    },
    {
        resource: "comments",
        beforeSave: async (data, dataProvider) => { /* ... */ },
        afterCreate: async (result, dataProvider) => { /* ... */ },
    },
    {
        resource: "users",
        beforeGetList: async (params, dataProvider) => { /* ... */ },
        afterGetList: async (result, dataProvider) => { /* ... */ },
    }
  ]
);
```

A lifecycle callback object can have the following properties:

```jsx
const fooLifecycleCallback = {
  resource: /* resource name (required) */,
  // before callbacks
  beforeGetList: /* async (params, dataProvider) => params */,
  beforeGetOne: /* async (params, dataProvider) => params */,
  beforeGetMany : /* async (params, dataProvider) => params */,
  beforeGetManyReference: /* async (params, dataProvider) => params */,
  beforeCreate: /* async (params, dataProvider) => params */,
  beforeUpdate: /* async (params, dataProvider) => params */,
  beforeUpdateMany: /* async (params, dataProvider) => params */,
  beforeDelete: /* async (params, dataProvider) => params */,
  beforeDeleteMany: /* async (params, dataProvider) => params */,
  // after callbacks
  afterGetList: /* async (result, dataProvider) => result */,
  afterGetOne: /* async (result, dataProvider) => result */,
  afterGetMany: /* async (result, dataProvider) => result */,
  afterGetManyReference: /* async (result, dataProvider) => result */,
  afterCreate: /* async (result, dataProvider) => result */,
  afterUpdate: /* async (result, dataProvider) => result */,
  afterUpdateMany: /* async (result, dataProvider) => result */,
  afterDelete: /* async (result, dataProvider) => result */,
  afterDeleteMany: /* async (result, dataProvider) => result */,
  // special callbacks
  afterRead: /* async (record, dataProvider) => record */,
  beforeSave: /* async (data, dataProvider) => data */,
  afterSave: /* async (record, dataProvider) => record */,
}
```

The callbacks have different parameters:

### Before callbacks

The `beforeGetList`, `beforeGetOne`, `beforeGetMany `, `beforeGetManyReference`, `beforeCreate`, `beforeUpdate`, `beforeUpdateMany`, `beforeDelete`, and `beforeDeleteMany` callbacks receive the following arguments:

- `params`: the parameters passed to the dataProvider method
- `dataProvider`: the dataProvider itself, so you can call other dataProvider methods

### After callbacks 

The `afterGetList`, `afterGetOne`, `afterGetMany `, `afterGetManyReference`, `afterCreate`, `afterUpdate`, `afterUpdateMany`, `afterDelete`, and `afterDeleteMany` callbacks receive the following arguments:

- `response`: the response returned by the dataProvider method
- `dataProvider`: the dataProvider itself, so you can call other dataProvider methods

### `afterRead` 

Called after any dataProvider method that reads data (`getList`, `getOne`, `getMany`, `getManyReference`), letting you modify the records before react-admin uses them. It receives the following arguments:

- `record`: the record returned by the backend 
- `dataProvider`: the dataProvider itself, so you can call other dataProvider methods

For methods that return many records (`getList`, `getMany`, `getManyReference`), the callback is called once for each record.

```jsx
const postLifecycleCallbacks = {
  resource: "posts",
  afterRead: async (record, dataProvider) => {
    // rename field to the record
    record.user_id = record.userId;
    return data;
  },
};
```

### `beforeSave`

Called before any dataProvider method that saves data (`create`, `update`, `updateMany`), letting you modify the records before they are sent to the backend. It receives the following arguments:

- `data`: the record update to be sent to the backend (often, a diff of the record)
- `dataProvider`: the dataProvider itself, so you can call other dataProvider methods

```jsx
const postLifecycleCallbacks = {
  resource: "posts",
  beforeSave: async (data, dataProvider) => {
    data.update_at = Date.now();
    return data;
  },
};
```

### `afterSave`

Called after any dataProvider method that saves data (`create`, `update`, `updateMany`), letting you update related records. It receives the following arguments:

- `record`: the record returned by the backend 
- `dataProvider`: the dataProvider itself, so you can call other dataProvider methods

```jsx
const postLifecycleCallback = {
  resource: "posts",
  // executed after create, update and updateMany
  afterSave: async (record, dataProvider) => {
    // update the author's nb_posts
    const { total } = await dataProvider.getList("users", {
      filter: { id: record.user_id },
      pagination: { page: 1, perPage: 1 },
    });
    await dataProvider.update("users", {
      id: user.id,
      data: { nb_posts: total },
      previousData: user,
    });
    return record;
  },
}
```

For methods that return many records (`updateMany`), the callback is called once for each record.

## Limitations

As explained above, lifecycle callbacks are a fallback for business logic that you can't put on the server side. But they have some serious limitations:

- They execute outside of the React context, and therefore cannot use hooks. 
- As queries issued in the callbacks are not done through `react-query`, any change in the data will not be automatically reflected in the UI. If you need to update the UI, prefer putting the logic in [the `onSuccess` property of the mutation](./Actions.md#success-and-error-side-effects). 
- The callbacks are not executed in a transaction. In case of an error, the backend may be left in an inconsistent state.
- When another client than react-admin calls the API, the callbacks will not be executed. If you depend on these callbacks for data consistency, this prevents you from exposing the API to other clients
- If a callback triggers the event it's listening to (e.g. if you update the record received in an `afterSave`), this will lead to an infinite loop.
- Do not use lifecycle callbacks to implement authorization logic, as the JS code can be altered in the browser using development tools. Check this [tutorial on multi-tenant single-page apps](https://marmelab.com/blog/2022/12/14/multitenant-spa.html) for more details.

In short: use lifecycle callbacks with caution!

## Code Organization

Lifecycle callbacks receive the `dataProvider` as the second argument, so you don't actually need to define them in the same file as the main data provider code. It's a good practice to put the lifecycle callbacks for a resource in the same directory as the other business logic code for that resource.  

```jsx
// in src/posts/index.js
export const postLifecycleCallbacks = {
    resource: 'posts',
    beforeDelete: async (params, dataProvider) => {
        // delete all comments related to the post
        // first, fetch the comments
        const { data: comments } = await dataProvider.getList('comments', {
            filter: { post_id: params.id },
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'id', order: 'DESC' },
        });
        // then, delete them
        await dataProvider.deleteMany('comments', { ids: comments.map(comment => comment.id) });

        return params;
    },
};
```

Then, import the callbacks into your data provider:

```jsx
// in src/dataProvider.js
import simpleRestProvider from 'ra-data-simple-rest';

import { postLifecycleCallbacks } from './posts';
import { commentLifecycleCallbacks } from './comments';
import { userLifecycleCallbacks } from './users';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = withLifecycleCallbacks(baseDataProvider, [
    postLifecycleCallbacks,
    commentLifecycleCallbacks,
    userLifecycleCallbacks,
]);
```

You can test isolated lifecycle callbacks by mocking the `dataProvider`:

```jsx
// in src/posts/index.test.js
import { withLifecycleCallbacks } from 'react-admin';

import { postLifecycleCallbacks } from './index';

describe('postLifecycleCallbacks', () => {
    it('should delete related comments when deleting a post', async () => {
        const dataProvider = {
            getList: jest.fn().mockResolvedValue({ data: [{ id: 1, post_id: 123 }, { id: 2, post_id: 123 }], total: 2 }),
            delete: jest.fn().mockResolvedValue({ data: { id: 123 } }),
            deleteMany: jest.fn().mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] }),
        };
        const wrappedDataProvider = withLifecycleCallbacks(dataProvider, [postLifecycleCallbacks]);
        await wrappedDataProvider.delete('posts', { id: 123 });
        expect(dataProvider.deleteMany).toHaveBeenCalledWith('comments', { ids: [1, 2] });
    });
});
```
