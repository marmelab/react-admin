---
layout: default
title: "Actions"
---

# Writing Actions

Admin interfaces often have to offer custom actions, beyond the simple CRUD. For instance, in an administration for comments, an "Approve" button (allowing to update the `is_approved` property and to save the updated record in one click) - is a must have.

How can you add such custom actions with react-admin? The answer is twofold, and learning to do it properly will give you a better understanding of how react-admin uses Redux and redux-saga.

## The Simple Way

Here is an implementation of the "Approve" button that works perfectly:

```jsx
// in src/comments/ApproveButton.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { showNotification as showNotificationAction } from 'react-admin';
import { push as pushAction } from 'react-router-redux';

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
                console.error(e);
                showNotification('Error: comment not approved', 'warning')
            });
    }

    render() {
        return <FlatButton label="Approve" onClick={this.handleClick} />;
    }
}

ApproveButton.propTypes = {
    push: PropTypes.func,
    record: PropTypes.object,
    showNotification: PropTypes.func,
};

export default connect(null, {
    showNotification: showNotificationAction,
    push: pushAction,
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
import { CardActions } from 'material-ui/Card';
import { ListButton, DeleteButton } from 'react-admin';
import ApproveButton from './ApproveButton';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const CommentEditActions = ({ basePath, data, resource }) => (
    <CardActions style={cardActionStyle}>
        <ApproveButton record={data} />
        <ListButton basePath={basePath} />
        <DeleteButton basePath={basePath} record={data} resource={resource} />
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

## Using a Data Provider Instead of Fetch

The previous code uses `fetch()`, which means it has to make raw HTTP requests. The REST logic often requires a bit of HTTP plumbing to deal with query parameters, encoding, headers, body formatting, etc. It turns out you probably already have a function that maps from a REST request to an HTTP request: the [Data Provider](./DataProviders.md). So it's a good idea to use this function instead of `fetch` - provided you have exported it:

```jsx
// in src/dataProvider.js
import jsonServerProvider from 'ra-data-json-server';
export default jsonServerProvider('http://Mydomain.com/api/');

// in src/comments/ApproveButton.js
import { UPDATE } from 'react-admin';
import dataProvider from '../dataProvider';

class ApproveButton extends Component {
    handleClick = () => {
        const { push, record, showNotification } = this.props;
        const updatedRecord = { ...record, is_approved: true };
        dataProvider(UPDATE, 'comments', { id: record.id, data: updatedRecord })
            .then(() => {
                showNotification('Comment approved');
                push('/comments');
            })
            .catch((e) => {
                console.error(e);
                showNotification('Error: comment not approved', 'warning')
            });
    }

    render() {
        return <FlatButton label="Approve" onClick={this.handleClick} />;
    }
}
```

There you go: no more `fetch`. Just like `fetch`, the `dataProvider` returns a `Promise`. It's signature is:

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

## Using a Custom Action Creator

Fetching data right inside the component is easy. But if you're a Redux user, you might want to do it in a more idiomatic way - by dispatching actions. First, create your own action creator to replace the call to `dataProvider`:

```jsx
// in src/comment/commentActions.js
import { UPDATE } from 'react-admin';
export const COMMENT_APPROVE = 'COMMENT_APPROVE';
export const commentApprove = (id, data, basePath) => ({
    type: COMMENT_APPROVE,
    payload: { id, data: { ...data, is_approved: true } },
    meta: { resource: 'comments', fetch: UPDATE },
});
```

This action creator takes advantage of react-admin's built in fetcher, which listens to actions with the `fetch` meta. Upon dispatch, this action will trigger the call to `dataProvider(UPDATE, 'comments')`, dispatch a `COMMENT_APPROVE_LOADING` action, then after receiving the response, dispatch either a `COMMENT_APPROVE_SUCCESS`, or a `COMMENT_APPROVE_FAILURE`.

To use the new action creator in the component, `connect` it:

```jsx
// in src/comments/ApproveButton.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import { commentApprove as commentApproveAction } from './commentActions';

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
    commentApprove: PropTypes.func,
    record: PropTypes.object,
};

