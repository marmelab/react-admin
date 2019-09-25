---
layout: default
title: "Querying the API"
---

# Querying the API

Admin interfaces often have to query the API beyond CRUD requests. For instance, a user profile page may need to get the User object based on a user id. Or, users may want to an "Approve" a comment by pressing a button, and this action should update the `is_approved` property and save the updated record in one click.

React-admin provides special hooks to emit read and write queries to the `dataProvider`, which in turn sends requests to your API.

## `useQuery` Hook

Use the `useQuery` hook to emit a read query to the API when a component mounts. Call it with an object having the same fields as the parameters expected by the [`dataProvider`](./DataProviders.md):

- `type`: The Query type, e.g `GET_LIST`
- `resource`: The Resource name, e.g. "posts"
- `payload`: Query parameters. Depends on the query type.

The return value of `useQuery` is an object, which updates according to the request state:

- start: `{ loading: true, loaded: false }`
- success: `{ data: [data from response], total: [total from response], loading: false, loaded: true }`
- error: `{ error: [error from response], loading: false, loaded: true }`

Here is an implementation of a user profile component using the `useQuery` hook:

```jsx
import { useQuery, GET_ONE } from 'react-admin';

const UserProfile = ({ record }) => {
    const { loaded, error, data } = useQuery({
        type: GET_ONE,
        resource: 'users',
        payload: { id: record.id }
    });
    if (!loaded) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

Under the hood, `useQuery` dispatches a Redux action (named `CUSTOM_FETCH`), which triggers the global loading indicator in the top bar. This action then queries your `dataProvider`, passing it the exact same parameters.

In this example, the `dataProvider` receives a query for `('GET_ONE', 'users', { id: 123 })`. It should return a Promise for a response with a `data` key looking like `{ data: { id: 123, username: 'john_doe', firstName: 'John', lastName: 'Doe' } }`. That `data` ends up in the hook return value, and the loading indicator stops spinning.

Here is another example usage of `useQuery`, this time to display a list of users:

```jsx
import { useQuery, GET_LIST } from 'react-admin';

const UserList = () => {
    const { loading, error, data, total } = useQuery({
        type: GET_LIST,
        resource: 'users',
        payload: {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'username', order: 'ASC' },
        }
    });
    if (loading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <div>
            <p>Total users: {total}</p>
            <ul>
                {data.map(user => <li key={user.username}>{user.username}</li>)}
            </ul>
        </div>
    );
};
```

As a reminder, here are the read query types handled by data providers:

Type                 | Usage                                           | Params format              | Response format
-------------------- | ------------------------------------------------|--------------------------- | ---------------
`GET_LIST`           | Search for resources                            | `{ pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }` | `{ data: {Record[]}, total: {int} }`
`GET_ONE`            | Read a single resource, by id                   | `{ id: {mixed} }`          | `{ data: {Record} }`
`GET_MANY`           | Read a list of resource, by ids                 | `{ ids: {mixed[]} }`       | `{ data: {Record[]} }`
`GET_MANY_REFERENCE` | Read a list of resources related to another one | `{ target: {string}, id: {mixed}, pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }`     | `{ data: {Record[]} }`

You can destructure the return value of the `useQuery` hook as `{ data, total, error, loading, loaded }`.

**Tip**: Your `dataProvider` should return the `total` value for list queries only, to express the total number of results (which may be higher than the number of returned results if the response is paginated). 

## `useQueryWithStore` Hook

Internally, react-admin uses a more powerful version of `useQuery` called `useQueryWithStore`, which has an internal cache. In practice, `useQueryWithStore` persist the response from the dataProvider in the internal react-admin redux store, so that result remains available if the hook is called again in the future.  

You can use this hook to avoid showing the loading indicator if the query was already fetched once. 

```diff
-import { useQuery, GET_ONE } from 'react-admin';
+import { useQueryWithStore, GET_ONE } from 'react-admin';

