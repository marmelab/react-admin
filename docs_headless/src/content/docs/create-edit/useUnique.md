---
title: "useUnique"
---

Validating the uniqueness of a field is a common requirement so React-admin provides the `useUnique` hook that returns a validator for this use case.

It will call the [`dataProvider.getList`](../data-fetching/DataProviderWriting.md#getlist) method with a filter to check whether a record exists with the current value of the input for the field matching the input source.

<video controls autoplay playsinline muted loop>
  <source src="../img/useUnique.webm" type="video/webm"/>
  <source src="../img/useUnique.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

```js
import { Form, useUnique } from 'ra-core';
import { TextInput } from '../components';

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <Form>
            <div>
                <TextInput source="username" validate={unique()} />
            </div>
        </Form>
    );
};
```

## Parameters

`useUnique` accepts an object with the following keys, all optional: 

| Key                     | Type     | Default                | Description                                                          |
| ----------------------- | -------- | ---------------------- | -------------------------------------------------------------------- |
| [`message`](#message)   | `string` | `ra.validation.unique` | A custom message to display when the validation fails                |
| [`debounce`](#debounce) | `number` | 1000                   | The number of milliseconds to wait for new changes before validating |
| [`filter`](#filter)     | `object` | -                      | Additional filters to pass to the `dataProvider.getList` call        |
| [`resource`](#resource) | `string` | current from Context   | The resource targeted by the `dataProvider.getList` call             |

## `message`

A custom message to display when the validation fails. Defaults to `Must be unique` (translation key: `ra.validation.unique`).
It accepts a translation key. The [`translate` function](../i18n/useTranslate.md) will be called with the following parameters:
- `source`: the input name
- `label`: the translated input label
- `value`: the current input value

```jsx
import { Form, useUnique } from 'ra-core';
import { TextInput } from '../components';
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
        <Form>
            <div>
                <TextInput source="username" validate={unique({ message: 'myapp.validation.unique' })} />
            </div>
        </Form>
    );
};
```

## `debounce`

The number of milliseconds to wait for new changes before actually calling the [`dataProvider.getList`](../data-fetching/DataProviderWriting.md#getlist) method.


```jsx
import { Form, useUnique } from 'ra-core';
import { TextInput } from '../components';

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <Form>
            <div>
                <TextInput source="username" validate={unique({ debounce: 2000 })} />
            </div>
        </Form>
    );
};
```

## `resource`

The resource targeted by the [`dataProvider.getList`](../data-fetching/DataProviderWriting.md#getlist) call. Defaults to the resource from the nearest [`ResourceContext`](../app-configuration/Resource.md#resource-context).

This can be useful for custom pages instead of setting up a [`ResourceContext`](../app-configuration/Resource.md#resource-context).

```jsx
import { Form, useUnique } from 'ra-core';
import { PasswordInput, TextInput } from '../components';

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <Form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <TextInput source="username" validate={unique({ resource: 'users' })} />
                <PasswordInput source="password" />
            </div>
        </Form>
    );
};
```

## `filter`

Additional filters to pass to the [`dataProvider.getList`](../data-fetching/DataProviderWriting.md#getlist) method. This is useful when the value should be unique across a subset of the resource records, for instance, usernames in an organization:

```jsx
import { FormDataConsumer, Form, useUnique, ReferenceInputBase } from 'ra-core';
import { SelectInput, TextInput } from '../components';

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <Form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <ReferenceInputBase source="organization_id" reference="organizations">
                    <SelectInput source="name" />
                </ReferenceInputBase>
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
            </div>
        </Form>
    );
};
```