export default connect(null, {
    commentApprove: commentApproveAction,
})(ApproveButton);
```

This works fine: when a user presses the "Approve" button, the API receives the `UPDATE` call, and that approves the comment. But it's not possible to call `push` or `showNotification` in `handleClick` anymore. This is because `commentApprove()` returns immediately, whether the API call succeeds or not. How can you run a function only when the action succeeds?

## Handling Side Effects

Fetching data is called a *side effect*, since it calls the outside world, and is asynchronous. Usual actions may have other side effects, like showing a notification, or redirecting the user to another page. Just like for the `fetch` side effect, you can associate side effects to an action declaratively by setting the appropriate keys in the action `meta`. 

For instance, to display a notification when the `COMMENT_APPROVE` action is dispatched, add the `notification` meta:

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
+        notification: {
+            body: 'resources.comments.notification.approved_success',
+            level: 'info',
+        },
+        redirectTo: '/comments',
+        basePath,
    },
});
```

React-admin can handle the following side effects metas:

- `notification`: Display a notification. The property value should be an object describing the notification to display. The `body` can be a translation key. `level` can be either `info` or `warning`.
- `redirectTo`: Redirect the user to another page. The property value should be the path to redirect the user to.
- `refresh`: Force a rerender of the current view (equivalent to pressing the Refresh button). Set to true to enable.
- `unselectAll`: Unselect all lines in the current datagrid. Set to true to enable.
- `basePath`: This is not a side effect, but it's used internaly to compute redirection paths. Set it when you have a redirection side effect.

## Success and Failure Side Effects

In the previous example, the "notification approved" notification appears when the `COMMENT_APPROVE` action is dispatched, i.e. *before* the server is even called. That's a bit too early: what if the server returns an error?

In practice, most side effects must be triggered after the `fetch` side effect succeeds or fails. To support that, you can enclose side effects under the `onSuccess` and `onFailure` keys in the `meta` property of an action:

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
-        notification: {
-            body: 'resources.comments.notification.approved_success',
-            level: 'info',
-        },
-        redirectTo: '/comments',
-        basePath,
+        onSuccess: {
+            notification: {
+                body: 'resources.comments.notification.approved_success',
+                level: 'info',
+            },
+            redirectTo: '/comments',
+            basePath,
+        },
    },
});
```

In this case, no side effect is triggered when the `COMMENT_APPROVE` action is dispatched. However, when the `fetch` side effects returns successfully, react-admin dispatches a `COMMENT_APPROVE_SUCCESS` action, and copies the `onSuccess` side effects into the `meta` property. So it will dispatch an action looking like:

```js
{
    type: COMMENT_APPROVE_SUCCESS,
    payload: { data: { /* data returned by the server */ } },
    meta: {
        resource: 'comments',
        notification: {
            body: 'resources.comments.notification.approved_success',
            level: 'info',
        },
        redirectTo: '/comments',
        basePath,
    },
}
```

And then, the side effects will trigger. With this code, approving a review now displays the correct notification, and redirects to the comment list.

You can use `onSuccess` and `onFailure` metas in your own actions to handle side effects.

## Custom sagas

Sometimes, you may want to trigger other *side effects*. React-admin promotes a programming style where side effects are decoupled from the rest of the code, which has the benefit of making them testable.

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

## Bonus: Optimistic Rendering

In this example, after clicking on the "Approve" button, users are redirected to the comments list. React-admin then fetches the `/comments` resource to grab the list of updated comments from the server. But react-admin doesn't wait for the response to this call to display the list of comments. In fact, it has an internal instance pool (in `state.admin.resources[resource]`) that is kept during navigation, and uses it to render the screen before the API calls are over - it's called *optimistic rendering*.

As the custom `COMMENT_APPROVE` action contains the `fetch: UPDATE` meta, react-admin will automatically update its instance pool with the response. That means that the initial rendering (before the `GET /comments` response arrives) will show the approved comment!

The fact that react-admin updates the instance pool if you use custom actions with the `fetch` meta should be another motivation to avoid using raw `fetch`.

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

Almost everything we saw before is true for custom `List` bulk actions too, with the following few differences:

* They receive the following props: `resource`, `selectedIds` and `filterValues`
* They do not receive the current record in the `record` prop as there are many of them.
* They must render as a material-ui [`MenuItem`](http://www.material-ui.com/#/components/menu).

You can find a complete example in the `List` documentation, in the [`bulk-actions`](/List.html#bulk-actions) section.

## Conclusion

Which style should you choose for your own action buttons?

The first version (with `fetch`) is perfectly fine, and if you're not into unit testing your components, or decoupling side effects from pure functions, then you can stick with it without problem.

On the other hand, if you want to promote reusability, separation of concerns, adhere to react-admin's coding standards, and if you know enough Redux and Saga, use the final version.
