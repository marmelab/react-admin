---
layout: default
title: "Form Validation"
---

# Form Validation

To validate a form, you can add `validation` props to the form component (`<Edit>` and `<Create>`), to individual inputs, or even mix both approaches.

## Global Form Validation

The value of the form `validation` prop must be a function taking the record as input, and returning an object with error messages indexed by field. For instance:

``` js
const createValidation = (values) => {
    const errors = {};
    if (!values.firstName) {
        errors.firstName = ['The firstName is required'];
    }
    if (!values.age) {
        errors.age = ['The age is required'];
    } else if (values.age < 18) {
        errors.age = ['Must be over 18'];
    }
    return errors
};

export const UserCreate = (props) => (
    <Create {...props} validation={createValidation}>
        <TextInput label="First Name" source="firstName" />
        <TextInput label="Age" source="age" />
    </Create>
);
```

## Per Field Form Validation: Function Validator

Alternatively, you can specify a `validation` prop directly in `<Input>` components. Admin-on-rest will mash all the individual functions up to a single function looking just like the previous one:

```js
const firstNameValidation = (value, values) => {
    if (!value) {
        return ['The firstName is required'];
    }
    return [];
};

const ageValidation = (value, values) => {
    if (!value) {
        return ['The age is required'];
    }
    if (age < 18) {
        return ['Must be over 18'];
    }
    return [];
}

export const UserCreate = (props) => (
    <Create {...props}>
        <TextInput label="First Name" source="firstName" validation={firstNameValidation} />
        <TextInput label="Age" source="age" validation={ageValidation}/>
    </Create>
);
```

Input validation functions receive the current field value, and the values of all fields of the current record. This allows for complex validation scenarios (e.g. validate that two passwords are the same).

**Tip**: You can use *both* Form validation and input validation.

## Per Field Form Validation: Constraints Object

Validation constraints often look the same: asserting presence, size, format, etc. Instead of passing a function as validation, you can pass a constraints object:

{% raw %}
```js
export const UserCreate = (props) => (
    <Create {...props}>
        <TextInput label="First Name" source="firstName" validation={{ required: true }} />
        <TextInput label="Age" source="age" validation={{ required: true, min: 18 }}/>
    </Create>
);
```
{% endraw %}

As Admin-on-rest translates these constraints objects to functions, the result is the same as before.

## Constraints Reference

You can use the following validation constraint names:

* `required` if the field is mandatory,
* `min` to specify a minimum value for integers,
* `max` to specify a maximum value for integers,
* `minLength` to specify a minimum length for strings,
* `maxLength` to specify a maximum length for strings,
* `email` to check that the input is a valid email address,
* `regex` to validate that the input matches a regex (must be an object with `pattern` and `message` keys),
* `choices` to validate that the input is within a given list,
* `custom` to use the function of your choice,
