# Upgrade to 2.0

- [Admin-on-rest Renamed to React-Admin](#admin-on-rest-renamed-to-react-admin)
- [`restClient` Prop Renamed To `dataProvider` in `<Admin>` Component](#restclient-prop-renamed-to-dataprovider-in-admin-component)
- [Default REST Clients Moved to Standalone Packages](#default-rest-clients-moved-to-standalone-packages)
- [`authClient` Prop Renamed To `authProvider` in `<Admin>` Component](#authclient-prop-renamed-to-authprovider-in-admin-component)
- [Default (English) Messages Moved To Standalone Package](#default-english-messages-moved-to-standalone-package)
- [Message Hash Main Key Changed ("aor" => "ra")](#message-hash-main-key-changed-aor--ra)
- [Removed the Delete view in Resource](#removed-the-delete-view-in-resources)
- [Replaced `messages` by `i18nProvider` in `<Admin>`](#replaced-messages-by-i18nprovider-in-admin)
- [`crudSaga` renamed to `adminSaga`](#crudsaga-renamed-to-adminsaga)
- [`<AutocompleteInput>` no longer accepts a `filter` prop](#autocompleteinput-no-longer-accepts-a-filter-prop)
- [`<Datagrid>` No Longer Accepts `options`, `headerOptions`, `bodyOptions`, and `rowOptions` props](#datagrid-no-longer-accepts-options-headeroptions-bodyoptions-and-rowoptions-props)
- [`<DateInput>` Stores a Date String Instead Of a Date Object](#dateinput-stores-a-date-string-instead-of-a-date-object)
- [Removed `<DateInput>` `options` props](#removed-dateinput-options-props)
- [`<SelectArrayInput>` does not support autocompletion anymore.](#selectarrayinput-does-not-support-autocompletion-anymore)
- [CSS Classes Changed](#css-classes-changed)
- [`addField` Prop Replaced By `addField` HOC](#addfield-prop-replaced-by-addfield-hoc)
- [No More `refresh` Prop Passed To `<List>` Actions](#no-more-refresh-prop-passed-to-list-actions)
- [Customizing styles](#customizing-styles)
- [Authentication: `<Restricted>` renamed to `<Authenticated>`](#authentication-restricted-renamed-to-authenticated)
- [Authorization: `<WithPermission>` and `<SwitchPermissions>` replaced by `<WithPermissions>`](#authorization-withpermission-and-switchpermissions-replaced-by-withpermissions)
- [Custom Layouts](#custom-layouts)
- [Menu `onMenuTap` prop has been renamed `onMenuClick`](#menu-onmenutap-prop-has-been-renamed-onmenuclick)
- [Logout is now displayed in the AppBar on desktop](#logout-is-now-displayed-in-the-appbar-on-desktop)
- [Data providers should support two more types for bulk actions](#data-providers-should-support-two-more-types-for-bulk-actions)
- [react-admin addon packages renamed with ra prefix and moved into root repository](#react-admin-addon-packages-renamed-with-ra-prefix-and-moved-into-root-repository)
- [The require,number and email validators should be renamed to require(),number() and validation()](#validators-should-be-initialized)

## Admin-on-rest Renamed to React-Admin

We've chosen to remove term REST from the project name, to emphasize the fact that it can adapt to any type of backend - including GraphQL.

So the main package name has changed from `admin-on-rest` to `react-admin`. You must update your dependencies:

```sh
npm uninstall admin-on-rest
npm install react-admin
```

As well as all your files depending on the 'admin-on-rest' package:

```diff
- import { BooleanField, NumberField, Show } from 'admin-on-rest'; 
+ import { BooleanField, NumberField, Show } from 'react-admin'; 
```

A global search and replace on the string "admin-on-rest" should do the trick in no time.

## `restClient` Prop Renamed To `dataProvider` in `<Admin>` Component

In the `<Admin>` component, the `restClient` prop is now called `dataProvider`:

```diff
import restClient from './restClient';
- <Admin restClient={restClient}>
+ <Admin dataProvider={restClient}>
   ...
</Admin>
```

The signature of the Data Provider function is the same as the REST client function, so you shouldn't need to change anything in your previous REST client function.

Once again, this change de-emphasizes the "REST" term in admin-on-rest.

## Default REST Clients Moved to Standalone Packages

`simpleRestClient` and `jsonServerRestClient` are no longer part of the core package. They have been moved to standalone packages, where they are the default export:

* `simpleRestClient` => `ra-data-simple-rest`
* `jsonServerRestClient` => `ra-data-json-server`

Update your `import` statements accordingly:

```diff
- import { simpleRestClient } from 'admin-on-rest';
+ import simpleRestClient from 'ra-data-simple-rest';

- import { jsonServerRestClient } from 'admin-on-rest';
+ import jsonServerRestClient from 'ra-data-json-server';
```

## `authClient` Prop Renamed To `authProvider` in `<Admin>` Component

In the `<Admin>` component, the `authClient` prop is now called `authProvider`:

```diff
- import authClient from './authClient';
+ import authProvider from './authProvider';
- <Admin authClient={authClient}>
+ <Admin authProvider={authProvider}>
   ...
</Admin>
```

The signature of the authorizations provider function is the same as the authorizations client function, so you shouldn't need to change anything in your previous authorizations client function.

## Default (English) Messages Moved To Standalone Package

The English messages have moved to another package, `ra-language-english`. The core package still displays the interface messages in English by default (by using `ra-language-english` as a dependency), but if you overrode some of the messages, you'll need to update the package name:

```diff
- import { enMessages } from 'admin-on-rest';
+ import enMessages from 'ra-language-english';
const messages = { 'en': enMessages };
```

## Message Hash Main Key Changed ("aor" => "ra")

The main key of translation message objects was renamed from "aor" ro "ra". You must update your custom messages accordingly if you overrode core interface messages. If you're a language package author, you must also update and  republish your package to have it work with react-admin 2.0.

```diff
module.exports = {
-    aor: {
+    ra: {
        action: {
            delete: 'Delete',
            show: 'Show',
            ...
```

## Removed the Delete view in Resource

Admin-on-rest used to have a special Delete view, accessible with a special URL, to display a confirmation message after a user clicked on the Delete button. This view added complexity to the early stages of development with admin-on-rest. Besides, it provided a mediocre user experience.

In react-admin, the deletion confirmation is now a Dialog that opens on top of the page where the user currently is.

As a consequence, you no longer need to pass a value to the `remove` prop in Resources:

```diff
-  <Resource name="posts" list={PostList} edit={PostEdit} show={PostShow} remove={Delete} />
+  <Resource name="posts" list={PostList} edit={PostEdit} show={PostShow} />
```

That also means that if you disabled deletion on a Resource by not passing a `remove` prop, you will be surprised by Delete buttons popping in the Edit views. The way to remove this button is to [Customize the Edit Toolbar](https://marmelab.com/react-admin/CreateEdit.html#actions).

## Replaced `messages` by `i18nProvider` in `<Admin>`

In admin-on-rest, localization messages were passed as an object literal in the `messages` props of the `<Admin>` component. To do the same in react-admin, you must now use a slightly more lengthy syntax, and pass a function in the `i18nProvider` prop instead.

```diff
- import { Admin, enMessages } from 'admin-on-rest';
- import frMessages from 'aor-language-french';
+ import { Admin } from 'react-admin';
+ import enMessages from 'ra-language-english';
+ import frMessages from 'ra-language-french';

const messages = {
    en: enMessages,
    fr: frMessages,
};

- const App = () => <Admin locale="en" messages={messages} />;
+ const i18nProvider = locale => messages[locale];
+ const App = () => <Admin locale="en" i18nProvider={i18nProvider} />;
```

The new `i18nProvider` allows to load the messages asynchronously - see [the `i18nProvider` documentation](./Translation.md#i18nProvider) for details.

## `crudSaga` renamed to `adminSaga`

If you don't use the `<Admin>` component, but prefer to implement your administration inside another root component, you probably followed the Custom App documentation, and used the `crudSaga`. This property was renamed to `adminSaga`

```diff
// in src/App.js
- import { crudSaga, ... } from 'admin-on-rest';
+ import { adminSaga, ... } from 'react-admin';

// ...
- sagaMiddleware.run(crudSaga(dataProvider, i18nProvider));
+ sagaMiddleware.run(adminSaga(dataProvider, i18nProvider));
```

## `<AutocompleteInput>` no longer accepts a `filter` prop

Material-ui's implementation of the autocomplete input has radically changed. React-admin maintains backwards compatibility, except for the `filter` prop, which no longer makes sense in the new impementation.

## `<Datagrid>` No Longer Accepts `options`, `headerOptions`, `bodyOptions`, and `rowOptions` props

Material-ui's implementation of the `<Table>` component has reduced dramatically. Therefore, all the advanced features of the datagrid are no longer available from react-admin.

If you need a fixed header, row hover, multi-row selection, or any other material-ui 0.x `<Table>` feature, you'll need to implement your own `<Datagrid>` alternative, e.g. using the library recommended by material-ui, [DevExtreme React Grid](https://devexpress.github.io/devextreme-reactive/react/grid/).

## `<DateInput>` Stores a Date String Instead Of a Date Object

The value of the `<DateInput>` used to be a `Date` object. It's now a `String`, i.e. a stringified date. If you used `format` and `parse` to convert a string to a `Date`, you can now remove these props:

```diff
- const dateFormatter = v => { // from record to input
-   // v is a string of "YYYY-MM-DD" format
-   const match = /(\d{4})-(\d{2})-(\d{2})/.exec(v);
-   if (match === null) return;
-   const d = new Date(match[1], parseInt(match[2], 10) - 1, match[3]);
-   if (isNaN(d)) return;
-   return d;
- };
- const dateParser = v => { // from input to record
-   // v is a `Date` object
-   if (!(v instanceof Date) || isNaN(v)) return;
-   const pad = '00';
-   const yy = v.getFullYear().toString();
-   const mm = (v.getMonth() + 1).toString();
-   const dd = v.getDate().toString();
-   return `${yy}-${(pad + mm).slice(-2)}-${(pad + dd).slice(-2)}`;
- };
- <DateInput source="isodate" format={dateFormatter} parse={dateParser} label="ISO date" />
+ <DateInput source="isodate" label="ISO date" />
```

On the other way around, if your data provider expects JavaScript `Date` objects for value, you now need to do the conversion to and from strings using `format` and `parse`:

```diff
- <DateInput source="isodate" label="ISO date" />
+ const dateFormatter = v => { // from record to input
+   // v is a `Date` object
+   if (!(v instanceof Date) || isNaN(v)) return;
+   const pad = '00';
+   const yy = v.getFullYear().toString();
+   const mm = (v.getMonth() + 1).toString();
+   const dd = v.getDate().toString();
+   return `${yy}-${(pad + mm).slice(-2)}-${(pad + dd).slice(-2)}`;
+ };
+ const dateParser = v => { // from input to record
+   // v is a string of "YYYY-MM-DD" format
+   const match = /(\d{4})-(\d{2})-(\d{2})/.exec(v);
+   if (match === null) return;
+   const d = new Date(match[1], parseInt(match[2], 10) - 1, match[3]);
+   if (isNaN(d)) return;
+   return d;
+ };
+ <DateInput source="isodate" format={dateFormatter} parse={dateParser} label="ISO date" />
```

## Removed `<DateInput>` `options` props

Material-ui 1.0 doesn't provide a real date picker, so the `options` prop of the `<DateInput>` is no longer supported.

## `<SelectArrayInput>` does not support autocompletion anymore.

This component relied on [material-ui-chip-input](https://github.com/TeamWertarbyte/material-ui-chip-input) which is not yet fully ported to Material-ui 1.0: it doesn't support the autocomplete feature we need. We will add another component for this when `material-ui-chip-input` is ported.

## CSS Classes Changed

React-admin does not rely heavily on CSS classes. Nevertheless, a few components added CSS classes to facilitate per-field theming: `<SimpleShowLayout>`, `<Tab>`, and `<FormInput>`. These CSS classes used to follow the "aor-" naming pattern. They have all been renamed to use the "ra-" pattern instead. Here is the list of concerned classes:

* `aor-field` => `ra-field`
* `aor-field-[source]` => `ra-field-[source]`
* `aor-input` => `ra-input`
* `aor-input-[source]` => `ra-input-[source]`

If you used CSS to customize the look and feel of these components, please update your CSS selectors accordingly.

## `addField` Prop Replaced By `addField` HOC

Adding the `addField` prop to a component used to automatically add a redux-form `<Field>` component around an input component that you wanted to bind to the edit or create form. This feature was moved to a Higher-order component (HOC):

```diff
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
+ import { addField } from 'react-admin';
const SexInput = ({ input, meta: { touched, error } }) => (
    <SelectField
        floatingLabelText="Sex"
        errorText={touched && error}
        {...input}
    >
        <MenuItem value="M" primaryText="Male" />
        <MenuItem value="F" primaryText="Female" />
    </SelectField>
);
- SexInput.defaultProps = {
-     addField: true, // require a <Field> decoration
- }
- export default SexInput;
+ export default addField(SexInput);
```

Admin-on-rest input components all use the new `addField` HOC. This means that it's no longer necessary to set the `addField` prop when you compose one of admin-on-rest's components:

```diff
- import { SelectInput } from 'admin-on-rest';
+ import { SelectInput } from 'react-admin';
const choices = [
    { id: 'M', name: 'Male' },
    { id: 'F', name: 'Female' },
]
const SexInput = props => <SelectInput {...props} choices={choices}/>;
- SexInput.defaultProps = {
-     addField: true;
- }
export default SexInput;
```

## No More `refresh` Prop Passed To `<List>` Actions

The Refresh button now uses Redux to force a refetch of the data. As a consequence, the List view no longer passes the `refresh` prop to the `<Actions>` component. If you relied on that prop to refresh the list, you must now use the new `<RefreshButton>` component.

```diff
import { CardActions } from 'material-ui/Card';
- import FlatButton from 'material-ui/FlatButton';
- import { CreateButton } from 'admin-on-rest';
- import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
+ import { CreateButton, RefreshButton } from 'react-admin';

- const PostListActions = ({ resource, filters, displayedFilters, filterValues, basePath, showFilter, refresh }) => (
+ const PostListActions = ({ resource, filters, displayedFilters, filterValues, basePath, showFilter }) => (
    <CardActions>
        {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        <CreateButton basePath={basePath} />
-         <FlatButton primary label="refresh" onClick={refresh} icon={<NavigationRefresh />} />
+         <RefreshButton />
    </CardActions>
);
```

## Customizing styles

Following the same path as Material UI, react-admin now uses [JSS](https://github.com/cssinjs/jss) for styling components instead of the `style` prop. This approach has many benefits, including a smaller DOM, faster rendering, media queries support, and automated browser prefixing.

All react-admin components now accept a `className` prop instead of the `elStyle` prop. But it expects a CSS *class name* instead of a CSS object. To set custom styles through a class name, you must use the [`withStyles` Higher Order Component](https://material-ui-next.com/customization/css-in-js/#api) supplied by Material-UI.

```diff
- import { EmailField, List, Datagrid } from 'admin-on-rest';
- const UserList = props => (
-     <List {...props}>
-         <Datagrid>
-             ...
-             <EmailField source="email" elStyle={{ textDecoration: 'none' }} />
-         </Datagrid>
-     </List>
- );
- export default UserList;
// renders in the datagrid as
//<td>
//    <a style="text-decoration:none" href="mailto:foo@example.com">foo@example.com</a>
//</td>
+ import { EmailField, List, Datagrid } from 'react-admin';
+ import { withStyles } from 'material-ui/styles';
+ const styles = {
+     field: {
+         textDecoration: 'none',
+     },
+ };
+ const UserList = ({ classes, ...props }) => (
+     <List {...props}>
+         <Datagrid>
+            ...
+             <EmailField source="email" className={classes.field} />
+         </Datagrid>
+     </List>
+ );
+ export default withStyles(styles)(UserList);
```

In addition to `elStyle`, Field and Input components used to support a `style` prop to override the styles of the *container element* (the `<td>` in a datagrid). This prop is no longer supported in react-admin. Instead, the `Datagrid` component will check if its children have a `headerClassName` and `cellClassName` props. If they do, it will apply those classes to the table header and cells respectively.

```jsx
// before
import { EmailField, List, Datagrid } from 'react-admin';

const UserList = props => (
    <List {...props}>
        <Datagrid>
            <EmailField source="email" style={{ backgroundColor: 'lightgrey' }} elStyle={{ textDecoration: 'none' }} />
        </Datagrid>
    </List>
);
export default UserList;
// renders in the datagrid as
// <td style="background-color:lightgrey">
//     <a style="text-decoration:none" href="mailto:foo@example.com">
//         foo@example.com
//     </a>
// </td>

// after
import { EmailField, List, Datagrid } from 'react-admin';
import { withStyles } from 'material-ui/styles';

const styles = {
    cell: {
        backgroundColor: 'lightgrey',
    },
    field: {
        textDecoration: 'none',
    },
};

const UserList = ({ classes, ...props }) => (
    <List {...props}>
        <Datagrid>
            <EmailField
                source="email"
                cellClassName={classes.cell}
                className={classes.field}
            />
        </Datagrid>
    </List>
);
export default withStyles(styles)(UserList);
// renders the same in the datagrid
// <td style="background-color:lightgrey">
//     <a style="text-decoration:none" href="mailto:foo@example.com">
//         foo@example.com
//     </a>
// </td>

```

Furthermore, some React-admin components such as the `List`, `Filter`, and `Datagrid` also accept a `classes` prop. This prop is injected by the [`withStyles` Higher Order Component](https://material-ui-next.com/customization/css-in-js/#api) and allows you to customize the style of some deep children. See the Theming documentation for details.

**Tip**: When you set the `classes` prop in the `List` or `Datagrid` components, you might see warnings about the `cell` and `field` classes being unknown by those components. Those warnings are not displayed in `production` mode, and are just a way to ensure you know what you're doing. And you can make them disappear by destructuring the `classes` prop:

```jsx
import { EmailField, List, Datagrid } from 'react-admin';
import { withStyles } from 'material-ui/styles';

const styles = {
    header: { fontWeight: 'bold' },
    actions: { fontWeight: 'bold' },
    emailCellClassName: {
        backgroundColor: 'lightgrey',
    },
    emailFieldClassName: {
        textDecoration: 'none',
    },
};

export const UserList = ({
    classes: { emailCellClassName, emailFieldClassName, ...classes },
    ...props
}) => (
    <List
        {...props}
        filters={<UserFilter />}
        sort={{ field: 'name', order: 'ASC' }}
        classes={classes}
    >
        <Datagrid>
            <EmailField
                source="email"
                cellClassName={emailCellClassName}
                className={emailFieldClassName}
            />
        </Datagrid>
    </List>
);

// renders in the datagrid as
<td style="background-color:lightgrey">
    <a style="text-decoration:none" href="mailto:foo@example.com">
        foo@example.com
    </a>
</td>
```

Finally, Field and Input components accept a `textAlign` prop, which can be either `left`, or `right`. Through this prop, these components inform their parent component that they look better when aligned to left or right. It's the responsability of the parent component to apply this alignment. For instance, the `NumberField` component has a default value of `right` for the `textAlign` prop, so the `Datagrid` component uses a right alignment in header and table cell - but form components (`SimpleForm` and `TabbedForm`) ignore the prop and display it left aligned.

## Authentication: `<Restricted>` renamed to `<Authenticated>`

The `Restricted` component has been renamed to `Authenticated`. update your `import` statements accordingly:

```jsx
// before
// in src/MyPage.js
import { withRouter } from 'react-router-dom';
import { Restricted } from 'admin-on-rest';

const MyPage = ({ location }) => (
    <Restricted authParams={{ foo: 'bar' }} location={location}>
        <div>
            ...
        </div>
    </Restricted>
)

export default withRouter(MyPage);

// after
// in src/MyPage.js
import { withRouter } from 'react-router-dom';
import { Authenticated } from 'react-admin';

const MyPage = ({ location }) => (
    <Authenticated authParams={{ foo: 'bar' }} location={location}>
        <div>
            ...
        </div>
    </Authenticated>
)

export default withRouter(MyPage);
```

## Authorization: `<WithPermission>` and `<SwitchPermissions>` replaced by `<WithPermissions>`

We removed the `WithPermission` and `SwitchPermissions` in favor of a more versatile component: `WithPermissions`. The `WithPermissions` component retrieves permissions by calling the `authProvider` with the `AUTH_GET_PERMISSIONS` type. It then passes the permissions to the render callback. 

This component follows the [render callback pattern](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce). Just like the [React Router `Route`](https://reacttraining.com/react-router/web/api/Route) component, you can pass a render callback to `<WithPermissions>` either as its only child, or via its `render` prop (if both are passed, the `render` prop is used).

If you were using `WithPermission` before, here's how to migrate to `WithPermissions`:

```jsx
// before
import React from 'react';
import { MenuItemLink, WithPermission } from 'admin-on-rest';

export default ({ onMenuClick, logout }) => (
    <div>
        <MenuItemLink to="/posts" primaryText="Posts" onClick={onMenuClick} />
        <MenuItemLink to="/comments" primaryText="Comments" onClick={onMenuClick} />
        <WithPermission value="admin">
            <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
        </WithPermission>
        {logout}
    </div>
);

// after
import React from 'react';
import { MenuItemLink, WithPermissions } from 'react-admin';

export default ({ onMenuClick, logout }) => (
    <div>
        <MenuItemLink to="/posts" primaryText="Posts" onClick={onMenuClick} />
        <MenuItemLink to="/comments" primaryText="Comments" onClick={onMenuClick} />
        <WithPermissions
            render={
            ({permissions}) =>
                permissions === 'admin'
                ? <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
                : null
            }
        />
        {/* OR */}
        <WithPermissions>
            {({permissions}) =>
                permissions === 'admin'
                ? <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
                : null
            }
        </WithPermissions>
        {logout}
    </div>
);
```

If you were using `SwitchPermissions` before, here's how to migrate to `WithPermissions`:

```jsx
// before
import React from 'react';
import BenefitsSummary from './BenefitsSummary';
import BenefitsDetailsWithSensitiveData from './BenefitsDetailsWithSensitiveData';
import { ViewTitle, SwitchPermissions, Permission } from 'admin-on-rest';

export default () => (
    <div>
        <SwitchPermissions>
            <Permission value="associate">
                <BenefitsSummary />
            </Permission>
            <Permission value="boss">
                <BenefitsDetailsWithSensitiveData />
            </Permission>
        </SwitchPermissions>
    </div>
);

// after
import React from 'react';
import BenefitsSummary from './BenefitsSummary';
import BenefitsDetailsWithSensitiveData from './BenefitsDetailsWithSensitiveData';
import { ViewTitle, WithPermissions } from 'react-admin';

export default () => (
    <div>
        <WithPermissions
            render={({permissions}) => {
                if (permissions === 'associate') {
                    return <BenefitsSummary />;
                }
                if (permissions === 'boss') {
                    return <BenefitsDetailsWithSensitiveData />;
                }
            }}
        />
    </div>
);
```

We also reviewed how permissions are passed to the `List`, `Edit`, `Create`, `Show` and `Delete` components. React-admin now injects the permissions to theses components in the `permissions` props, without having to use the render callback pattern. It should now be easier to customize behaviors and components according to permissions.

Here's how to migrate a `Create` component:

```jsx
// before
const UserCreateToolbar = ({ permissions, ...props }) =>
    <Toolbar {...props}>
        <SaveButton
            label="user.action.save_and_show"
            redirect="show"
            submitOnEnter={true}
        />
        {permissions === 'admin' &&
            <SaveButton
                label="user.action.save_and_add"
                redirect={false}
                submitOnEnter={false}
                variant="flat"
            />}
    </Toolbar>;

export const UserCreate = ({ ...props }) =>
    <Create {...props}>
        {permissions =>
            <SimpleForm
                toolbar={<UserCreateToolbar permissions={permissions} />}
                defaultValue={{ role: 'user' }}
            >
                <TextInput source="name" validate={[required()]} />
                {permissions === 'admin' &&
                    <TextInput source="role" validate={[required()]} />}
            </SimpleForm>}
    </Create>;

// after
const UserCreateToolbar = ({ permissions, ...props }) =>
    <Toolbar {...props}>
        <SaveButton
            label="user.action.save_and_show"
            redirect="show"
            submitOnEnter={true}
        />
        {permissions === 'admin' &&
            <SaveButton
                label="user.action.save_and_add"
                redirect={false}
                submitOnEnter={false}
                variant="flat"
            />}
    </Toolbar>;

export const UserCreate = ({ permissions, ...props }) =>
    <Create {...props}>
        <SimpleForm
            toolbar={<UserCreateToolbar permissions={permissions} />}
            defaultValue={{ role: 'user' }}
        >
            <TextInput source="name" validate={[required()]} />
            {permissions === 'admin' &&
                <TextInput source="role" validate={[required()]} />}
        </SimpleForm>
    </Create>;
```

Here's how to migrate an `Edit` component:

```jsx
// before
export const UserEdit = ({ ...props }) =>
    <Edit title={<UserTitle />} {...props}>
        {permissions =>
            <TabbedForm defaultValue={{ role: 'user' }}>
                <FormTab label="user.form.summary">
                    {permissions === 'admin' && <DisabledInput source="id" />}
                    <TextInput source="name" validate={required()} />
                </FormTab>
                {permissions === 'admin' &&
                    <FormTab label="user.form.security">
                        <TextInput source="role" validate={required()} />
                    </FormTab>}
            </TabbedForm>}
    </Edit>;

// after
export const UserEdit = ({ permissions, ...props }) =>
    <Edit title={<UserTitle />} {...props}>
        <TabbedForm defaultValue={{ role: 'user' }}>
            <FormTab label="user.form.summary">
                {permissions === 'admin' && <DisabledInput source="id" />}
                <TextInput source="name" validate={required()} />
            </FormTab>
            {permissions === 'admin' &&
                <FormTab label="user.form.security">
                    <TextInput source="role" validate={required()} />
                </FormTab>}
        </TabbedForm>
    </Edit>;
```

Here's how to migrate a `List` component. Note that the `<Filter>` component does not support the function as a child pattern anymore. If you need permissions within it, just pass them from the `List` component.

```jsx
// before
const UserFilter = ({ ...props }) =>
    <Filter {...props}>
        {permissions => [
            <TextInput
                key="user.list.search"
                label="user.list.search"
                source="q"
                alwaysOn
            />,
            <TextInput key="name" source="name" />,
            permissions === 'admin' ? <TextInput source="role" /> : null,
        ]}
    </Filter>;

export const UserList = ({ ...props }) =>
    <List
        {...props}
        filters={<UserFilter />}
        sort={{ field: 'name', order: 'ASC' }}
    >
        {permissions =>
            <Responsive
                small={
                    <SimpleList
                        primaryText={record => record.name}
                        secondaryText={record =>
                            permissions === 'admin' ? record.role : null}
                    />
                }
                medium={
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="name" />
                        {permissions === 'admin' && <TextField source="role" />}
                        {permissions === 'admin' && <EditButton />}
                        <ShowButton />
                    </Datagrid>
                }
            />}
    </List>;

// after
const UserFilter = ({ permissions, ...props }) =>
    <Filter {...props}>
        <TextInput
            key="user.list.search"
            label="user.list.search"
            source="q"
            alwaysOn
        />
        <TextInput key="name" source="name" />
        {permissions === 'admin' ? <TextInput source="role" /> : null}
    </Filter>;

export const UserList = ({ permissions, ...props }) =>
    <List
        {...props}
        filters={<UserFilter permissions={permissions} />}
        sort={{ field: 'name', order: 'ASC' }}
    >
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record =>
                        permissions === 'admin' ? record.role : null}
                />
            }
            medium={
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
                    {permissions === 'admin' && <TextField source="role" />}
                    {permissions === 'admin' && <EditButton />}
                    <ShowButton />
                </Datagrid>
            }
        />
    </List>;
```

Moreover, you won't need the now deprecated `<WithPermission>` or `<SwitchPermissions>` components inside a `Dashboard` to access permissions anymore: react-admin injects `permissions` to the dashboard, too:

```jsx
// before
// in src/Dashboard.js
import React from 'react';
import BenefitsSummary from './BenefitsSummary';
import BenefitsDetailsWithSensitiveData from './BenefitsDetailsWithSensitiveData';
import { ViewTitle SwitchPermissions, Permission } from 'admin-on-rest';

export default () => (
    <Card>
        <ViewTitle title="Dashboard" />

        <SwitchPermissions>
            <Permission value="associate">
                <BenefitsSummary />
            </Permission>
            <Permission value="boss">
                <BenefitsDetailsWithSensitiveData />
            </Permission>
        </SwitchPermissions>
    </Card>
);

// after
// in src/Dashboard.js
import React from 'react';
import BenefitsSummary from './BenefitsSummary';
import BenefitsDetailsWithSensitiveData from './BenefitsDetailsWithSensitiveData';
import { ViewTitle } from 'react-admin';

export default ({ permissions }) => (
    <Card>
        <ViewTitle title="Dashboard" />

        {permissions === 'associate'
            ? <BenefitsSummary />
            : null}
        {permissions === 'boss'
            ? <BenefitsDetailsWithSensitiveData />
            : null}
    </Card>
);
```

Finally, you won't need the now deprecated `<WithPermission>` or `<SwitchPermissions>` in custom routes either if you want access to permissions. Much like you can restrict access to authenticated users only with the [`Authenticated`](Authentication.html#restricting-access-to-a-custom-page) component, you may decorate your custom route with the `WithPermissions` component. It will ensure the user is authenticated then call the `authProvider` with the `AUTH_GET_PERMISSIONS` type and the `authParams` you specify:

{% raw %}
```jsx
// in src/MyPage.js
import React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import { ViewTitle, WithPermissions } from 'react-admin';
import { withRouter } from 'react-router-dom';

const MyPage = ({ permissions }) => (
    <Card>
        <ViewTitle title="My custom page" />
        <CardContent>Lorem ipsum sic dolor amet...</CardContent>
        {permissions === 'admin'
            ? <CardContent>Sensitive data</CardContent>
            : null
        }
    </Card>
)
const MyPageWithPermissions = ({ location, match }) => (
    <WithPermissions
        authParams={{ key: match.path, params: route.params }}
        // location is not required but it will trigger a new permissions check if specified when it changes
        location={location}
        render={({ permissions }) => <MyPage permissions={permissions} /> }
    />
);

export default MyPageWithPermissions;

// in src/customRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import Foo from './Foo';
import Bar from './Bar';
import Baz from './Baz';
import MyPageWithPermissions from './MyPage';

export default [
    <Route exact path="/foo" component={Foo} />,
    <Route exact path="/bar" component={Bar} />,
    <Route exact path="/baz" component={Baz} noLayout />,
    <Route exact path="/baz" component={MyPageWithPermissions} />,
];
```

## Custom Layouts

The default layout has been simplified and this results in a simplified custom layout too. You don't need to pass the `AdminRoutes` anymore as you'll receive the component to render as the standard `children` prop:

```js
// Before
import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import {
    AdminRoutes,
    AppBar,
    Menu,
    Notification,
    Sidebar,
    setSidebarVisibility,
} from 'react-admin';

const styles = {
    wrapper: {
        // Avoid IE bug with Flexbox, see #467
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    body: {
        backgroundColor: '#edecec',
        display: 'flex',
        flex: 1,
        overflowY: 'hidden',
        overflowX: 'scroll',
    },
    content: {
        flex: 1,
        padding: '2em',
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
    },
};

class MyLayout extends Component {
    componentWillMount() {
        this.props.setSidebarVisibility(true);
    }

    render() {
        const {
            children,
            customRoutes,
            dashboard,
            isLoading,
            logout,
            menu,
            title,
        } = this.props;
        return (
            <MuiThemeProvider>
                <div style={styles.wrapper}>
                    <div style={styles.main}>
                        <AppBar title={title} />
                        <div className="body" style={styles.body}>
                            <div style={styles.content}>
                                <AdminRoutes
                                    customRoutes={customRoutes}
                                    dashboard={dashboard}
                                >
                                    {children}
                                </AdminRoutes>
                            </div>
                            <Sidebar>
                                {createElement(menu || Menu, {
                                    logout,
                                    hasDashboard: !!dashboard,
                                })}
                            </Sidebar>
                        </div>
                        <Notification />
                        {isLoading && (
                            <CircularProgress
                                color="#fff"
                                size={30}
                                thickness={2}
                                style={styles.loader}
                            />
                        )}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

MyLayout.propTypes = {
    authClient: PropTypes.func,
    customRoutes: PropTypes.array,
    dashboard: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    isLoading: PropTypes.bool.isRequired,
    menu: PropTypes.element,
    resources: PropTypes.array,
    setSidebarVisibility: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });
export default connect(mapStateToProps, { setSidebarVisibility })(MyLayout);

// After
import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import {
    AdminRoutes,
    AppBar,
    Menu,
    Notification,
    Sidebar,
    setSidebarVisibility,
} from 'react-admin';

const styles = {
    wrapper: {
        // Avoid IE bug with Flexbox, see #467
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    body: {
        backgroundColor: '#edecec',
        display: 'flex',
        flex: 1,
        overflowY: 'hidden',
        overflowX: 'scroll',
    },
    content: {
        flex: 1,
        padding: '2em',
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
    },
};

class MyLayout extends Component {
    componentWillMount() {
        this.props.setSidebarVisibility(true);
    }

    render() {
        const {
            children,
            dashboard,
            isLoading,
            logout,
            menu,
            title,
        } = this.props;
        return (
            <MuiThemeProvider>
                <div style={styles.wrapper}>
                    <div style={styles.main}>
                        <AppBar title={title} />
                        <div className="body" style={styles.body}>
                            <div style={styles.content}>
                                {children}
                            </div>
                            <Sidebar>
                                {createElement(menu || Menu, {
                                    logout,
                                    hasDashboard: !!dashboard,
                                })}
                            </Sidebar>
                        </div>
                        <Notification />
                        {isLoading && (
                            <CircularProgress
                                color="#fff"
                                size={30}
                                thickness={2}
                                style={styles.loader}
                            />
                        )}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

MyLayout.propTypes = {
    dashboard: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    isLoading: PropTypes.bool.isRequired,
    menu: PropTypes.element,
    setSidebarVisibility: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });
export default connect(mapStateToProps, { setSidebarVisibility })(MyLayout);
```

## Menu `onMenuTap` prop has been renamed `onMenuClick`

Material-ui renamed all `xxxTap` props to `xxxClick`, so did we.

```js
// Before
import React from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, getResources } from 'react-admin';

const Menu = ({ resources, onMenuTap, logout }) => (
    <div>
        {resources.map(resource => (
            <MenuItemLink to={`/${resource.name}`} primaryText={resource.name} onClick={onMenuTap} />
        ))}
        <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuTap} />
        {logout}
    </div>
);

const mapStateToProps = state => ({
    resources: getResources(state),
});

export default connect(mapStateToProps)(Menu);

// After
import React from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, getResources } from 'react-admin';

const Menu = ({ resources, onMenuClick, logout }) => (
    <div>
        {resources.map(resource => (
            <MenuItemLink to={`/${resource.name}`} primaryText={resource.name} onClick={onMenuClick} />
        ))}
        <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
        {logout}
    </div>
);

const mapStateToProps = state => ({
    resources: getResources(state),
});

export default connect(mapStateToProps)(Menu);
```

## Logout is now displayed in the AppBar on desktop

The Logout button is now displayed in the AppBar on desktop but is still displayed as a menu item on small devices.

This impacts how you build a custom menu, as you'll now have to check whether you are on small devices before displaying the logout:

```jsx
// in src/Menu.js
// before
import React from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, getResources } from 'react-admin';
import { withRouter } from 'react-router-dom';

const Menu = ({ resources, onMenuClick, logout }) => (
    <div>
        {resources.map(resource => (
            <MenuItemLink to={`/${resource.name}`} primaryText={resource.name} onClick={onMenuClick} />
        ))}
        <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
        {logout}
    </div>
);

const mapStateToProps = state => ({
    resources: getResources(state),
});

export default withRouter(connect(mapStateToProps)(Menu));

// after
import React from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, getResources, Responsive } from 'react-admin';
import { withRouter } from 'react-router-dom';

const Menu = ({ resources, onMenuClick, logout }) => (
    <div>
        {resources.map(resource => (
            <MenuItemLink to={`/${resource.name}`} primaryText={resource.name} onClick={onMenuClick} />
        ))}
        <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
        <Responsive
            small={logout}
            medium={<div />} // We must define something to not fallback on small
        />
    </div>
);

const mapStateToProps = state => ({
    resources: getResources(state),
});

export default withRouter(connect(mapStateToProps)(Menu));
```

It also impacts custom layouts if you're using the default `AppBar`. You now have to pass the `logout` prop to the `AppBar`:

```jsx
// in src/MyLayout.js
// Before
import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import { AppBar, Menu, Notification, Sidebar } from 'react-admin';

const theme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

const styles = {
    ...
};

const MyLayout () => ({
    children,
    dashboard,
    logout,
    menu,
    title,
}) => (
    <MuiThemeProvider theme={theme}>
        <div style={styles.wrapper}>
            <div style={styles.main}>
                <AppBar title={title} />
                <div className="body" style={styles.body}>
                    <div style={styles.content}>{children}</div>
                    <Sidebar>
                        {createElement(menu || Menu, {
                            logout,
                            hasDashboard: !!dashboard,
                        })}
                    </Sidebar>
                </div>
                <Notification />
            </div>
        </div>
    </MuiThemeProvider>
);

// After
import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import { AppBar, Menu, Notification, Sidebar } from 'react-admin';

const theme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

const styles = {
    ...
};

const MyLayout () => ({
    children,
    dashboard,
    logout,
    menu,
    title,
}) => (
    <MuiThemeProvider theme={theme}>
        <div style={styles.wrapper}>
            <div style={styles.main}>
                <AppBar title={title} logout={logout} />
                <div className="body" style={styles.body}>
                    <div style={styles.content}>{children}</div>
                    <Sidebar>
                        {createElement(menu || Menu, {
                            logout,
                            hasDashboard: !!dashboard,
                        })}
                    </Sidebar>
                </div>
                <Notification />
            </div>
        </div>
    </MuiThemeProvider>
);
```

## Data providers should support two more types for bulk actions

The `List` component now support bulk actions. The consequence is that data providers should support them too. We introduced two new message types for the `dataProvider`: `DELETE_MANY` and `UPDATE_MANY`.

Both will be called with an `ids` property in their params, containing an array of resource ids. In addition, `UPDATE_MANY` will also get a `data` property in its params, defining how to update the resources.

Please refer to the `dataProvider` documentation for more information.

## react-admin addon packages renamed with ra prefix and moved into root repository

`aor-graphql` `aor-realtime` and `aor-dependent-input` packages have been migrated into the main `react-admin` repository and renamed with the new prefix. Besides, `aor-graphql-client` and `aor-graphql-client-graphcool` follow the new dataProvider packages naming.

* `aor-realtime` => `ra-realtime`
* `aor-dependent-input` => `ra-dependent-input`
* `aor-graphql-client` => `ra-data-graphql`
* `aor-graphql-client-graphcool` => `ra-data-graphcool`

Update your `import` statements accordingly:

```js
// before
import realtimeSaga from 'aor-realtime';
// after
import realtimeSaga from 'ra-realtime';

// before
import { DependentInput, DependentField } from 'aor-dependent-input';
// after
import { DependentInput, DependentField } from 'ra-dependent-input';

// before
import buildGraphQLProvider from 'aor-graphql-client';
// after
import buildGraphQLProvider from 'ra-data-graphql';

// before
import buildGraphcoolProvider from 'aor-graphql-client-graphcool';
// after
import buildGraphcoolProvider from 'ra-data-graphcool';
```

## Validators should be initialized

The `required`,`number` and `email` validators must now be executed just like the other validators, not passed as function arguments.

Update your `require`,`number` and `email` validations. 
 
```diff
-<TextInput source="foo" validate={[required,maxSize(2)]} />
+<TextInput source="foo" validate={[required(),maxSize(2)]} />

-<TextInput source="foo" validate={number} />
+<TextInput source="foo" validate={number()} />

-<TextInput source="foo" validate={email} />
+<TextInput source="foo" validate={email()} />
```
  