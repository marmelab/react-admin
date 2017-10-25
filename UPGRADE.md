# Upgrade to 2.0

## Admin-on-rest Renamed to React-Admin

We've chosen to remove term REST from the project name, to emphasize the fact that it can adapt to any type of backend - including GraphQL.

So the main package name has changed from `admin-on-rest` to `react-admin`. You must update your dependencies:

```sh
npm uninstall admin-on-rest
npm install react-admin
```

As well as all your files depending on the 'admin-on-rest' package:

```js
// before
import { BooleanField, NumberField, Show } from 'admin-on-rest'; 
// after
import { BooleanField, NumberField, Show } from 'react-admin'; 
```

A global search and replace on the string "admin-on-rest" should do the trick in no time.

## `restClient` Prop Renamed To `dataProvider` in `<Admin>` Component

In the `<Admin>` component, the `restClient` prop is now called `dataProvider`:

```jsx
// before
import restClient from './restClient';
<Admin restClient={restClient}>
   ...
</Admin>

// after
import restClient from './restClient';
<Admin dataProvider={restClient}>
   ...
</Admin>
```

The signature of the Data Provider function is the same as the REST client function, so you shouldn't need to change anything in your previous REST client function.

## Default REST Clients Moved to Standalone Packages

`simpleRestClient` and `jsonServerRestClient` are no longer part of the core package. They have been moved to standalone packages, where they are the default export:

* `simpleRestClient` => `ra-data-simple-rest`
* `jsonServerRestClient` => `ra-data-json-server`

Update your `import` statements accordingly:

```js
// before
import { simpleRestClient } from 'admin-on-rest';
// after
import simpleRestClient from 'ra-data-simple-rest';

// before
import { jsonServerRestClient } from 'admin-on-rest';
// after
import jsonServerRestClient from 'ra-data-json-server';
```

## Default (English) Messages Moved To Standalone Package

The English messages have moved to another package, `ra-language-english`. The core package still displays the interface messages in English by default (by using `ra-language-english` as a dependency), but if you overrode some of the messages, you'll need to update the package name:

```js
// before
import { enMessages } from 'admin-on-rest';
const messages = { 'en': enMessages };

// after
import enMessages from 'ra-language-english';
const messages = { 'en': enMessages };

<Admin locale="en" messages={messages}>
  ...
</Admin>
```

## Message Hash Main Key Changed ("aor" => "ra")

The main key of translation message objects was renamed from "aor" ro "ra". You must update your custom messages accordingly if you overrode core interface messages. If you're a language package author, you must also update and  republish your package to have it work with react-admin 2.0.

```js
// before
module.exports = {
    aor: {
        action: {
            delete: 'Delete',
            show: 'Show',
            ...
// after
module.exports = {
    ra: {
        action: {
            delete: 'Delete',
            show: 'Show',
            ...
```

## `<DateInput>` Stores a Date String Instead Of a Date Object

The value of the `<DateInput>` used to be a `Date` object. It's now a `String`, i.e. a stringified date. If you used `format` and `parse` to convert a string to a `Date`, you can now remove these props:

```jsx
// before
const dateFormatter = v => { // from record to input
  // v is a string of "YYYY-MM-DD" format
  const match = /(\d{4})-(\d{2})-(\d{2})/.exec(v);
  if (match === null) return;
  const d = new Date(match[1], parseInt(match[2], 10) - 1, match[3]);
  if (isNaN(d)) return;
  return d;
};
const dateParser = v => { // from input to record
  // v is a `Date` object
  if (!(v instanceof Date) || isNaN(v)) return;
  const pad = '00';
  const yy = v.getFullYear().toString();
  const mm = (v.getMonth() + 1).toString();
  const dd = v.getDate().toString();
  return `${yy}-${(pad + mm).slice(-2)}-${(pad + dd).slice(-2)}`;
};
<DateInput source="isodate" format={dateFormatter} parse={dateParser} label="ISO date" />

// after
<DateInput source="isodate" label="ISO date" />
```

On the other way around, if your data provider expects JavaScript `Date` objects for value, you now need to do the conversion to and from strings using `format` and `parse`:

