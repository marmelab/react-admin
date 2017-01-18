---
layout: default
title: "Actions"
---

# Writing Actions

Admin interfaces often have to offer custom actions, beyond the simple CRUD. For instance, in an administration for comments, an "Approve" button (allowing to update the `is_approved` property and to save the updated record in one click) - is a must have.

How can you add such custom actions with admin-on-rest? The answer is twofold, and learning to do it properly will give you a better understanding of how admin-on-rest uses Redux and redux-saga.

## The Simple Way

Here is an implementation of the "Approve" button that works perfectly:

```js
// in src/comments/ApproveButton.js
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { showNotification as showNotificationAction } from 'admin-on-rest';
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

`showNotification` and `push` are *action creators*. This is a Redux term for functions that return a simple action object. However, within the component, these functions are a bit more than that: they are *connected*, i.e. they are decorated by Redux' `dispatch` method. So in the `handleClick` function, a call to `showNotification()` is actually a call to `dispatch(showNotification())`. The decoration by `dispatch` is done in the final statement, `connect()`.

This `ApproveButton` can be used right away, for instance in the list of comments, where `<Datagrid>` automatically injects the `record` to its children:

```js
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

Or, in the `<Edit>` page, as a [custom action](./CreateEdit.html#actions):

```js
// in src/comments/CommentEditActions.js
import React from 'react';
import { CardActions } from 'material-ui/Card';
import { ListButton, DeleteButton } from 'admin-on-rest/lib/mui';
import ApproveButton from './ApproveButton';

const CommentEditActions = ({ basePath, data }) => (
    <CardActions style={{ float: 'right' }}>
        <ApproveButton record={data} />
        <ListButton basePath={basePath} />
        <DeleteButton basePath={basePath} record={data} />
    </CardActions>
);

export default ReviewEditActions;

// in src/comments/index.js
import ReviewEditActions from './ReviewEditActions';

export const CommentEdit = (props) =>
    <Edit {...props} actions={<ReviewEditActions />}>
        ...
    </List>;
```

## Using The REST client Instead of Fetch

The previous code uses `fetch()`, which means it has to make raw HTTP requests. The REST logic often requires a bit of HTTP plumbing to deal with query parameters, encoding, headers, body formatting, etc. It turns out you probably already have a function that maps from a REST request to an HTTP request: the [REST Client](./RestClients.html). So it's a good idea to use this function instead of `fetch` - provided you have exported it:

```js
// in src/restClient.js
import { simpleRestClient } from 'admin-on-rest';
export default simpleRestClient('http://Mydomain.com/api/');

// in src/comments/ApproveButton.js
import { UPDATE } from 'admin-on-rest';
import restClient from '../restClient';

class ApproveButton extends Component {
    handleClick = () => {
        const { push, record, showNotification } = this.props;
        const updatedRecord = { ...record, is_approved: true };
        restClient(UPDATE, 'comments', { id: record.id, data: updatedRecord })
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

There you go: no more `fetch`. Just like `fetch`, the `restClient` returns a `Promise`. It's signature is:

```js
/**
 * Execute the REST request and return a promise for a REST response
 *
 * @example
 * restClient(GET_ONE, 'posts', { id: 123 })
 *  => new Promise(resolve => resolve({ id: 123, title: "hello, world" }))
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the action type
 * @returns {Promise} the Promise for a REST response
 */
const restClient = (type, resource, params) => new Promise();
```

As for the syntax of the various request types (`GET_LIST`, `GET_ONE`, `UPDATE`, etc.), head to the [REST Client documentation](./RestClients.html#request-format) for more details.

## Using a Custom Action Creator

Fetching data right inside the component is easy. But if you're a Redux user, you might want to do it in a more idiomatic way - by dispatching actions. First, create your own action creator to replace the call to `restClient`:

```js
// in src/comment/commentActions.js
import { UPDATE } from 'admin-on-rest';
export const COMMENT_APPROVE = 'COMMENT_APPROVE';
export const commentApprove = (id, data, basePath) => ({
    type: COMMENT_APPROVE,
    payload: { id, data: { ...data, is_approved: true } },
    meta: { resource: 'comments', fetch: UPDATE, cancelPrevious: false },
});
```

This action creator takes advantage of admin-on-rest's built in fetcher, which listens to actions with the `fetch` meta. Upon dispatch, this action will trigger the call to `restClient(UPDATE, 'comments')`, dispatch a `COMMENT_APPROVE_LOADING` action, then after receiving the response, dispatch either a `COMMENT_APPROVE_SUCCESS`, or a `COMMENT_APPROVE_FAILURE`.

To use the new action creator in the component, `connect` it:

```js
// in src/comments/ApproveButton.js
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { commentApprove as commentApproveAction } from './commentActions';

class ApproveButton extends Component {
    handleClick = () => {
        const { commentApprove, record } = this.props;
        commentApprove(record.id, record);
        // how about push and showNotification?
    }

    render() {
        return <FlatButton label="Approve" onClick={this.handleClick} />;
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

## Handling Side Effects With a Custom Saga

`fetch`, `showNotification`, and `push` are called *side effects*. It's a functional programming term that describes functions that do more than just returning a value based on their input. Admin-on-rest promotes a programming style where side effects are decoupled from the rest of the code, which has the benefit of making them testable.

In admin-on-rest, side effects are handled by Sagas. [Redux-saga](https://redux-saga.github.io/redux-saga/) is a side effect library built for Redux, where side effects are defined by generator functions. This may sound complicated, but it's not: Here is the generator function necessary to handle the side effects for the `COMMENT_APPROVE` action.

```js
// in src/comments/commentSaga.js
import { put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { showNotification } from 'admin-on-rest';

function* commentApproveSuccess() {
    yield put(showNotification('Comment approved'));
    yield put(push('/comments'));
}

function* commentApproveFailure({ error }) {
    yield put(showNotification('Error: comment not approved', 'warning'));
    console.error(error);
}

export default function* commentSaga() {
    yield [
        takeEvery('COMMENT_APPROVE_SUCCESS', commentApproveSuccess),
        takeEvery('COMMENT_APPROVE_FAILURE', commentApproveFailure),
    ];
}
```

Let's explain all of that, starting with the final `commentSaga` generator function. A [generator function](http://exploringjs.com/es6/ch_generators.html) (denoted by the `*` in the function name) gets paused on statements called by `yield` - until the yielded statement returns. `yield []` executes two commands [in parallel](https://redux-saga.github.io/redux-saga/docs/advanced/RunningTasksInParallel.html). `yield takeEvery([ACTION_NAME], callback)` executes the provided callback [every time the related action is called](https://redux-saga.github.io/redux-saga/docs/basics/UsingSagaHelpers.html). To summarize, this will execute `commentApproveSuccess` when the fetch initiated by `commentApprove()` succeeds, and `commentApproveFailure` otherwise.

As for `commentApproveSuccess` and `commentApproveFailure`, they simply dispatch (`put()`) the side effects - the same side effects as in the initial version.

To use this saga, you'll need to merge it with admin-on-rest's own saga, `crudSaga`, which takes the `restClient` as a parameter:

```js
// in src/saga.js
import { fork } from 'redux-saga/effects';
import { crudSaga } from 'admin-on-rest';
import commentSaga from './comments/commentSaga';

export default function(restClient) {
    return function*() {
        yield fork(crudSaga(restClient));
        yield fork(commentSaga);
    }
}
```

`fork()` is saga's way to execute several sagas in parallel. The next step is to inject this core saga in the `<Admin>` component:

```js
// in src/App.js
import React from 'react';

import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { CommentList } from './comments';
import saga from './saga';

const App = () => (
    <Admin saga={saga(jsonServerRestClient('http://jsonplaceholder.typicode.com'))}>
        <Resource name="comments" list={CommentList} />
    </Admin>
);

export default App;
```

**Tip**: The `Admin` component no longer needs the `restClient` prop, as it's only used for the `crudSaga` initialization.

With this code, approving a review now displays the correct notification, and redirects to the comment list. And the side effects are [testable](https://redux-saga.github.io/redux-saga/docs/introduction/BeginnerTutorial.html#making-our-code-testable), too.

## Optimistic Rendering By Using a Custom a Reducer

In this example, after clicking on the "Approve" button, users are redirected to the comments list. This page fetches the `/comments` resource to grab the list of updated comments from the server. But admin-on-rest doesn't wait for the response to this call to display the list of comments. In fact, it has an internal instance pool that is kept during navigation, and uses it to render the screen before the API calls are over - it's called *optimistic rendering*.

So it displays the list of comments, but with the non-updated record. The user will therefore briefly see a record with `is_approved` set to false, then, after the response arrives, the `is_approved` value of the updated record will switch to true.

[To be completed]

## Conclusion

Which style should you choose for your own action buttons?

The first version (with `fetch`) is perfectly fine, and if you're not into unit testing your components, or decoupling side effects from pure functions, then you can stick with it without problem.

On the other hand, if you want to promote reusability, separation of concerns, adhere to admin-on-rest's coding standards, and if you know enough Redux and Saga, use the final version.
