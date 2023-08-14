---
layout: default
title: "useUnique"
---

# `useUnique`

Validating the uniqueness of a field is a common requirement so React-admin provides the `useUnique` hook that returns a validator for this use case.

It will call the [`dataProvider.getList`](./DataProviderWriting.md#request-format) method with a filter to check whether a record exists with the current value of the input for the field matching the input source.

<video controls autoplay playsinline muted loop>
  <source src="./img/useUnique.webm" type="video/webm"/>
  <source src="./img/useUnique.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

```js
import { SimpleForm, TextInput, useUnique } from 'react-admin';

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <SimpleForm>
            <TextInput source="username" validate={unique()} />
        </SimpleForm>
    );
};
```

## Options

| Option              | Required | Type           | Default  | Description                                                                        |
| ------------------- | -------- | -------------- | -------- | ---------------------------------------------------------------------------------- |
| `message`           | Optional | `string`       | `ra.validation.unique` | A custom message to display when the validation fails                |
| `debounce`          | Optional | `number`       | 1000                   | The number of milliseconds to wait for new changes before validating |
| `filter`            | Optional | `object`       | -                      | Additional filters to pass to the `dataProvider.getList` call        |
| `resource`          | Optional | `string`       | current from Context   | The resource targeted by the `dataProvider.getList` call             |

## `message`

A custom message to display when the validation fails. Defaults to `Must be unique` (translation key: `ra.validation.unique`).
It accepts a translation key. The [`translate` function](./useTranslate.md) will be called with the following parameters:
- `source`: the input name
- `label`: the translated input label
- `value`: the current input value

```jsx
import { SimpleForm, TextInput, useUnique } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const i18nProvider = polyglotI18nProvider(() =>
    mergeTranslations(englishMessages, {
        myapp: {
            validation: {
                unique: 'Value %{value} is already used for %{field}',
            },
        },
    })
);

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <SimpleForm>
            <TextInput source="username" validate={unique({ message: 'myapp.validation.unique' })} />
        </SimpleForm>
    );
};
```

## `debounce`

The number of milliseconds to wait for new changes before actually calling the [`dataProvider.getList`](./DataProviderWriting.md#request-format) method.


```jsx
import { SimpleForm, TextInput, useUnique } from 'react-admin';

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <SimpleForm>
            <TextInput source="username" validate={unique({ debounce: 2000 })} />
        </SimpleForm>
    );
};
```

## `resource`

The resource targeted by the [`dataProvider.getList`](./DataProviderWriting.md#request-format) call. Defaults to the resource from the nearest [`ResourceContext`](./Resource.md#resource-context).

This can be useful for custom pages instead of setting up a [`ResourceContext`](./Resource.md#resource-context).

```jsx
import { PasswordInput, SimpleForm, TextInput, useUnique } from 'react-admin';

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <SimpleForm>
            <TextInput source="username" validate={unique({ resource: 'users' })} />
            <PasswordInput source="password" />
        </SimpleForm>
    );
};
```

## `filter`

Additional filters to pass to the [`dataProvider.getList`](./DataProviderWriting.md#request-format) method. This is useful when the value should be unique across a subset of the resource records, for instance, usernames in an organization:

```jsx
import { FormDataConsumer, ReferenceInput, SimpleForm, TextInput, useUnique } from 'react-admin';

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <SimpleForm>
            <ReferenceInput source="organization_id" reference="organizations" />
            <FormDataConsumer>
                {({ formData }) => (
                    <TextInput
                        source="username"
                        validate={unique({
                            filter: {
                                organization_id: formData.organization_id,
                            },
                        })}
                    />
                )}
            </FormDataConsumer>
        </SimpleForm>
    );
};
```