```jsx
// before
<DateInput source="isodate" label="ISO date" />

// after
const dateFormatter = v => { // from record to input
  // v is a `Date` object
  if (!(v instanceof Date) || isNaN(v)) return;
  const pad = '00';
  const yy = v.getFullYear().toString();
  const mm = (v.getMonth() + 1).toString();
  const dd = v.getDate().toString();
  return `${yy}-${(pad + mm).slice(-2)}-${(pad + dd).slice(-2)}`;
};
const dateParser = v => { // from input to record
  // v is a string of "YYYY-MM-DD" format
  const match = /(\d{4})-(\d{2})-(\d{2})/.exec(v);
  if (match === null) return;
  const d = new Date(match[1], parseInt(match[2], 10) - 1, match[3]);
  if (isNaN(d)) return;
  return d;
};
<DateInput source="isodate" format={dateFormatter} parse={dateParser} label="ISO date" />
```

## Removed `<DateInput>` `options` props

Material-ui 1.0 doesn't provide a real data picker, so the `options` prop of the `<DateInput>` is no longer supported.

## CSS Classes Changed

React-admin does not rely heavily on CSS classes. Nevertheless, a few components added CSS classes to facilitate per-field theming: `<SimpleShowLayout>`, `<Tab>`, and `<FormInput>`. These CSS classes used to follow the "aor-" naming pattern. They have all been renamed to use the "ra-" pattern instead. Here is the list of concerned classes:

* `aor-field` => `ra-field`
* `aor-field-[source]` => `ra-field-[source]`
* `aor-input` => `ra-input`
* `aor-input-[source]` => `ra-input-[source]`

If you used CSS to customize the look and feel of these components, please update your CSS selectors accordingly.

## `addField` Prop Replaced By `addField` HOC

Adding the `addField` prop to a component used to automatically add a redux-form `<Field>` component around an input component that you wanted to bind to the edit or create form. This feature was moved to a Higher-order component (HOC):

```jsx
// before
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
SexInput.defaultProps = {
    addField: true, // require a <Field> decoration
}
export default SexInput;

// after
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { addField } from 'admin-on-rest';
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
export default addField(SexInput); // require a <Field> decoration
```

Admin-on-rest input components all use the new `addField` HOC. This means that it's no longer necessary to set the `addField` prop when you compose one of admin-on-rest's components:

```jsx
// before
import { SelectInput } from 'admin-on-rest';
const choices = [
    { id: 'M', name: 'Male' },
    { id: 'F', name: 'Female' },
]
const SexInput = props => <SelectInput {...props} choices={choices}/>;
SexInput.defaultProps = {
    addField: true;
}
export default SexInput;

// after
import { SelectInput } from 'admin-on-rest';
const choices = [
    { id: 'M', name: 'Male' },
    { id: 'F', name: 'Female' },
]
const SexInput = props => <SelectInput {...props} choices={choices}/>;
export default SexInput;
```

## No More `refresh` Prop Passed To `<List>` Actions

The Refresh button now uses Redux to force a refetch of the data. As a consequence, the List view no longer passes the `refresh` prop to the `<Actions>` component. If you relied on that prop to refresh the list, you must now use the new `<RefreshButton>` component.

```jsx
// before
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { CreateButton } from 'admin-on-rest';

const PostActions = ({ resource, filters, displayedFilters, filterValues, basePath, showFilter, refresh }) => (
    <CardActions>
        {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        <CreateButton basePath={basePath} />
        <FlatButton primary label="refresh" onClick={refresh} icon={<NavigationRefresh />} />
        {/* Add your custom actions */}
        <FlatButton primary label="Custom Action" onClick={customAction} />
    </CardActions>
);

// after
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { CreateButton, RefreshButton } from 'react-admin';

const PostActions = ({ resource, filters, displayedFilters, filterValues, basePath, showFilter }) => (
    <CardActions>
        {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        <CreateButton basePath={basePath} />
        <RefreshButton />
        {/* Add your custom actions */}
        <FlatButton primary label="Custom Action" onClick={customAction} />
    </CardActions>
);
```
