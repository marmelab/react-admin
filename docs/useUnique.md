---
layout: default
title: "useUnique"
---

# `useUnique`

Validating the uniqueness of a field is a common requirement so React-admin provides the `useUnique` hook that returns a validator for this use case.

It will call the `dataProvider.getList` method with a filter to check whether a record exists with the current value of the input for the field matching the input source.

## Usage

```js
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

### `message`

A custom message to display when the validation fails. Defaults to `Must be unique` (translation key: `ra.validation.unique`).
It accepts a translation key. The [`i18nProvider.translate` function] will be called with the following parameters:
- `source`: the input name
- `label`: the translated input label
- `value`: the current input value

```js
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

### `resource`

The resource targeted by the `dataProvider.getList` call. Defaults to the resource from the nearest `ResourceContext`.

### `filter`

Additional filters to pass to the `dataProvider.getList` method. This is useful when the value should be unique across a subset of the resource records, for instance, usernames in an organization:

```js
const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <SimpleForm>
            <ReferenceInput source="organization_id" reference="organizations">
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
