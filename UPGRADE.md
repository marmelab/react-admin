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

## Injected Elements Replaced By Injected Components

Every time that you used an *element* as a prop in a react-admin component, you must now use a *component*. This basically means removing the enclosing angle brackets in props:

```diff
const PostEdit = (props) => (
-   <Edit title={<PostTitle />} actions={<EditActions />} {...props}>
+   <Edit title={PostTitle} actions={EditActions} {...props}>
```

If an element prop depended on higher props, you must use an inline component instead:

```diff
const PostEdit = ({ permissions, ...props }) => (
- <Edit actions={<EditActions permissions={permissions} />} {...props}>
+ <Edit actions={actionProps => <EditActions permissions={permissions} {...actionProps} />} {...props}>
```

We are aware that this will require many changes in existing codebases. Fortunately, it can be automated for the most part. You might find the following regular expressions useful for migrating.

The first, `{<(.+)\/>}`, searches for all element injections, for instance:

* `{<EditActions />}`
* `{<EditActions permissions={permissions} />}`

You can then use `{props => <$1{...props} />}` as the replacement pattern. The result will be:

* `{props => <EditActions {...props} />}`
* `{props => <EditActions permissions={permissions} {...props} />}`

However, in most cases you do not need an inline component, so you might want to use another replacement pattern afterwards: `{props => <(\w+) {\.\.\.props} \/>}`. It searches for simple component injections without extra props, such as `{props => <EditActions {...props} />}`, but will not match more complex cases like `{props => <EditActions permissions={permissions} {...props} />}`. You can then use `{$1}` as the replacement pattern, which will produce `{EditActions}`.

For reference, you can read the [RFC](https://github.com/marmelab/react-admin/issues/3246) about this change to understand the rationale.

## Remove optionText={function} for Input Components

Many Input components for selecting items in a list expose an `optionText` prop. This prop used to accept 3 types of values: a field name, a function, and a React element. Here is an example with `AutocompleteInput` using a function as `optionText` prop:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
<AutocompleteInput source="author_id" choices={choices} optionText={optionRenderer} />
```

However, as these Input components no longer accept element as props (but components), there is no way react-admin can distinguish simple functions from elements. Indeed, they might be functions accepting props.

So `optionText` still works, but no longer accepts a simple function - only a component.

The migration shouldn't be too hard though. To turn a function into a component, wrap it inside Fragment tags:

```diff
-const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
-<AutocompleteInput source="author_id" choices={choices} optionText={optionRenderer} />
+const Option = ({ record }) => <>{record.first_name} {record.last_name}</>;
+<AutocompleteInput source="author_id" choices={choices} optionText={Option} />
```

This change concerns the following components:

* `CheckboxGroupInput`
* `SelectArrayInput`
* `SelectInput`
* `SelectField`
* `RadioButtonGroupInput`

## Deprecated components were removed

Components deprecated in 2.X have been removed in 3.x. This includes:

* `AppBarMobile` (use `AppBar` instead, which is responsive)
* `Header` (use `Title` instead)
* `ViewTitle` (use `Title` instead)
* `RecordTitle` (use `TitleForRecord` instead)
* `TitleDeprecated` (use `Title` instead)
