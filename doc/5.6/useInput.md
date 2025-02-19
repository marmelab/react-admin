---
layout: default
title: "useInput"
---

# `useInput`

This hook lets you build custom inputs for react-admin. It's a wrapper around [react-hook-form's `useController`](https://react-hook-form.com/docs/usecontroller).

React-admin adds functionality to react-hook-form:

- handling of custom event emitters like `onChange`,
- support for an array of validators,
- detection of required fields to add an asterisk to the field label,
- parse and format to translate record values to form values and vice-versa.

## Usage

`useInput` expects at least a `source`, and returns an object with the following properties:

```jsx
{ id, field, fieldState, formState, isRequired }
```

For instance, to build a custom input for a `title` field:

```jsx
import { useInput } from 'react-admin';

const TitleInput = ({ source, label }) => {
    const { id, field, fieldState } = useInput({ source });
    return (
        <label htmlFor={id}>
            {label}
            <input id={id} {...field} />
            {fieldState.error && <span>{fieldState.error.message}</span>}
        </label>
    );
};
```

## Props

| Prop           | Required | Type                           | Default          | Description                                                       |
|----------------|----------|--------------------------------|----------------- |-------------------------------------------------------------------|
| `source`       | Required | `string`                       | -                | The name of the field in the record                               |
| `defaultValue` | Optional | `any`                          | -                | The default value of the input                                    |
| `format`       | Optional | `Function`                     | -                | A function to format the value from the record to the input value |
| `parse`        | Optional | `Function`                     | -                | A function to parse the value from the input to the record value  |
| `validate`     | Optional | `Function` &#124; `Function[]` | -                | A function or an array of functions to validate the input value   |
| `id`           | Optional | `string`                       | `auto-generated` | The id of the input                                               |
| `onChange`     | Optional | `Function`                     | -                | A function to call when the input value changes                   |
| `onBlur`       | Optional | `Function`                     | -                | A function to call when the input is blurred                      |

Additional props are passed to [react-hook-form's `useController` hook](https://react-hook-form.com/docs/usecontroller).

## Usage with Material UI `<TextField>`

```jsx
// in LatLongInput.js
import TextField from '@mui/material/TextField';
import { useInput, required, InputHelperText } from 'react-admin';

const BoundedTextField = (props) => {
    const { onChange, onBlur, label, helperText, ...rest } = props;
    const {
        field,
        fieldState: { invalid, error },
        isRequired
    } = useInput({
        // Pass the event handlers to the hook but not the component as the field property already has them.
        // useInput will call the provided onChange and onBlur in addition to the default needed by react-hook-form.
        onChange,
        onBlur,
        ...rest,
    });

    return (
        <TextField
            {...field}
            label={label}
            error={invalid}
            helperText={helperText !== false || invalid
                ? (
                    <InputHelperText
                        error={error?.message}
                        helperText={helperText}
                    />
                )
                : ''
            }
            required={isRequired}
            {...rest}
        />
    );
};

const LatLngInput = props => {
    const { source, ...rest } = props;

    return (
        <span>
            <BoundedTextField source="lat" label="Latitude" validate={required()} {...rest} />
            &nbsp;
            <BoundedTextField source="lng" label="Longitude" validate={required()} {...rest} />
        </span>
    );
};
```

## Usage with Material UI `<Select>`

```jsx
// in SexInput.js
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useInput } from 'react-admin';

const SexInput = props => {
    const { field } = useInput(props);

    return (
        <Select
            label="Sex"
            {...field}
        >
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
        </Select>
    );
};
export default SexInput;
```

**Tip**: `useInput` accepts all arguments that you can pass to `useController`. Besides, components using `useInput` accept props like `format` and `parse`, to convert values from the form to the input, and vice-versa:

```jsx
const parse = value => {/* ... */};
const format = value => {/* ... */};

const PersonEdit = () => (
    <Edit>
        <SimpleForm>
            <SexInput
                source="sex"
                format={formValue => formValue === 0 ? 'M' : 'F'}
                parse={inputValue => inputValue === 'M' ? 0 : 1}
            />
        </SimpleForm>
    </Edit>
);
```

**Tip**: Remember to use react-admin's `<InputHelperText>` component in custom inputs to properly translate and render messages and errors coming from `useInput()`.

## Important note about formState

[react-hook-form's `formState` is wrapped with a Proxy](https://react-hook-form.com/docs/useformstate/#rules) to improve render performance and skip extra computation if specific state is not subscribed. So, make sure you deconstruct or read the `formState` before render in order to enable the subscription.

```js
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState      
```

This pattern should be followed when writing a custom input with `useInput()`.

```jsx
const { formState: { isSubmitted }} = useInput(props); // ✅

const { formState } = useInput(props);
const submitted = formState.isSubmitted; // ❌
```
