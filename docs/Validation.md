---
layout: default
title: "Form Validation"
---

# Form Validation

React-admin relies on [react-hook-form](https://react-hook-form.com/) for the validation of user input in forms. React-admin supports several approaches:

- using the `validate` prop at the Form level (validation by function)
- using the `validate` prop at the Input level
- using the `resolver` prop at the Form level (validation by schema)
- using the return value from the server (server-side validation)

## Global Validation

The value of the form `validate` prop must be a function taking the record as input, and returning an object with error messages indexed by field. For instance:

```jsx
const validateUserCreation = (values) => {
    const errors = {};
    if (!values.firstName) {
        errors.firstName = 'The firstName is required';
    }
    if (!values.age) {
        // You can return translation keys
        errors.age = 'ra.validation.required';
    } else if (values.age < 18) {
        // Or an object if the translation messages need parameters
        errors.age = {
            message: 'ra.validation.minValue',
            args: { min: 18 }
        };
    }
    return errors
};

export const UserCreate = () => (
    <Create>
        <SimpleForm validate={validateUserCreation}>
            <TextInput label="First Name" source="firstName" />
            <TextInput label="Age" source="age" />
        </SimpleForm>
    </Create>
);
```

**Tip**: The props you pass to `<SimpleForm>` and `<TabbedForm>` are passed to the [useForm hook](https://react-hook-form.com/api/useform) of `react-hook-form`.

**Tip**: The `validate` function can return a promise for asynchronous validation. See [the Server-Side Validation section](#server-side-validation) below.

## Per Input Validation: Built-in Field Validators

Alternatively, you can specify a `validate` prop directly in `<Input>` components, taking either a function or an array of functions. React-admin already bundles a few validator functions, that you can just require, and use as input-level validators:

* `required(message)` if the field is mandatory,
* `minValue(min, message)` to specify a minimum value for integers,
* `maxValue(max, message)` to specify a maximum value for integers,
* `minLength(min, message)` to specify a minimum length for strings,
* `maxLength(max, message)` to specify a maximum length for strings,
* `number(message)` to check that the input is a valid number,
* `email(message)` to check that the input is a valid email address,
* `regex(pattern, message)` to validate that the input matches a regex,
* `choices(list, message)` to validate that the input is within a given list,

Example usage:

```jsx
import {
    required,
    minLength,
    maxLength,
    minValue,
    maxValue,
    number,
    regex,
    email,
    choices
} from 'react-admin';

const validateFirstName = [required(), minLength(2), maxLength(15)];
const validateEmail = email();
const validateAge = [number(), minValue(18)];
const validateZipCode = regex(/^\d{5}$/, 'Must be a valid Zip Code');
const validateGender = choices(['m', 'f', 'nc'], 'Please choose one of the values');

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput label="First Name" source="firstName" validate={validateFirstName} />
            <TextInput label="Email" source="email" validate={validateEmail} />
            <TextInput label="Age" source="age" validate={validateAge}/>
            <TextInput label="Zip Code" source="zip" validate={validateZipCode}/>
            <SelectInput label="Gender" source="gender" choices={[
                { id: 'm', name: 'Male' },
                { id: 'f', name: 'Female' },
                { id: 'nc', name: 'Prefer not say' },
            ]} validate={validateGender}/>
        </SimpleForm>
    </Create>
);
```

**Tip**: If you pass a function as a message, react-admin calls this function with `{ args, value, values,translate, ...props }` as argument. For instance:

```jsx
const message = ({ translate }) => translate('myroot.validation.email_invalid');
const validateEmail = email(message);
```

## Per Input Validation: Custom Function Validator

You can also define your own validator functions. These functions should return `undefined` when there is no error, or an error string.


```jsx
const required = (message = 'Required') =>
    value => value ? undefined : message;
const maxLength = (max, message = 'Too short') =>
    value => value && value.length > max ? message : undefined;
const number = (message = 'Must be a number') =>
    value => value && isNaN(Number(value)) ? message : undefined;
const minValue = (min, message = 'Too small') =>
    value => value && value < min ? message : undefined;

const ageValidation = (value, allValues) => {
    if (!value) {
        return 'The age is required';
    }
    if (value < 18) {
        return 'Must be over 18';
    }
    return undefined;
};

const validateFirstName = [required(), maxLength(15)];
const validateAge = [required(), number(), ageValidation];

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput label="First Name" source="firstName" validate={validateFirstName} />
            <TextInput label="Age" source="age" validate={validateAge}/>
        </SimpleForm>
    </Create>
);
```

React-admin will combine all the input-level functions into a single function looking just like the previous one.

Input validation functions receive the current field value and the values of all fields of the current record. This allows for complex validation scenarios (e.g. validate that two passwords are the same).

**Tip**: If your admin has multi-language support, validator functions should return message *identifiers* rather than messages themselves. React-admin automatically passes these identifiers to the translation function: 

```jsx
// in validators/required.js
const required = () => (value, allValues, props) =>
    value
        ? undefined
        : 'myroot.validation.required';

// in i18n/en.json
export default {
    myroot: {
        validation: {
            required: 'Required field',
        }
    }
}
```

If the translation depends on a variable, the validator can return an object rather than a translation identifier:

```jsx
// in validators/minLength.js
const minLength = (min) => (value, allValues, props) => 
    value.length >= min
        ? undefined
        : { message: 'myroot.validation.minLength', args: { min } };

// in i18n/en.js
export default {
    myroot: {
        validation: {
            minLength: 'Must be %{min} characters at least',
        }
    }
}
```

See the [Translation documentation](Translation.md#translation-messages) for details.

**Tip**: Make sure to define validation functions or array of functions in a variable outside your component, instead of defining them directly in JSX. This can result in a new function or array at every render, and trigger infinite rerender.

{% raw %}
```jsx
const validateStock = [required(), number(), minValue(0)];

export const ProductEdit = () => (
    <Edit>
        <SimpleForm defaultValues={{ stock: 0 }}>
            ...
            {/* do this */}
            <NumberInput source="stock" validate={validateStock} />
            {/* don't do that */}
            <NumberInput source="stock" validate={[required(), number(), minValue(0)]} />
            ...
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

**Tip**: The props of your Input components are passed to a `react-hook-form` [useController](https://react-hook-form.com/api/usecontroller) hook.

**Tip**: You can use *both* Form validation and input validation.

**Tip**: The custom validator function can return a promise, e.g. to use server-side validation. See next section for details.

## Async Validation

You can validate the entire form by returning a Promise in the form `validate` function. For instance:

```jsx
const validateUserCreation = async (values) => {
    const errors = {};
    if (!values.firstName) {
        errors.firstName = 'The firstName is required';
    }
    if (!values.age) {
        errors.age = 'The age is required';
    } else if (values.age < 18) {
        errors.age = 'Must be over 18';
    }

    const isEmailUnique = await checkEmailIsUnique(values.email);
    if (!isEmailUnique) {
        // Return a message directly
        errors.email = 'Email already used';
        // Or a translation key
        errors.email = 'myapp.validation.email_not_unique';
        // Or an object if the translation needs parameters
        errors.email = {
            message: 'myapp.validation.email_not_unique',
            args: { email: values.email }
        };
    }
    return errors
};

export const UserCreate = () => (
    <Create>
        <SimpleForm validate={validateUserCreation}>
            <TextInput label="First Name" source="firstName" />
            <TextInput label="Email" source="email" />
            <TextInput label="Age" source="age" />
        </SimpleForm>
    </Create>
);
```

Per Input validators can also return a Promise to call the server for validation. For instance:

```jsx
const validateEmailUnicity = async (value) => {
    const isEmailUnique = await checkEmailIsUnique(value);
    if (!isEmailUnique) {
        return 'Email already used';

        // You can return a translation key as well
        return 'myroot.validation.email_already_used';

        // Or even an object just like the other validators
        return { message: 'myroot.validation.email_already_used', args: { email: value } }

    }

    return undefined;
};

const emailValidators = [required(), validateEmailUnicity];

export const UserCreate = () => (
    <Create>
        <SimpleForm validate={validateUserCreation}>
            ...
            <TextInput label="Email" source="email" validate={emailValidators} />
            ...
        </SimpleForm>
    </Create>
);
```

## Schema Validation

`react-hook-form` supports schema validation with many libraries through its [`resolver` props](https://react-hook-form.com/api/useform#validationResolver). To use it, follow their [resolvers documentation](https://github.com/react-hook-form/resolvers). Here's an example using `yup`:

```jsx
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SimpleForm, TextInput, NumberInput } from 'react-admin';

const schema = yup
    .object()
    .shape({
        name: yup.string().required(),
        age: yup.number().required(),
    })
    .required();

const CustomerCreate = () => (
    <Create>
        <SimpleForm resolver={yupResolver(schema)}>
            <TextInput source="name" />
            <NumberInput source="age" />
        </SimpleForm>
    </Create>
);
```

## Server-Side Validation

You can use the errors returned by the dataProvider mutation as a source for the validation. In order to display the validation errors, a custom `save` function needs to be used:

{% raw %}
```jsx
import * as React from 'react';
import { useCallback } from 'react';
import { Create, SimpleForm, TextInput, useCreate } from 'react-admin';

export const UserCreate = () => {
    const [create] = useCreate();
    const save = useCallback(
        async values => {
            try {
                await create('users', { data: values }, { returnPromise: true });
            } catch (error) {
                if (error.body.errors) {
                    // The shape of the returned validation errors must match the shape of the form
                    return error.body.errors;
                }
            }
        },
        [create]
    );

    return (
        <Create>
            <SimpleForm onSubmit={save}>
                <TextInput label="First Name" source="firstName" />
                <TextInput label="Age" source="age" />
            </SimpleForm>
        </Create>
    );
};
```
{% endraw %}

**Tip**: The shape of the returned validation errors must correspond to the form: a key needs to match a `source` prop.

**Tip**: The returned validation errors might have any validation format we support (simple strings or object with message and args) for each key.
