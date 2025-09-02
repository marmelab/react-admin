---
title: "<Form>"
---

`<Form>` is a headless component that creates a `<form>` to edit a record, and renders its children. Use it to build a custom form layout, or to use another UI kit than Material UI. 

`<Form>` reads the `record` from the `RecordContext`, uses it to initialize the defaultValues of a react-hook-form via `useForm`, turns the `validate` function info a react-hook-form compatible form validator, notifies the user when the input validation fails, and creates a form context via `<FormProvider>`. 

`<Form>` is used internally by `<SimpleForm>`, `<TabbedForm>`, and other form components.

## Usage

Use `<Form>` to build completely custom form layouts. Don't forget to include a submit button to actually save the record.

```jsx
import { CreateBase, Form } from 'ra-core';
import { TextInput } from './TextInput';

export const PostCreate = () => (
    <CreateBase>
        <Form>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <TextInput source="title" />
                </div>
                <div>
                    <TextInput source="author" />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <TextInput source="body" multiline />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <button type="submit">Save</button>
                </div>
            </div>
        </Form>
    </CreateBase>
);
```

`<Form>` calls react-hook-form's `useForm` hook, and places the result in a `FormProvider` component. This means you can take advantage of the [`useFormContext`](https://react-hook-form.com/docs/useformcontext) and [`useFormState`](https://react-hook-form.com/docs/useformstate) hooks to access the form state.

## Props

Here are all the props you can set on the `<Form>` component:

| Prop                             | Required | Type       | Default   | Description                                                                |
| -------------------------------- | -------- | ---------- | --------- | -------------------------------------------------------------------------- |
| `defaultValues`                  | Optional | `object    \| function` | -                                                                          | The default values of the record. |
| `id`                             | Optional | `string`   | -         | The id of the underlying `<form>` tag.                                     |
| `noValidate`                     | Optional | `boolean`  | -         | Set to `true` to disable the browser's default validation.                 |
| `onSubmit`                       | Optional | `function` | `save`    | A callback to call when the form is submitted.                             |
| `sanitizeEmptyValues`            | Optional | `boolean`  | -         | Set to `true` to remove empty values from the form state.                  |
| `validate`                       | Optional | `function` | -         | A function to validate the form values.                                    |
| `warnWhenUnsavedChanges`         | Optional | `boolean`  | -         | Set to `true` to warn the user when leaving the form with unsaved changes. |
| `disableInvalidFormNotification` | Optional | `boolean`  | -         | Set to `true` to disable the notification on submitting an invalid form.   |

