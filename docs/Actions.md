---
layout: default
title: "Querying the API"
---

# Querying the API

Admin interfaces often have to query the API beyond CRUD requests. For instance, in an administration for comments, an "Approve" button (allowing to update the `is_approved` property and to save the updated record in one click) - is a must have.

How can you add such custom actions with react-admin? There are several answers to that question, and you should understand the strengths and drawbacks of each solution before choosing one.

* [Using `fetch`](#the-basic-way-using-fetch)
* [Using the `dataProvider`](#using-the-data-provider-instead-of-fetch)
* [Using the `withDataProvider` Decorator](#using-the-withdataprovider-decorator)
* [Using the `<Query>` and `<Mutation>` Components](#query-and-mutation-components)
* [Using a Custom Action Creator](#using-a-custom-action-creator)

**Tip**: If you don't have the time to read this entire chapter, head to [the `<Query>` and `<Mutation>` components section](#query-and-mutation-components). It's the best choice in 90% of the cases.

## The Basic Way: Using `fetch`

Here is an implementation of the "Approve" button using the browser `fetch()` function that works fine:

```jsx
// in src/comments/ApproveButton.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { showNotification } from 'react-admin';
import { push } from 'react-router-redux';

class ApproveButton extends Component {
    handleClick = () => {
        const { push, record, showNotification } = this.props;
        const updatedRecord = { ...record, is_approved: true };
        fetch(`/comments/${record.id}`, { method: 'PUT', body: updatedRecord })
            .then(() => {
                showNotification('Comment approved');
                push('/comments');
            })
            .catch((e) => {
                showNotification('Error: comment not approved', 'warning')
            });
    }

    render() {
        return <Button label="Approve" onClick={this.handleClick} />;
    }
}

ApproveButton.propTypes = {
    push: PropTypes.func,
    record: PropTypes.object,
    showNotification: PropTypes.func,
};

export default connect(null, {
    showNotification,
    push,
})(ApproveButton);
```

The `handleClick` function makes a `PUT` request the REST API with `fetch`, then displays a notification (with `showNotification`) and redirects to the comments list page (with `push`);

`showNotification` and `push` are *action creators*. This is a Redux term for functions that return a simple action object. When given an object of action creators in the second argument, `connect()` will [decorate each action creator](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) with Redux' `dispatch` method, so in the `handleClick` function, a call to `showNotification()` is actually a call to `dispatch(showNotification())`.

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

Or, in the `<Edit>` page, as a [custom action](./CreateEdit.md#actions):

```jsx
// in src/comments/CommentEditActions.js
import React from 'react';
import CardActions from '@material-ui/core/CardActions';
import ApproveButton from './ApproveButton';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const CommentEditActions = ({ basePath, data, resource }) => (
    <CardActions style={cardActionStyle}>
        <ApproveButton record={data} />
    </CardActions>
);

export default CommentEditActions;

// in src/comments/index.js
import CommentEditActions from './CommentEditActions';

export const CommentEdit = (props) =>
    <Edit {...props} actions={<CommentEditActions />}>
        ...
    </Edit>;
```

## Using The Data Provider Instead of Fetch

The previous code uses `fetch()`, which means it makes HTTP requests directly. But APIs often require a bit of HTTP plumbing to deal with authentication, query parameters, encoding, headers, etc. It turns out you probably already have a function that maps from a REST request to an HTTP request: the [Data Provider](./DataProviders.md). So it's a good idea to use this function instead of `fetch` - provided you have exported it:

```jsx
// in src/dataProvider.js
import jsonServerProvider from 'ra-data-json-server';
export default jsonServerProvider('http://Mydomain.com/api/');
```

The `dataProvider` function returns a Promise, so the difference with `fetch` is minimal:

```diff
// in src/comments/ApproveButton.js
-import { showNotification } from 'react-admin';
+import { showNotification, UPDATE } from 'react-admin';
+import dataProvider from '../dataProvider';

class ApproveButton extends Component {
    handleClick = () => {
        const { push, record, showNotification } = this.props;
        const updatedRecord = { ...record, is_approved: true };
-       fetch(`/comments/${record.id}`, { method: 'PUT', body: updatedRecord })
+       dataProvider(UPDATE, 'comments', { id: record.id, data: updatedRecord })
            .then(() => {
                showNotification('Comment approved');
                push('/comments');
            })
            .catch((e) => {
                showNotification('Error: comment not approved', 'warning')
            });
    }

    render() {
        return <Button label="Approve" onClick={this.handleClick} />;
    }
}
```

As a reminder, the signature of the  `dataProvider` function is:

```jsx
/**
 * Query a data provider and return a promise for a response
 *
 * @example
 * dataProvider(GET_ONE, 'posts', { id: 123 })
 *  => new Promise(resolve => resolve({ id: 123, title: "hello, world" }))
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the action type
 * @returns {Promise} the Promise for a response
 */
const dataProvider = (type, resource, params) => new Promise();
```

As for the syntax of the various request types (`GET_LIST`, `GET_ONE`, `UPDATE`, etc.), head to the [Data Provider documentation](./DataProviders.md#request-format) for more details.

## Using the `withDataProvider` Decorator

Using either `fetch` or the `dataProvider` has one drawback: while the request is being processed by the server, the UI doesn't show the loading indicator.

React-admin components don't call the `dataProvider` function directly. Instead, they dispatch special Redux actions that react-admin turns into `dataProvider` calls. This allows react-admin to handle the loading state automatically. 

You can use the same feature for your own components. You'll need to wrap your component with a function called `withDataProvider`, which injects a `dataProvider` prop to the component. This `dataProvider` prop is a function which behaves exactly like your own `dataProvider`: it has the same signature, and it returns a Promise. The only difference is that it uses Redux under the hood. That means you get a loading indicator! In addition, `withDataProvider` injects the `dispatch` function into the component, so you don't even need to `connect()` your own component to dispatch actions anymore.

Here is the `ApproveButton` component modified to use `withDataProvider`:

```diff
// in src/comments/ApproveButton.js
import {
   showNotification,
   UPDATE,
+  withDataProvider,
} from 'react-admin';
-import { connect } from 'react-redux';
-import dataProvider from '../dataProvider';

class ApproveButton extends Component {
    handleClick = () => {
-       const { push, record, showNotification } = this.props;
+       const { dataProvider, dispatch, record } = this.props;
        const updatedRecord = { ...record, is_approved: true };
        dataProvider(UPDATE, 'comments', { id: record.id, data: updatedRecord })
            .then(() => {
-               showNotification('Comment approved');
+               dispatch(showNotification('Comment approved'));
-               push('/comments');
+               dispatch(push('/comments'));
            })
            .catch((e) => {
-               showNotification('Error: comment not approved', 'warning')
+               dispatch(showNotification('Error: comment not approved', 'warning'))
            });
    }

    render() {
        return <Button label="Approve" onClick={this.handleClick} />;
    }
}

ApproveButton.propTypes = {
+   dataProvider: PropTypes.func.isRequired,
+   dispatch: PropTypes.func.isRequired,
-   push: PropTypes.func,
    record: PropTypes.object,
-   showNotification: PropTypes.func,
};

-export default connect(null, {
-    showNotification,
-    push,
-})(ApproveButton);
+export default withDataProvider(ApproveButton)
```

## Handling Side Effects

Fetching data is called a *side effect*, since it calls the outside world, and is asynchronous. Usual actions may have other side effects, like showing a notification, or redirecting the user to another page. The `dataProvider` function injected by `withDataProvider` accepts a fourth parameter, which lets you describe the options of the query, including success and failure side effects. So the previous component can be even further simplified as follows:

```diff
// in src/comments/ApproveButton.js
import {
-  showNotification,
   UPDATE,
   withDataProvider,
} from 'react-admin';
-import { push } from 'react-router-redux';

class ApproveButton extends Component {
    handleClick = () => {
        const { dataProvider, dispatch, record } = this.props;
        const updatedRecord = { ...record, is_approved: true };
-       dataProvider(UPDATE, 'comments', { id: record.id, data: updatedRecord })
-           .then(() => {
-               dispatch(showNotification('Comment approved'));
-               dispatch(push('/comments'));
-           })
-           .catch((e) => {
-               dispatch(showNotification('Error: comment not approved', 'warning'))
-           });
-   }
+       dataProvider(UPDATE, 'comments', { id: record.id, data: updatedRecord }, {
+           onSuccess: {
+               notification: 'Comment approved',
+               redirectTo: '/comments',
+           },
+           onError: {
+               notification: { body: 'Error: comment not approved', level: 'warning' }
+           }
+       })

    render() {
        return <FlatButton label="Approve" onClick={this.handleClick} />;
    }
}

ApproveButton.propTypes = {
    dataProvider: PropTypes.func.isRequired,
-   dispatch: PropTypes.func.isRequired,
    record: PropTypes.object,
};

export default withDataProvider(ApproveButton);
```

React-admin can handle the following side effects:

- `notification`: Display a notification. The property value should be an object describing the notification to display. The `body` can be a translation key. `level` can be either `info` or `warning`.
- `redirectTo`: Redirect the user to another page. The property value should be the path to redirect the user to.
- `basePath`: This is not a side effect, but it's used internally to compute redirection paths. Set it when you have a redirection side effect.
- `refresh`: Force a rerender of the current view (equivalent to pressing the Refresh button). Set to true to enable.
- `unselectAll`: Unselect all lines in the current datagrid. Set to true to enable.
- `callback`: Execute an arbitrary function. The value should be the function to execute. React-admin will call the function with an object as parameter (`{ requestPayload, payload, error }`). The `payload` contains the decoded response body when it's successfull. When it's failed, the response body is passed in the `error`.

## Optimistic Rendering and Undo

In the previous example, after clicking on the "Approve" button, a spinner displays while the data provider is fetched. Then, users are redirected to the comments list. But in most cases, the server returns a success response, so the user waits for this response for nothing.

For its own fetch actions, react-admin uses an approach called *optimistic rendering*. The idea is to handle the calls to the `dataProvider` on the client side first (i.e. updating entities in the Redux store), and re-render the screen immediately. The user sees the effect of their action with no delay. Then, react-admin applies the success side effects, and only after that, it triggers the call to the data provider. If the fetch ends with a success, react-admin does nothing more than a refresh to grab the latest data from the server. In most cases, the user sees no difference (the data in the Redux store and the data from the data provider are the same). If the fetch fails, react-admin shows an error notification, and forces a refresh, too.

As a bonus, while the success notification is displayed, users have the ability to cancel the action *before* the data provider is even called.

You can benefit from optimistic rendering when you call the `dataProvider` prop function, too. You just need to pass the `undoable: true` option in the options parameter:

```diff
// in src/comments/ApproveButton.js
class ApproveButton extends Component {
    handleClick = () => {
        const { dataProvider, dispatch, record } = this.props;
        const updatedRecord = { ...record, is_approved: true };
        dataProvider(UPDATE, 'comments', { id: record.id, data: updatedRecord }, {
+           undoable: true,
            onSuccess: {
                notification: 'Comment approved',
                redirectTo: '/comments',
            },
            onError: {
                notification: { body: 'Error: comment not approved', level: 'warning' }
            }
        })

    render() {
        return <FlatButton label="Approve" onClick={this.handleClick} />;
    }
}
```

The fact that react-admin can handle side effects and undo a call to the API if you use `withDataProvider` should be a good motivation to prefer it to raw `fetch`.

## `<Query>` and `<Mutation>` Components

When using the `withDataProvider` decorator to fetch data from the API, you must create a stateful class component to handle the initial state, the loading state, the loaded state, and the error state. That's a lot of boilerplate for a simple query.

For such cases, react-admin provides a `<Query>` component, which uses `withDataProvider` under the hood. It leverages the render props pattern to reduce the boilerplate.

For instance, to fetch and display a user profile in a standalone component:

{% raw %}
```jsx
import { Query } from 'react-admin';

const UserProfile = ({ record }) => (
    <Query type="GET_ONE" resource="users" payload={{ id: record.id }}>
        {({ data, loading, error }) => {
            if (loading) { return <Loading />; }
            if (error) { return <p>ERROR</p>; }
            return <div>User {data.username}</div>;
        }}
    </Query>
);
```
{% endraw %}

Just like the `dataProvider` injected prop, the `<Query>` component expects three parameters: `type`, `resource`, and `payload`. It fetches the data provider on mount, and passes the data to its child component once the response from the API arrives.

The `<Query>` component is designed to read data from the API. When calling the API to update ("mutate") data, use the `<Mutation>` component instead. It passes a callback to trigger the API call to its child function. And the `<ApproveButton>` component from previous sections is a great use case for demonstrating `<Mutation>`:

```jsx
import { Mutation } from 'react-admin';

const options = {
    undoable: true,
    onSuccess: {
        notification: 'Comment approved',
        redirectTo: '/comments',
    },
    onError: {
        notification: { body: 'Error: comment not approved', level: 'warning' }
    }
};

const ApproveButton = ({ record }) => {
    const payload = { id: record.id, data: { ...record, is_approved: true } };
    return (
        <Mutation
            type="UPDATE"
            resource="comments"
            payload={payload}
            options={options}
        >
            {(approve) => (
                <FlatButton label="Approve" onClick={approve} />
            )}
        </Mutation>
    );
}

export default ApproveButton;
```

Thanks to `Query` and `Mutation`, you can use a stateless function component instead of a class component, avoid the decoration with the `withDataProvider` HOC, and write less code.

And if you need to chain API calls, don't hesitate to nest `<Query>` components!

## Using a Custom Action Creator 

In some rare cases, several components may share the same data fetching logic. In these cases, you will probably want to extract that logic into a custom Redux action. 

Warning: This is for advanced use cases only, and it requires a good level of understanding of Redux and react-admin internals. In most cases, `withDataProvider` is enough.

First, extract the request into a custom action creator. Use the dataProvider verb (`UPDATE`) as the `fetch` meta, pass the resource name as the `resource` meta, and pass the request parameters as the action `payload`:

```jsx
// in src/comment/commentActions.js
import { UPDATE } from 'react-admin';

export const COMMENT_APPROVE = 'COMMENT_APPROVE';
export const commentApprove = (id, data, basePath) => ({
    type: COMMENT_APPROVE,
    payload: { id, data: { ...data, is_approved: true } },
    meta: { fetch: UPDATE, resource: 'comments' },
});
```

Upon dispatch, this action will trigger the call to `dataProvider(UPDATE, 'comments', { id, data: { ...data, is_approved: true })`, dispatch a `COMMENT_APPROVE_LOADING` action, then after receiving the response, dispatch either a `COMMENT_APPROVE_SUCCESS`, or a `COMMENT_APPROVE_FAILURE`.

To use the new action creator in the component, `connect` it:

```jsx
// in src/comments/ApproveButton.js
import { connect } from 'react-redux';
import { commentApprove } from './commentActions';

class ApproveButton extends Component {
    handleClick = () => {
        const { commentApprove, record } = this.props;
        commentApprove(record.id, record);
        // how about push and showNotification?
    }

    render() {
        return <Button onClick={this.handleClick}>Approve</Button>;
    }
}

ApproveButton.propTypes = {
    commentApprove: PropTypes.func.isRequired,,
    record: PropTypes.object,
};

export default connect(null, { commentApprove })(ApproveButton);
```

It works fine: when a user presses the "Approve" button, the API receives the `UPDATE` call, and that approves the comment. Another added benefit of using custom actions with the `fetch` meta is that react-admin automatically handles the loading state, so you don't need to mess up with `fetchStart()` and `fetchEnd()` manually.

But it's not possible to call `push` or `showNotification` in `handleClick` anymore. This is because `commentApprove()` returns immediately, whether the API call succeeds or not. How can you run a function only when the action succeeds?

## Adding Side Effects to Actions

Just like for the `withDataProvider`, you can associate side effects to a fetch action declaratively by setting the appropriate keys in the action `meta`.

So the side effects will be declared in the action creator rather than in the component. For instance, to display a notification when the `COMMENT_APPROVE` action is successfully dispatched, add the `notification` meta:

```diff
// in src/comment/commentActions.js
import { UPDATE } from 'react-admin';
export const COMMENT_APPROVE = 'COMMENT_APPROVE';
export const commentApprove = (id, data, basePath) => ({
    type: COMMENT_APPROVE,
    payload: { id, data: { ...data, is_approved: true } },
    meta: {
        resource: 'comments',
        fetch: UPDATE,
+       onSuccess: {
+           notification: {
+               body: 'resources.comments.notification.approved_success',
+               level: 'info',
+           },
+           redirectTo: '/comments',
+           basePath,
+       },
+       onFailure: {
+           notification: {
+               body: 'resources.comments.notification.approved_failure',
+               level: 'warning',
+           },
+       },
    },
});
```

The side effects accepted in the `meta` field of the action are the same as in the fourth parameter of the `dataProvider` function injected by `withDataProvider`:

- `notification`: Display a notification. The property value should be an object describing the notification to display. The `body` can be a translation key. `level` can be either `info` or `warning`.
- `redirectTo`: Redirect the user to another page. The property value should be the path to redirect the user to.
- `refresh`: Force a rerender of the current view (equivalent to pressing the Refresh button). Set to true to enable.
- `unselectAll`: Unselect all lines in the current datagrid. Set to true to enable.
- `callback`: Execute an arbitrary function. The value should be the function to execute. React-admin will call the function with an object as parameter (`{ requestPayload, payload, error }`). The `payload` contains the decoded response body when it's successfull. When it's failed, the response body is passed in the `error`.
- `basePath`: This is not a side effect, but it's used internally to compute redirection paths. Set it when you have a redirection side effect.

## Making An Action Undoable

when using the `withDataProvider` function, you could trigger optimistic rendering and get an undo button for free. the same feature is possible using custom actions. You need to decorate the action with the `startUndoable` action creator:

```diff
// in src/comments/ApproveButton.js
+import { startUndoable as startUndoableAction } from 'ra-core';
-import { commentApprove as commentApproveAction } from './commentActions';
+import { commentApprove } from './commentActions';

class ApproveButton extends Component {
    handleClick = () => {
-       const { commentApprove, record } = this.props;
-       commentApprove(record.id, record);
+       const { startUndoable, record } = this.props;
+       startUndoable(commentApprove(record.id, record));
    }

    render() {
        return <Button onClick={this.handleClick}>Approve</Button>;
    }
}

ApproveButton.propTypes = {
-   commentApprove: PropTypes.func,
+   startUndoable: PropTypes.func,
    record: PropTypes.object,
};

export default connect(null, {
-   commentApprove: commentApproveAction,
+   startUndoable: startUndoableAction,
})(ApproveButton);
```

And that's all it takes to make a fetch action optimistic. Note that the `startUndoable` action creator is passed to Redux `connect` as `mapDispatchToProp`, to be decorated with `dispatch` - but `commentApprove` is not. Only the first action must be decorated with dispatch.

## Altering the Form Values before Submitting

Sometimes, you may want your custom action to alter the form values before actually sending them to the `dataProvider`. For those cases, you should know that every buttons inside a form [Toolbar](/CreateEdit.md#toolbar) receive two props:

- `handleSubmitWithRedirect` which calls the default form save methods
- `handleSubmit` which is the same prop as in [`react-form`](https://redux-form.com/7.4.2/docs/api/props.md/#-code-handlesubmit-eventorsubmit-function-code-)

Knowing this, you can dispatch a custom action with a button and still benefit from the default crud action side effects (notifications, optimistic ui, undo, etc.). For instance, in the `simple` example:

```jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { crudCreate, SaveButton, Toolbar } from 'react-admin';

// A custom action creator which modifies the values before calling the default crudCreate action creator
const saveWithNote = (values, basePath, redirectTo) =>
    crudCreate('posts', { ...values, average_note: 10 }, basePath, redirectTo);

class SaveWithNoteButtonView extends Component {
    handleClick = () => {
        const { basePath, handleSubmit, redirect, saveWithNote } = this.props;

        return handleSubmit(values => {
            saveWithNote(values, basePath, redirect);
        });
    };

    render() {
        const { handleSubmitWithRedirect, saveWithNote, ...props } = this.props;

        return (
            <SaveButton
                handleSubmitWithRedirect={this.handleClick}
                {...props}
            />
        );
    }
}

const SaveWithNoteButton = connect(
    undefined,
    { saveWithNote }
)(SaveWithNoteButtonView);
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
            variant="flat"
        />
    </Toolbar>
);
```

## Custom Side Effects

Sometimes, you may want to trigger other *side effects* - like closing a popup window, or sending a message to an analytics server. The easiest way to achieve this is to use the `callback` side effect:

```diff
// in src/comment/commentActions.js
import { UPDATE } from 'react-admin';
export const COMMENT_APPROVE = 'COMMENT_APPROVE';
export const commentApprove = (id, data, basePath) => ({
    type: COMMENT_APPROVE,
    payload: { id, data: { ...data, is_approved: true } },
    meta: {
        resource: 'comments',
        fetch: UPDATE,
        onSuccess: {
            notification: {
                body: 'resources.comments.notification.approved_success',
                level: 'info',
            },
            redirectTo: '/comments',
+           callback: ({ payload, requestPayload }) => { /* your own logic */ }
            basePath,
        },
        onFailure: {
            notification: {
                body: 'resources.comments.notification.approved_failure',
                level: 'warning',
            },
+           callback: ({ payload, requestPayload }) => { /* your own logic */ }
        },
    },
});
```

Under the hood, `withDataProvider` uses the `callback` side effect to provide a Promise interface for dispatching fetch actions. As chaining custom side effects will quickly lead you to callback hell, we recommend that you use the `callback` side effect sparingly.

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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bitcoinRateReceived as bitcoinRateReceivedAction } from './bitcoinRateReceived';

class BitCoinRate extends Component {
    componentWillMount() {
        fetch('https://blockchain.info/fr/ticker')
            .then(response => response.json())
            .then(rates => rates.USD['15m'])
            .then(bitcoinRateReceived) // dispatch action when the response is received
    }

    render() {
        const { rate } = this.props;
        return <div>Current bitcoin value: {rate}$</div>
    }
}

BitCoinRate.propTypes = {
    bitcoinRateReceived: PropTypes.func,
    rate: PropTypes.number,
};

const mapStateToProps = state => ({ rate: state.bitcoinRate });

export default connect(mapStateToProps, {
    bitcoinRateReceived: bitcoinRateReceivedAction,
})(BitCoinRate);
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

**Tip**: You can avoid storing data in the Redux state by storing data in a component state instead. It's much less complicated to deal with, and more performant, too. Use the global state only when you really need to.

## List Bulk Actions

Almost everything we saw before about custom actions is true for custom `List` bulk action buttons too, with the following few differences:

* Bulk action button components receive the following props: `resource`, `selectedIds` and `filterValues`
* They do not receive the current record in the `record` prop as there are many of them.

You can find a complete example of a custom Bulk Action button in the `List` documentation, in the [Bulk Action Buttons](/List.html#bulk-action-buttons) section.

## Conclusion

Which style should you choose for your own action buttons? Here is a quick benchmark:

<table>
  <thead>
    <tr>
      <th>Solution</th>
      <th>Advantages</th>
      <th>Drawbacks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code class="highlighter-rouge">fetch</code></td>
      <td><ul><li>Nothing to learn</li></ul></td>
      <td><ul><li>Requires duplication of authentication</li><li>Does not handle the loading state</li><li>Adds boilerplate</li></ul></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">dataProvider</code></td>
      <td><ul><li>Familiar API</li></ul></td>
      <td><ul><li>Does not handle the loading state</li><li>Adds boilerplate</li></ul></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">withDataProvider</code></td>
      <td><ul><li>Familiar API</li><li>Handles side effects</li></ul></td>
      <td><ul><li>Adds boilerplate</li><li>Uses HOC</li></ul></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">&lt;Query&gt;</code> and <code class="highlighter-rouge">&lt;Mutation&gt;</code></td>
      <td><ul><li>Declarative</li><li>Dense</li><li>Handles loading and error states</li><li>Handles side effects</li></ul></td>
      <td><ul><li>Mix logic and presentation in markup</li></ul></td>
    </tr>
    <tr>
      <td>Custom action</td>
      <td><ul><li>Allows logic reuse</li><li>Handles side effects</li><li>Idiomatic to Redux</li></ul></td>
      <td><ul><li>Hard to chain calls</li></ul></td>
    </tr>
  </tbody>
</table>
