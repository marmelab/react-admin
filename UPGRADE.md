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