const UserProfile = ({ record }) => {
-   const { loaded, error, data } = useQuery({
+   const { loaded, error, data } = useQueryWithStore({
        type: GET_ONE,
        resource: 'users',
        payload: { id: record.id }
    });
    if (!loaded) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

## `useMutation` Hook

`useQuery` emits the request to the `dataProvider` as soon as the component mounts. To emit the request based on a user action, use the `useMutation` hook instead. This hook takes the same arguments as `useQuery`, but returns a callback that emits the request when executed, and an object containing the request state:

- mount: { loading: false, loaded: false }
- mutate called: { loading: true, loaded: false }
- success: { data: [data from response], total: [total from response], loading: false, loaded: true }
- error: { error: [error from response], loading: false, loaded: true }

Here is an implementation of an "Approve" button:

```jsx
// in src/comments/ApproveButton.js
import { useMutation, UPDATE } from 'react-admin';

const ApproveButton = ({ record }) => {
    const [approve, { loading }] = useMutation({
        type: UPDATE,
        resource: 'comments',
        payload: { id: record.id, data: { isApproved: true } }
    });
    return <FlatButton label="Approve" onClick={approve} disabled={loading} />;
};
```

Under the hood, `useMutation` also dispatches a Redux `CUSTOM_FETCH` action, and takes care of showing the global loading indicator when the request is emitted.

User actions usually trigger write queries - that's why this hook is called `useMutation`. As a reminder, here are the write query types handled by data providers:

Type                 | Usage                     | Params format                             | Response format
-------------------- | --------------------------|------------------------------------------ | ---------------
`CREATE`             | Create a single resource  | `{ data: {Object} }`                      | `{ data: {Record} }`
`UPDATE`             | Update a single resource  | `{ id: {mixed}, data: {Object}, previousData: {Object} }` | `{ data: {Record} }`
`UPDATE_MANY`        | Update multiple resources | `{ ids: {mixed[]}, data: {Object} }`      | `{ data: {mixed[]} }` The ids which have been updated
`DELETE`             | Delete a single resource  | `{ id: {mixed}, previousData: {Object} }` | `{ data: {Record} }`
`DELETE_MANY`        | Delete multiple resources | `{ ids: {mixed[]} }`                      | `{ data: {mixed[]} }` The ids which have been deleted

You can destructure the return value of the `useMutation` hook as `[mutate,  { data, total, error, loading, loaded }]`.

This `ApproveButton` can be used right away, for instance in the list of comments, where `<Datagrid>` automatically injects the `record` to its children:

```jsx
// in src/comments/index.js
import ApproveButton from './ApproveButton';

export const CommentList = (props) =>
    <List {...props}>
        <Datagrid>
            <DateField source="created_at" />
            <TextField source="author.name" />
            <TextField source="body" />
            <BooleanField source="is_approved" />
            <ApproveButton />
        </Datagrid>
    </List>;
```

**Tip**: For simple mutations, you can use a specialised hook like `useUpdate` instead of the more generic `useMutation`. The main benefit is that `useUpdate` will update the record in Redux store first, allowing optimistic rendering of the UI:

```jsx
import { useUpdate } from 'react-admin';

const ApproveButton = ({ record }) => {
    const [approve, { loading }] = useUpdate('comments', record.id, { isApproved: true }, record);
    return <FlatButton label="Approve" onClick={approve} disabled={loading} />;
};
```

**Tip**: The mutation data can also be passed at call time, using the second parameter of the `mutate` callback:

```jsx
import { useMutation, UPDATE } from 'react-admin';

const MarkDateButton = ({ record }) => {
    const [approve, { loading }] = useMutation({
        type: UPDATE,
        resource: 'posts',
        payload: { id: record.id } // no data
    });
    // the mutation callback expects call time payload as second parameter
    // and merges it with the initial payload when called
    return <FlatButton
        label="Mark Date"
        onClick={() => approve(null, {
            data: { updatedAt: new Date() } // data defined here
        })}
        disabled={loading}
    />;
};
```

## Handling Side Effects

Fetching data is called a *side effect*, since it calls the outside world, and is asynchronous. Usual actions may have other side effects, like showing a notification, or redirecting the user to another page. Both `useQuery` and `useMutation` hooks accept a second parameter in addition to the query, which lets you describe the options of the query, including success and failure side effects. 

Here is how to add notifications and a redirection to the `ApproveButton` component using that fourth parameter:

```diff
// in src/comments/ApproveButton.js
-import { useMutation, UPDATE } from 'react-admin';
+import { useMutation, useNotify, useRedirect, UPDATE } from 'react-admin';

const ApproveButton = ({ record }) => {
+   const notify = useNotify();
+   const redirect = useRedirect();
    const [approve, { loading }] = useMutation(
        {
            type: UPDATE,
            resource: 'comments',
            payload: { id: record.id, data: { isApproved: true } },
        },
+       {
+           onSuccess: ({ data }) => {
+               notify('Comment approved', 'info');,
+               redirect('/comments'),
+           },
+           onFailure: (error) => notify(`Error: ${error.message}`, 'warning'),
+       }
    );
    return <FlatButton label="Approve" onClick={approve} disabled={loading} />;
};
```

The `onSuccess` function is called with the response from the `dataProvider` as argument. The `onError` function is called with the error returned by the `dataProvider`.

React-admin provides the following hooks to handle most common side effects:

- `useNotify`: Return a function to display a notification. The arguments should be a message (it can be a translation key), a level (either `info` or `warning`), an options object to pass to the `translate()` function, and a boolean to set to `true` if the notification should contain an "undo" button.
- `useRedirect`: Return a function to redirect the user to another page. The arguments should be the path to redirect the user to, and the current `basePath`.
- `useRefresh`: Return a function to force a rerender of the current view (equivalent to pressing the Refresh button).
- `useUnselectAll`: Return a function to unselect all lines in the current datagrid. Pass the name of the resource as argument.

## Optimistic Rendering and Undo

In the previous example, after clicking on the "Approve" button, a spinner displays while the data provider is fetched. Then, users are redirected to the comments list. But in most cases, the server returns a success response, so the user waits for this response for nothing.

For its own fetch actions, react-admin uses an approach called *optimistic rendering*. The idea is to handle the calls to the `dataProvider` on the client side first (i.e. updating entities in the Redux store), and re-render the screen immediately. The user sees the effect of their action with no delay. Then, react-admin applies the success side effects, and only after that, it triggers the call to the data provider. If the fetch ends with a success, react-admin does nothing more than a refresh to grab the latest data from the server. In most cases, the user sees no difference (the data in the Redux store and the data from the data provider are the same). If the fetch fails, react-admin shows an error notification, and forces a refresh, too.

As a bonus, while the success notification is displayed, users have the ability to cancel the action *before* the data provider is even called.

You can benefit from optimistic rendering when you call the `useQuery` and `useMutation` hooks, too. You just need to pass the `undoable: true` option in the options parameter:

```diff
// in src/comments/ApproveButton.js
import { useMutation, UPDATE } from 'react-admin';

const ApproveButton = ({ record }) => {
    const [approve, { loading }] = useMutation(
        {
            type: UPDATE,
            resource: 'comments',
            payload: { id: record.id, data: { isApproved: true } },
        },
        {
+           undoable: true,
            onSuccess: ({ data }) => {
-               notify('Comment approved', 'info');,
+               notify('Comment approved', 'info', {}, true);,
                redirect('/comments'),
            },
            onFailure: (error) => notify(`Error: ${error.message}`, 'warning'),
        }
    );
    return <FlatButton label="Approve" onClick={approve} disabled={loading} />;
};
```

## `useDataProvider` Hook

Sometimes `useQuery` and `useMutation` are too limited, for instance when you need to execute several queries in a row, and update the component state when all the queries have returned. For this use case, use the `useDataProvider` hook, which returns a `dataProvider` callback. This callback behaves exactly like the raw `dataProvider`, except it uses Redux under the hood. That means that it returns a Promise for the result.

For instance, here is how to query for a list of pending reviews together with the author of each review:

```jsx
import { useState, useEffect } from 'react';
import { useDataProvider, GET_LIST, GET_MANY } from 'react-admin';

const Dashboard = () => {
    const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        (async function() { // useEffect doesn't accept async functions
            const { data: pendingReviews } = await dataProvider(
                GET_LIST,
                'reviews',
                { filter: { status: 'pending' }, sort: { field: 'date', order: 'DESC' } }
            );
            const customerIds = pendingReviews.map(review => review.customer_id);
            const uniqueCustomerIds = [...new Set(customerIds)];
            const { data: customers } = await dataProvider(
                GET_MANY,
                'customers',
                { ids: uniqueCustomerIds }
            );
            const customersById = customers.reduce((prev, customer) => {
                prev[customer.id] = customer;
                return prev;
            }, {});
            const pendingReviewsWithCustomers = pendingReviews.map(review => ({
                ...review,
                customer: customersById[review.customer_id]
            }))
            setReviews(pendingReviewsWithCustomers);
            setLoading(false);
        })();
    }, []);

    if (loading) { return <Loading />; }
    return (
        <div>
            {reviews.map(review => (
                <div key={review.id}>
                    Review on Product {review.product_id}
                    By {review.customer.username}:<br />
                    {review.body}
                </div>
            ))}
        </div>
    )
}
```

`useDataProvider` is more low-level than `useQuery` and `useMutation`, as it doesn't handle loading and error states (even though queries from `useDataProvider` trigger the global loading indicator). The `dataProvider` callback that it returns also accepts a fourth options parameter.

## Legacy Components: `<Query>`, `<Mutation>`, and `withDataProvider`

Before react had hooks, react-admin used render props and higher order components to provide the same functionality. Legacy code will likely contain instances of `<Query>`, `<Mutation>`, and `withDataProvider`. Their syntax, which is identical to their hook counterpart, is illustrated below.

You can fetch and display a user profile using the `<Query>` component, which uses render props:

{% raw %}
```jsx
import { Query, GET_ONE } from 'react-admin';

const UserProfile = ({ record }) => (
    <Query type={GET_ONE} resource="users" payload={{ id: record.id }}>
        {({ data, loading, error }) => {
            if (loading) { return <Loading />; }
            if (error) { return <p>ERROR</p>; }
            return <div>User {data.username}</div>;
        }}
    </Query>
);
```
{% endraw %}

Or, query a user list on the dashboard with the same `<Query>` component:

```jsx
import { Query, GET_LIST } from 'react-admin';

const payload = {
   pagination: { page: 1, perPage: 10 },
   sort: { field: 'username', order: 'ASC' },
};

const UserList = () => (
    <Query type={GET_LIST} resource="users" payload={payload}>
        {({ data, total, loading, error }) => {
            if (loading) { return <Loading />; }
            if (error) { return <p>ERROR</p>; }
            return (
                <div>
                    <p>Total users: {total}</p>
                    <ul>
                        {data.map(user => <li key={user.username}>{user.username}</li>)}
                    </ul>
                </div>
            );
        }}
    </Query>
);
```

Just like `useQuery`, the `<Query>` component expects three parameters: `type`, `resource`, and `payload`. It fetches the data provider on mount, and passes the data to its child component once the response from the API arrives.

And if you need to chain API calls, don't hesitate to nest `<Query>` components.

When calling the API to update ("mutate") data, use the `<Mutation>` component instead. It passes a callback to trigger the API call to its child function. 

Here is a version of the `<ApproveButton>` component demonstrating `<Mutation>`:

```jsx
import { Mutation, UPDATE, useNotify, useRedirect } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const payload = { id: record.id, data: { ...record, is_approved: true } };
    const options = {
        undoable: true,
        onSuccess: ({ data }) => {
            notify('Comment approved', 'info', {}, true);,
            redirect('/comments'),
        },
        onFailure: (error) => notify(`Error: ${error.message}`, 'warning'),
    };
    return (
        <Mutation
            type={UPDATE}
            resource="comments"
            payload={payload}
            options={options}
        >
            {(approve, { loading }) => (
                <FlatButton label="Approve" onClick={approve} disabled={loading} />
            )}
        </Mutation>
    );
}

export default ApproveButton;
```

And here is the `<Dashboard>` component using the `withDataProvider` HOC instead of the `useProvider` hook:

```diff
import { useState, useEffect } from 'react';
-import { useDataProvider, GET_LIST, GET_MANY } from 'react-admin';
+import { wihtDataProvider, GET_LIST, GET_MANY } from 'react-admin';

-const Dashboard = () => {
+const Dashboard = ({ dataProvider }) => {
-   const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        (async function() { // useEffect doesn't accept async functions
            const { data: pendingReviews } = await dataProvider(
                GET_LIST,
                'reviews',
                { filter: { status: 'pending' }, sort: { field: 'date', order: 'DESC' } }
            );
            // ...
        })();
    }, []);

    return (
        <div>
            {reviews.map(review => (
                <div key={review.id}>
                    Review on Product {review.product_id}
                    By {review.customer.username}:<br />
                    {review.body}
                </div>
            ))}
        </div>
    )
}

-export default Dashboard;
+export default withDataProvider(Dashboard);
```

Note that these components are implemented in react-admin using the hooks described earlier. If you're writing new components, prefer the hooks, which are faster, and do not pollute the component tree.

## Querying The API With `fetch`

`useQuery`, `useMutation` and `useDataProvider` are "the react-admin way" to query the API, but nothing prevents you from using `fetch` if you want. For instance, when you don't want to add some routing logic to the data provider for a RPC method on your API, that makes perfect sense.

There is no special react-admin sauce in that case. Here is an example implementation of calling `fetch` in a component:

```jsx
// in src/comments/ApproveButton.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNotify, , useRedirect, fetchStart, fetchEnd } from 'react-admin';
import { push } from 'connected-react-router';

const ApproveButton = ({ record }) => {
    const dispatch = useDispatch();
    const redirect = useRedirect();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const handleClick = () => {
        setLoading(true);
        dispatch(fetchStart()); // start the global loading indicator 
        const updatedRecord = { ...record, is_approved: true };
        fetch(`/comments/${record.id}`, { method: 'PUT', body: updatedRecord })
            .then(() => {
                notify('Comment approved');
                redirect('/comments');
            })
            .catch((e) => {
                notify('Error: comment not approved', 'warning')
            })
            .finally(() => {
                setLoading(false);
                dispatch(fetchEnd()); // stop the global loading indicator
            });
    }

    return <Button label="Approve" onClick={handleClick} disabled={loading} />;
}

export default ApproveButton;
```

**TIP**: APIs often require a bit of HTTP plumbing to deal with authentication, query parameters, encoding, headers, etc. It turns out you probably already have a function that maps from a REST request to an HTTP request: your [Data Provider](./DataProviders.md). So it's often better to use `useDataProvider` instead of `fetch`.

## Making An Action Undoable

When using the `useMutation` hook, you could trigger optimistic rendering and get an undo button for free. The same feature is possible using custom actions. You need to decorate the action with the `startUndoable` action creator:

```diff
// in src/comments/ApproveButton.js
import { dispatch } from 'react-redux';
import { commentApprove } from './commentActions';
+import { startUndoable } from 'react-admin';

const ApproveButton = ({ record }) => {
    const dispatch = useDispatch();
    const handleClick = () => {
-       dispatch(commentApprove(record.id, record));
+       dispatch(startUndoable(commentApprove(record.id, record)));
    }
    return <Button onClick={handleClick}>Approve</Button>;
}

export default ApproveButton;
```

And that's all it takes to make a fetch action optimistic.

## Altering the Form Values before Submitting

Sometimes, you may want your custom action to alter the form values before actually sending them to the `dataProvider`.
For those cases, you should know that every buttons inside a form [Toolbar](/CreateEdit.md#toolbar) receive two props:

- `handleSubmit` which calls the default form save method
- `handleSubmitWithRedirect` which calls the default form save method but allows to specify a custom redirection

Knowing this, there are two ways to alter the form values before submit:

1. Using react-final-form API to send change events

```jsx
import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { SaveButton, Toolbar, useCreate, useRedirect, useNotify } from 'react-admin';

const SaveWithNoteButton = ({ handleSubmitWithRedirect, ...props }) => {
    const [create] = useCreate('posts');
    const redirectTo = useRedirect();
    const notify = useNotify();
    const { basePath, redirect } = props;

    const form = useForm();

    const handleClick = useCallback(() => {
        form.change('average_note', 10);

        handleSubmitWithRedirect('edit');
    }, [form]);

    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};
```

2. Using react-admin hooks to run custom mutations

For instance, in the `simple` example:

```jsx
import React, { useCallback } from 'react';
import { useFormState } from 'react-final-form';
import { SaveButton, Toolbar, useCreate, useRedirect, useNotify } from 'react-admin';

const SaveWithNoteButton = props => {
    const [create] = useCreate('posts');
    const redirectTo = useRedirect();
    const notify = useNotify();
    const { basePath, redirect } = props;

    const formState = useFormState();
    const handleClick = useCallback(() => {
        if (!formState.valid) {
            return;
        }

        create(
            null,
            {
                data: { ...formState.values, average_note: 10 },
            },
            {
                onSuccess: ({ data: newRecord }) => {
                    notify('ra.notification.created', 'info', {
                        smart_count: 1,
                    });
                    redirectTo(redirect, basePath, newRecord.id, newRecord);
                },
            }
        );
    }, [
        formState.valid,
        formState.values,
        create,
        notify,
        redirectTo,
        redirect,
        basePath,
    ]);

    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};
```

This button can be used in the `PostCreateToolbar` component:

```jsx
const PostCreateToolbar = props => (
    <Toolbar {...props}>
        <SaveButton
            label="post.action.save_and_show"
            redirect="show"
            submitOnEnter={true}
        />
        <SaveWithNoteButton
            label="post.action.save_with_average_note"
            redirect="show"
            submitOnEnter={false}
            variant="text"
        />
    </Toolbar>
);
```

## Custom Sagas

React-admin promotes a programming style where side effects are decoupled from the rest of the code, which has the benefit of making them testable.

In react-admin, side effects are handled by Sagas. [Redux-saga](https://redux-saga.github.io/redux-saga/) is a side effect library built for Redux, where side effects are defined by generator functions. If this is new to you, take a few minutes to go through the Saga documentation.

Here is the generator function necessary to handle the side effects for a failed `COMMENT_APPROVE` action which would log the error with an external service such as [Sentry](https://sentry.io):

```jsx
// in src/comments/commentSaga.js
import { call, takeEvery } from 'redux-saga/effects';

function* commentApproveFailure({ error }) {
    yield call(Raven.captureException, error);
}

export default function* commentSaga() {
    yield takeEvery('COMMENT_APPROVE_FAILURE', commentApproveFailure);
}
```

Let's explain all of that, starting with the final `commentSaga` generator function. A [generator function](http://exploringjs.com/es6/ch_generators.html) (denoted by the `*` in the function name) gets paused on statements called by `yield` - until the yielded statement returns. `yield takeEvery([ACTION_NAME], callback)` executes the provided callback [every time the related action is called](https://redux-saga.github.io/redux-saga/docs/basics/UsingSagaHelpers.html). To summarize, this will execute `commentApproveFailure` when the fetch initiated by `commentApprove()` fails.

As for `commentApproveFailure`, it just dispatch a [`call`](https://redux-saga.js.org/docs/api/#callfn-args) side effect to the `captureException` function from the global `Raven` object.

To use this saga, pass it in the `customSagas` props of the `<Admin>` component:

```jsx
// in src/App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';

import { CommentList } from './comments';
import commentSaga from './comments/commentSaga';

const App = () => (
    <Admin customSagas={[ commentSaga ]} dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')}>
        <Resource name="comments" list={CommentList} />
    </Admin>
);

export default App;
```

With this code, a failed review approval now sends the the correct signal to Sentry.

**Tip**:  The side effects are [testable](https://redux-saga.github.io/redux-saga/docs/introduction/BeginnerTutorial.html#making-our-code-testable), too.

## Using a Custom Reducer

In addition to triggering REST calls, you may want to store the effect of your own actions in the application state. For instance, if you want to display a widget showing the current exchange rate for the bitcoin, you might need the following action:

```jsx
// in src/bitcoinRateReceived.js
export const BITCOIN_RATE_RECEIVED = 'BITCOIN_RATE_RECEIVED';
export const bitcoinRateReceived = (rate) => ({
    type: BITCOIN_RATE_RECEIVED,
    payload: { rate },
});
```

This action can be triggered on mount by the following component:

```jsx
// in src/BitCoinRate.js
import React from 'react';
import { dispatch } from 'react-redux';
import { bitcoinRateReceived } from './bitcoinRateReceived';

const BitCoinRate = ({ rate }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        fetch('https://blockchain.info/fr/ticker')
            .then(response => response.json())
            .then(rates => rates.USD['15m'])
            .then(() => dispatch(bitcoinRateReceived(rate))) // dispatch action when the response is received
    }, []);

    return <div>Current bitcoin value: {rate}$</div>
}

export default BitCoinRate;
```

In order to put the rate passed to `bitcoinRateReceived()` into the Redux store, you'll need a reducer:

```jsx
// in src/rateReducer.js
import { BITCOIN_RATE_RECEIVED } from './bitcoinRateReceived';

export default (previousState = 0, { type, payload }) => {
    if (type === BITCOIN_RATE_RECEIVED) {
        return payload.rate;
    }
    return previousState;
}
```

Now the question is: How can you put this reducer in the `<Admin>` app? Simple: use the `customReducers` props:

{% raw %}
```jsx
// in src/App.js
import React from 'react';
import { Admin } from 'react-admin';

import rate from './rateReducer';

const App = () => (
    <Admin customReducers={{ rate }} dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')}>
        ...
    </Admin>
);

export default App;
```
{% endraw %}

**Tip**: You can avoid storing data in the Redux state by storing data in a component state instead. It's much less complicated to deal with, and more performant, too. Use the global state only when you need to access data from several components which are far away in the application tree.

## List Bulk Actions

Almost everything we saw before about custom actions is true for custom `List` bulk action buttons too, with the following few differences:

* Bulk action button components receive the following props: `resource`, `selectedIds` and `filterValues`
* They do not receive the current record in the `record` prop as there are many of them.

You can find a complete example of a custom Bulk Action button in the `List` documentation, in the [Bulk Action Buttons](./List.html#bulk-action-buttons) section.
