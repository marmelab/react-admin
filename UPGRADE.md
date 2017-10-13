# Upgrade to 2.0

## Default REST clients moved to external packages

`simpleRestClient` and `jsonServerRestClient` are no longer part of the core package. They have been moved to standalone packages, where they are the default export:

* `simpleRestClient` => `ra-data-simple-rest`
* `jsonServerRestClient` => `ra-data-json-server`

Update your `import` statements accordingly:

```js
// before
import { simpleRestClient } from 'admin-on-rest';
// after
import simpleRestClient from 'ra-data-simple-rest';
```

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