Additional props are passed to [the `useForm` hook](https://react-hook-form.com/docs/useform).

## `defaultValues`

The value of the form `defaultValues` prop is an object, or a function returning an object, specifying default values for the created record. For instance:

```jsx
import { CreateBase, Form } from 'ra-core';
import { TextInput, RichTextInput, NumberInput } from './inputs';

const postDefaultValue = () => ({ id: uuid(), created_at: new Date(), nb_views: 0 });

export const PostCreate = () => (
    <CreateBase>
        <Form defaultValues={postDefaultValue}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                <TextInput source="title" />
                <RichTextInput source="body" />
                <NumberInput source="nb_views" />
                <button type="submit">Save</button>
            </div>
        </Form>
    </CreateBase>
);
```

**Tip**: You can include properties in the form `defaultValues` that are not listed as input components, like the `created_at` property in the previous example.

**Tip**: React-admin also allows to define default values at the input level. See the [Setting default Values](../guides/Form.md#default-values) section.

## `id`

Normally, a submit button only works when placed inside a `<form>` tag. However, you can place a submit button outside the form if the submit button `form` matches the form `id`.

Set this form `id` via the `id` prop.

```jsx
import { CreateBase, Form } from 'ra-core';
import { TextInput, RichTextInput, NumberInput } from './inputs';

export const PostCreate = () => (
    <CreateBase>
        <Form defaultValues={postDefaultValue} id="post_create_form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                <TextInput source="title" />
                <RichTextInput source="body" />
                <NumberInput source="nb_views" />
            </div>
        </Form>
        <button type="submit" form="post_create_form">Save</button>
    </CreateBase>
);
```

## `noValidate`

The `<form novalidate>` attribute prevents the browser from validating the form. This is useful if you don't want to use the browser's default validation, or if you want to customize the error messages. To set this attribute on the underlying `<form>` tag, set the `noValidate` prop to `true`.

```jsx
import { CreateBase, Form } from 'ra-core';

const PostCreate = () => (
    <CreateBase>
        <Form noValidate>
            ...
        </Form>
    </CreateBase>
);
```

## `onSubmit`

By default, the `<Form>` calls the `save` callback passed to it by the edit or create controller, via the `SaveContext`. You can override this behavior by setting a callback as the `onSubmit` prop manually.

```jsx
import { CreateBase, Form, useCreate } from 'ra-core';

export const PostCreate = () => {
    const [create] = useCreate();
    const postSave = (data) => {
        create('posts', { data });
    };
    return (
        <CreateBase>
            <Form onSubmit={postSave}>
                ...
            </Form>
        </CreateBase>
    );
};
```

## `sanitizeEmptyValues`

In HTML, the value of empty form inputs is the empty string (`''`). React-admin inputs (like `<TextInput>`, `<NumberInput>`, etc.) automatically transform these empty values into `null`.

But for your own input components based on react-hook-form, this is not the default. React-hook-form doesn't transform empty values by default. This leads to unexpected `create` and `update` payloads like:

```jsx
{
    id: 1234,
    title: 'Lorem Ipsum',
    is_published: '',
    body: '',
    // etc.
}
```

If you prefer to omit the keys for empty values, set the `sanitizeEmptyValues` prop to `true`. This will sanitize the form data before passing it to the `dataProvider`, i.e. remove empty strings from the form state, unless the record actually had a value for that field before edition.

```jsx
import { CreateBase, Form } from 'ra-core';

const PostCreate = () =>  (
    <CreateBase>
        <Form sanitizeEmptyValues>
            ...
        </Form>
    </CreateBase>
);
```

For the previous example, the data sent to the `dataProvider` will be:

```jsx
{
    id: 1234,
    title: 'Lorem Ipsum',
}
```

**Note** Even with `sanitizeEmptyValues` set to `true`, deeply nested fields won't be set to `null` nor removed. If you need to sanitize those fields, use [the `transform` prop](./EditBase.md#transform) of `<EditBase>` or `<CreateBase>` components.

If you need a more fine-grained control over the sanitization, you can use [the `transform` prop](./EditBase.md#transform) of `<EditBase>` or `<CreateBase>` components, or [the `parse` prop](../inputs/useInput.md#parse) of individual inputs.

## `validate`

The value of the form `validate` prop must be a function taking the record as input, and returning an object with error messages indexed by field. For instance:

```jsx
import { CreateBase, Form } from 'ra-core';
import { TextInput } from './TextInput';

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
    <CreateBase>
        <Form validate={validateUserCreation}>
            <TextInput label="First Name" source="firstName" />
            <TextInput label="Age" source="age" />
        </Form>
    </CreateBase>
);
```

**Tip**: The `validate` function can return a promise for asynchronous validation. See [the Server-Side Validation section](./Validation.md#server-side-validation) in the Validation documentation.

**Tip**: React-admin also allows to define validation rules at the input level. See [the Validation chapter](./Validation.md#per-input-validation-built-in-field-validators) for details.

## `warnWhenUnsavedChanges`

React-admin keeps track of the form state, so it can detect when the user leaves an `Edit` or `Create` page with unsaved changes. To avoid data loss, you can use this ability to ask the user to confirm before leaving a page with unsaved changes. 

![Warn About Unsaved Changes](../img/warn_when_unsaved_changes.png)

Warning about unsaved changes is an opt-in feature: you must set the `warnWhenUnsavedChanges` prop in the form component to enable it:

```jsx
import { EditBase, Form } from 'ra-core';

export const TagEdit = () => (
    <EditBase>
        <Form warnWhenUnsavedChanges>
            ...
        </Form>
    </EditBase>
);
```

**Note**: Due to limitations in react-router, this feature only works if you use the default router provided by react-admin, or if you use a [Data Router](https://reactrouter.com/en/6.22.3/routers/picking-a-router).

## Subscribing To Form Changes

`<Form>` relies on [react-hook-form's `useForm`](https://react-hook-form.com/docs/useform) to manage the form state and validation. You can subscribe to form changes using the [`useFormContext`](https://react-hook-form.com/docs/useformcontext) and [`useFormState`](https://react-hook-form.com/docs/useformstate) hooks.
 
**Reminder:** [react-hook-form's `formState` is wrapped with a Proxy](https://react-hook-form.com/docs/useformstate/#rules) to improve render performance and skip extra computation if specific state is not subscribed. So, make sure you deconstruct or read the `formState` before render in order to enable the subscription.

```js
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState      
```

## Linking Two Inputs

<iframe src="https://www.youtube-nocookie.com/embed/YkqjydtmfcU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

Edition forms often contain linked inputs, e.g. country and city (the choices of the latter depending on the value of the former).

React-admin relies on [react-hook-form](https://react-hook-form.com/) for form handling. You can grab the current form values using react-hook-form's [useWatch](https://react-hook-form.com/docs/usewatch) hook.

```jsx
import * as React from 'react';
import { EditBase, Form } from 'ra-core';
import { SelectInput } from './SelectInput';
import { useWatch } from 'react-hook-form';

const countries = ['USA', 'UK', 'France'];
const cities = {
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    UK: ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol'],
    France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
};
const toChoices = items => items.map(item => ({ id: item, name: item }));

const CityInput = () => {
    const country = useWatch({ name: 'country' });
    return (
        <SelectInput
            choices={country ? toChoices(cities[country]) : []}
            source="cities"
        />
    );
};

const OrderEdit = () => (
    <EditBase>
        <Form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                <SelectInput source="country" choices={toChoices(countries)} />
                <CityInput />
            </div>
        </Form>
    </EditBase>
);

export default OrderEdit;
```

**Tip:** If you'd like to avoid creating an intermediate component like `<CityInput>`, or are using an `<ArrayInput>`, you can use the [`<FormDataConsumer>`](../inputs/Inputs.md#linking-two-inputs) component as an alternative.
