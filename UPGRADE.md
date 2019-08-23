# Upgrade to 3.0

## Increased version requirement for key dependencies

* `react` and `react-dom` are now required to be >= 16.8. This version is backward compatible with 16.3, which was the minimum requirement in react-admin, but it offers the support for Hooks.
* `react-redux` requires a minimum version of 7.1.0 (instead of 5.0). Check their upgrade guide for [6.0](https://github.com/reduxjs/react-redux/releases/tag/v6.0.0) and [7.0](https://github.com/reduxjs/react-redux/releases/tag/v7.0.0)
* `redux-form` requires a minimum version of 8.2 (instead of 7.4). Check their [Upgrade guide](https://github.com/erikras/redux-form/releases/tag/v8.0.0).
* `material-ui` requires a minimum of 4.0.0 (instead of 1.5). Check their [Upgrade guide](https://next.material-ui.com/guides/migration-v3/).

## `react-router-redux` replaced by `connected-react-router`

We've replaced the `react-router-redux` package, which was deprecated and not compatible with the latest version of react-redux, by an equivalent package named `connected-react-router`. As they share the same API, you can just change the `import` statement and it should work fine.

```diff
-import { push } from 'react-router-redux';
+import { push } from 'connected-react-router';

-import { LOCATION_CHANGE } from 'react-router-redux';
+import { LOCATION_CHANGE } from 'connected-react-router';
```

It's a bit more work if you're using a Custom App, as the initialization of `connected-react-router` requires one more step than `react-router-redux`.

If you create a custom reducer, here is how to update your `createAdminStore` file:

```diff
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
-import { routerMiddleware, routerReducer } from 'react-router-redux';
+import { routerMiddleware, connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

...

export default ({
    authProvider,
    dataProvider,
    i18nProvider = defaultI18nProvider,
    history,
    locale = 'en',
}) => {
    const reducer = combineReducers({
        admin: adminReducer,
        i18n: i18nReducer(locale, i18nProvider(locale)),
        form: formReducer,
-       router: routerReducer,
+       router: connectRouter(history),
        { /* add your own reducers here */ },
    });

...
```

The syntax of the `routerMiddleware` doesn't change.

And if you don't use the `<Admin>` component, change the package for `ConnectedRouter`:

```diff
import React from 'react';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
-import { ConnectedRouter } from 'react-router-redux';
+import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import withContext from 'recompose/withContext';
...
```

## Resource context renamed to Resource intent

If you're using a Custom App, you had to render Resource components with the registration *context* prior to rendering your app routes. The `context` prop was renamed to `intent` because it conflicted with a prop injected by react-redux.

```diff
-               <Resource name="posts" context="registration" />
+               <Resource name="posts" intent="registration" />
-               <Resource name="comments" context="registration" />
+               <Resource name="comments" intent="registration" />
-               <Resource name="users" context="registration" />
+               <Resource name="users" intent="registration" />
```

## ReferenceField prop `linkType` renamed to `link`

When using the ReferenceField component, you should rename your `linkType` props to `link`. This prop now also accepts custom functions to return a link, see the Fields documentation.

```diff
- <ReferenceField resource="comments" record={data[id]} source="post_id" reference="posts" basePath={basePath} linkType="show">
+ <ReferenceField resource="comments" record={data[id]} source="post_id" reference="posts" basePath={basePath} link="show">
```


## `withDataProvider` no longer injects `dispatch`

The `withDataProvider` HOC used to inject two props: `dataProvider`, and redux' `dispatch`. This last prop is now easy to get via the `useDispatch` hook from Redux, so `withDataProvider` no longer injects it.

```diff
import {
   showNotification,
   UPDATE,
   withDataProvider,
} from 'react-admin';
+ import { useDispatch } from 'react-redux';

-const ApproveButton = ({ dataProvider, dispatch, record }) => {
+const ApproveButton = ({ dataProvider, record }) => {
+   const dispatch = withDispatch();
    const handleClick = () => {
        const updatedRecord = { ...record, is_approved: true };
        dataProvider(UPDATE, 'comments', { id: record.id, data: updatedRecord })
            .then(() => {
                dispatch(showNotification('Comment approved'));
                dispatch(push('/comments'));
            })
            .catch((e) => {
                dispatch(showNotification('Error: comment not approved', 'warning'))
            });
    }

    return <Button label="Approve" onClick={handleClick} />;
}

export default withDataProvider(ApproveButton);
```

## `<CardActions>` renamed to `<TopToolbar>`

The `<CardActions>` component, which used to wrap the action buttons in the `Edit`, `Show` and `Create` views, is now named `<TopToolbar>`. That's because actions aren't located inside the `Card` anymore, but above it.

```diff
import Button from '@material-ui/core/Button';
-import { CardActions, ShowButton } from 'react-admin';
+import { TopToolbar, ShowButton } from 'react-admin';

const PostEditActions = ({ basePath, data, resource }) => (
-   <CardActions>
+   <TopToolbar>
        <ShowButton basePath={basePath} record={data} />
        {/* Add your custom actions */}
        <Button color="primary" onClick={customAction}>Custom Action</Button>
-   </CardActions>
+   </TopToolbar>
);

export const PostEdit = (props) => (
    <Edit actions={<PostEditActions />} {...props}>
        ...
    </Edit>
);
```

But watch out, you can't just replace "CardActions" by "TopToolbar" in your entire codebase, because you probably also use Material-ui's `<CardActions>`, and that component still exists. The fact that react-admin exported a component with the same name but with a different look and feel than the material-iu component was also a motivation to rename it.

## `<Admin appLayout` prop renamed to `<Admin layout`

You can inject a layout component in the `<Admin>` component to override the default layout. However, this injection used a counterintuitive prop name: `appLayout`. It has been renamed to the more natural `layout`.

You will only have to change your code if you used a custom layout:

```diff
const App = () => (
-   <Admin appLayout={MyLayout}>
+   <Admin layout={MyLayout}>
        <Resource name="posts" list={PostList} edit={PostEdit} />
    </Admin>
);
```

## Deprecated components were removed

Components deprecated in 2.X have been removed in 3.x. This includes:

* `AppBarMobile` (use `AppBar` instead, which is responsive)
* `Header` (use `Title` instead)
* `ViewTitle` (use `Title` instead)
* `RecordTitle` (use `TitleForRecord` instead)
* `TitleDeprecated` (use `Title` instead)
* `LongTextInput` (use the `TextInput` instead)

```diff
- import { LongTextInput } from 'react-admin';
- <LongTextInput source="body" />
+ import { TextInput } from 'react-admin';
+ <TextInput multiline source="body" />
```

* `BulkActions` (use the [`bulkActionButtons` prop](https://marmelab.com/react-admin/List.html#bulk-action-buttons) instead)

```diff
- const PostBulkActions = props => (
-     <BulkActions {...props}>
-         <CustomBulkMenuItem />
-         {/* Add the default bulk delete action */}
-         <BulkDeleteMenuItem />
-     </BulkActions>
- );
+ const PostBulkActionButtons = props => (
+     <Fragment>
+         <ResetViewsButton label="Reset Views" {...props} />
+         {/* Add the default bulk delete action */}
+         <BulkDeleteButton {...props} />
+     </Fragment>
+ );

export const PostList = (props) => (
    <List 
        {...props} 
-       bulkActions={<PostBulkActions />}
+       bulkActionButtons={<PostBulkActionButtons />}>
        ...
    </List>
);
```

## Some components were removed

* `Disablednput`: see [RFC 3518](https://github.com/marmelab/react-admin/issues/3518).

You can replace it with a disabled or readonly `TextInput`. For example, the `disabled` prop:

```diff
-import { DisabledInput } from 'react-admin';
+import { TextInput } from 'react-admin';

-<DisabledInput source="id" />
+<TextInput source="id" disabled />
```

See material-ui [`TextField` documentation](https://material-ui.com/components/text-fields/#textfield) for available options.

## Replace papaparse with a lighter library

React-admin used to bundle the `papaparse` library for converting JSON to CSV. But 90% of the `papaparse` code is used to convert CSV to JSON. 

We decided to replace it by a lighter library: [jsonexport](https://github.com/kauegimenes/jsonexport).

If you had custom exporter on `List` components, here's how to migrate:

```diff
-import { unparse as convertToCSV } from 'papaparse/papaparse.min';
+import jsonExport from 'jsonexport/dist';

-const csv = convertToCSV({
-    data: postsForExport,
-    fields: ['id', 'title', 'author_name', 'body']
-});
-downloadCSV(csv, 'posts');
+jsonExport(postsForExport, {
+    headers: ['id', 'title', 'author_name', 'body']
+}, (err, csv) => {
+    downloadCSV(csv, 'posts');
+});
```

## Customizing the SideBar size is done through theme

The `<SideBar>` component used to accept `size` and `closedSize` prop to control its width.

You can now customize those values by providing a custom material-ui theme.

```jsx
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    sidebar: {
        width: 300, // The default value is 240
        closedWidth: 70, // The default value is 55
    },
});

const App = () => (
    <Admin theme={theme} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## Validators Should Return Non-Translated Messages

Form validators used to return translated error messages - that's why they received the field `props` as argument, including the `translate` function. They don't receive these props anymore, and they must return unstranslated messages instead - react-admin translates validation messages afterwards.

```diff
// in validators/required.js
-const required = () => (value, allValues, props) =>
+const required = () => (value, allValues) =>
    value
        ? undefined
-       : props.translate('myroot.validation.required');
+       : 'myroot.validation.required';
```

In case the error message depends on a variable, you can return an object `{ message, args }` instead of a message string:

```diff
-const minLength = (min) => (value, allValues, props) => 
+const minLength = (min) => (value, allValues) => 
    value.length >= min
        ? undefined
-       : props.translate('myroot.validation.minLength', { min });
+       : { message: 'myroot.validation.minLength', args: { min } };
```

React-admin core validators have been modified so you don't have to change anything when using them.

```jsx
import {
    required,
    minLength,
    maxLength,
    minValue,
    number,
    email,
} from 'react-admin';

// no change vs 2.x
const validateFirstName = [required(), minLength(2), maxLength(15)];
const validateEmail = email();
const validateAge = [number(), minValue(18)];

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput label="First Name" source="firstName" validate={validateFirstName} />
            <TextInput label="Email" source="email" validate={validateEmail} />
            <TextInput label="Age" source="age" validate={validateAge}/>
        </SimpleForm>
    </Create>
);
```

## `authProvider` No Longer Uses Legacy React Context

When you provide an `authProvider` to the `<Admin>` component, react-admin creates a context to make it available everywhere in the application. In version 2.x, this used the [legacy React context API](https://reactjs.org/docs/legacy-context.html). In 3.0, this uses the normal context API. That means that any context consumer will need to use the new context API.

```diff
-import React from 'react';
+import React, { useContext } from 'react';
+import { AuthContext } from 'react-admin';

-const MyComponentWithAuthProvider = (props, context) => {
+const MyComponentWithAuthProvider = (props) => {
+   const authProvider = useContext(AuthContext);
    authProvider('AUTH_CHECK');
    return <div>I'm authenticated</div>;
}

-MyComponentWithAuthProvider.contextTypes = { authProvider: PropTypes.object }
```

If you didn't access the `authProvider` context manually, you have nothing to change. All react-admin components have been updated to use the new context API.

Note that direct access to the `authProvider` from the context is discouraged (and not documented). If you need to interact with the `authProvider`, use the new `useAuth()` and `usePermissions()` hooks, or the auth-related action creators (`userLogin`, `userLogout`, `userCheck`).

## `authProvider` No Longer Receives `match` in Params

Whenever it called the `authProvider`, react-admin used to pass both the `location` and the `match` object from react-router. In v3, the `match` object is no longer passed as argument. There is no legitimate usage of this parameter we can think about, and it forced passing down that object across several components for nothing, so it's been removed. Upgrade your `authProvider` to remove that param.

```diff
// in src/authProvider
export default (type, params) => {
-   const { location, match } = params;
+   const { location } = params;
    // ...
}
```

## ReferenceInputController isLoading injected props renamed to loading

When using custom component with ReferenceInputController, you should rename the component `isLoading` prop to `loading`.

```diff
- <ReferenceInputController {...props}>
-     {({ isLoading, otherProps }) => (
-         <CustomReferenceInputView
-             {...otherProps}
-             isLoading={isLoading}
-         />
-     )}
- </ReferenceInputController>
+ <ReferenceInputController {...props}>
+     {({ loading, otherProps }) => (
+         <CustomReferenceInputView
+             {...otherProps}
+             loading={loading}
+         />
+     )}
+ </ReferenceInputController>
```

## `loadedOnce` prop renamed as `loaded`

The `List`, `ReferenceArrayfield` and `ReferenceManyField` used to inject an `loadedOnce` prop to their child. This prop has been renamed to `loaded`.

As a consequence, the components usually used as children of these 3 components now accept a `loaded` prop instead of `loadedOnce`. This concerns `Datagrid`, `SingleFieldList`, and `GridList`.

This change is transparent unless you use a custom view component inside a `List`, `ReferenceArrayfield` or `ReferenceManyField`.

```diff
const PostList = props => (
    <List {...props}>
        <MyListView />
    </List>
)

-const MyListView = ({ loadedOnce, ...props }) => (
+const MyListView = ({ loaded, ...props }) => (
-   if (!loadedOnce) return null;
+   if (!loaded) return null;
    // rest of the view
);
```

## New DataProviderContext Requires Custom App Modification

The new dataProvider-related hooks (`useQuery`, `useMutation`, `useDataProvider`, etc.) grab the `dataProvider` instance from a new React context. If you use the `<Admin>` component, your app will continue to work and there is nothing to do, as `<Admin>` now provides that context. But if you use a Custom App, you'll need to set the value of that new `DataProvider` context:

```diff
-import { TranslationProvider, Resource } from 'react-admin';
+import { TranslationProvider, DataProviderContext, Resource } from 'react-admin';

const App = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
            i18nProvider,
            history,
        })}
    >
        <TranslationProvider>
+           <DataProviderContext.Provider valuse={dataProvider} />
                <ThemeProvider>
                    <Resource name="posts" intent="registration" />
                    ...
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Typography variant="h6" color="inherit">
                                My admin
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <ConnectedRouter history={history}>
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route exact path="/posts" hasCreate render={(routeProps) => <PostList resource="posts" {...routeProps} />} />
                            <Route exact path="/posts/create" render={(routeProps) => <PostCreate resource="posts" {...routeProps} />} />
                            <Route exact path="/posts/:id" hasShow render={(routeProps) => <PostEdit resource="posts" {...routeProps} />} />
                            <Route exact path="/posts/:id/show" hasEdit render={(routeProps) => <PostShow resource="posts" {...routeProps} />} />
                            ...
                        </Switch>
                    </ConnectedRouter>
                </ThemeProvider>
+           </DataProviderContext.Provider>
        </TranslationProvider>
    </Provider>
);
```

Note that if you were unit testing controller components, you'll probably need to add a mock `dataProvider` via `<DataProviderContext>` in your tests, too.

## Custom Notification Must Emit UndoEvents

The undo feature is partially implemented in the `Notification` component. If you've overridden that component, you'll have to add a call to `undoableEventEmitter` in case of confirmation and undo:

```diff
// in src/MyNotification.js
import {
    hideNotification,
    getNotification,
    translate,
    undo,
    complete,
+   undoableEventEmitter,
} from 'ra-core';

class Notification extends React.Component {
    state = {
        open: false,
    };
    componentWillMount = () => {
        this.setOpenState(this.props);
    };
    componentWillReceiveProps = nextProps => {
        this.setOpenState(nextProps);
    };

    setOpenState = ({ notification }) => {
        this.setState({
            open: !!notification,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    handleExited = () => {
        const { notification, hideNotification, complete } = this.props;
        if (notification && notification.undoable) {
            complete();
+           undoableEventEmitter.emit('end', { isUndo: false });
        }
        hideNotification();
    };

    handleUndo = () => {
        const { undo } = this.props;
        undo();
+       undoableEventEmitter.emit('end', { isUndo: true });
    };

    render() {
        const {
            undo,
            complete,
            classes,
            className,
            type,
            translate,
            notification,
            autoHideDuration,
            hideNotification,
            ...rest
        } = this.props;
        const {
            warning,
            confirm,
            undo: undoClass, // Rename classes.undo to undoClass in this scope to avoid name conflicts
            ...snackbarClasses
        } = classes;
        return (
            <Snackbar
                open={this.state.open}
                message={
                    notification &&
                    notification.message &&
                    translate(notification.message, notification.messageArgs)
                }
                autoHideDuration={
                    (notification && notification.autoHideDuration) ||
                    autoHideDuration
                }
                disableWindowBlurListener={
                    notification && notification.undoable
                }
                onExited={this.handleExited}
                onClose={this.handleRequestClose}
                ContentProps={{
                    className: classnames(
                        classes[(notification && notification.type) || type],
                        className
                    ),
                }}
                action={
                    notification && notification.undoable ? (
                        <Button
                            color="primary"
                            className={undoClass}
                            size="small"
-                           onClick={undo}
+                           onClick={this.handleUndo}
                        >
                            {translate('ra.action.undo')}
                        </Button>
                    ) : null
                }
                classes={snackbarClasses}
                {...rest}
            />
        );
    }
}
```

## Migration to react-final-form Requires Custom App Modification

We used to implement some black magic in `formMiddleware` to handle `redux-form` correctly.
It is no longer necessary now that we migrated to `react-final-form`.
Besides, `redux-form` required a reducer which is no longer needed as well.

If you had your own custom redux store, you can migrate it by following this diff:

```diff
// in src/createAdminStore.js
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
-import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import {
    adminReducer,
    adminSaga,
    createAppReducer,
    defaultI18nProvider,
    i18nReducer,
-    formMiddleware,
    USER_LOGOUT,
} from 'react-admin';

export default ({
    authProvider,
    dataProvider,
    i18nProvider = defaultI18nProvider,
    history,
    locale = 'en',
}) => {
    const reducer = combineReducers({
        admin: adminReducer,
        i18n: i18nReducer(locale, i18nProvider(locale)),
-        form: formReducer,
        router: connectRouter(history),
        { /* add your own reducers here */ },
    });
    const resettableAppReducer = (state, action) =>
        reducer(action.type !== USER_LOGOUT ? state : undefined, action);

    const saga = function* rootSaga() {
        yield all(
            [
                adminSaga(dataProvider, authProvider, i18nProvider),
                // add your own sagas here
            ].map(fork)
        );
    };
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        resettableAppReducer,
        { /* set your initial state here */ },
        compose(
            applyMiddleware(
                sagaMiddleware,
-                formMiddleware,
                routerMiddleware(history),
                // add your own middlewares here
            ),
            typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
                ? window.__REDUX_DEVTOOLS_EXTENSION__()
                : f => f
            // add your own enhancers here
        )
    );
    sagaMiddleware.run(saga);
    return store;
};
```

## Migration to react-final-form Requires Changes to Custom Toolbar or Buttons

In `react-admin` v2, the toolbar and its buttons used to receive `handleSubmit` and `handleSubmitWithRedirect` props.
Those props accepted functions which were called with the form values.

The migration to `react-final-form` change their signatures and behaviors to the following:

- `handleSubmit`: accepts no arguments and will submit the form with its current values immediately
- `handleSubmitWithRedirect` accept a custom redirect and will submit the form with its current values immediately

If you were using custom buttons (to alter the form values before submit for example), you'll need to update your code.
Here's how to migrate the *Altering the Form Values before Submitting* example from the documentation, in two variants:

1. Using react-final-form API to send change events

```jsx
import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { SaveButton, Toolbar, useCreate, useRedirect, useNotify } from 'react-admin';

const SaveWithNoteButton = ({ handleSubmit, handleSubmitWithRedirect, ...props }) => {
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

## Migration to react-final-form Requires Changes for Linked Inputs

In `react-admin` v2, one could link two inputs using the `FormDataConsumer` component and use the `dispatch` function passed to the render prop function to trigger form changes.

The migration to `react-final-form` changes this render prop signature a little as it will no longer receive a `dispatch` function.
However, it's possible to use the `useForm` hook from `react-final-form` to achieve the same behavior:

```diff
import React, { Fragment } from 'react';
-import { change } from 'redux-form';
+import { useForm } from 'react-final-form';
import { FormDataConsumer, REDUX_FORM_NAME } from 'react-admin';

+const OrderOrigin = ({ formData, ...rest }) => {
+    const form = useForm();
+
+    return (
+        <Fragment>
+            <SelectInput
+                source="country"
+                choices={countries}
+                onChange={value => form.change('city', null)}
+                {...rest}
+            />
+            <SelectInput
+                source="city"
+                choices={getCitiesFor(formData.country)}
+                {...rest}
+            />
+        </Fragment>
+    );
+};

const OrderEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <FormDataConsumer>
-                {({ formData, dispatch, ...rest }) => (
-                    <Fragment>
-                        <SelectInput
-                            source="country"
-                            choices={countries}
-                            onChange={value => dispatch(
-                                change(REDUX_FORM_NAME, 'city', null)
-                            )}
-                             {...rest}
-                        />
-                        <SelectInput
-                            source="city"
-                            choices={getCitiesFor(formData.country)}
-                             {...rest}
-                        />
-                    </Fragment>
-                )}
+                {formDataProps => {
+                    <OrderOrigin {...formDataProps} />
+                }}
            </FormDataConsumer>
        </SimpleForm>
    </Edit>
);
```