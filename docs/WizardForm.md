---
layout: default
title: "WizardForm"
---

# `<WizardForm>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" alt="React Admin Enterprise Edition icon" /> component offers an alternative layout for large Create forms, allowing users to enter data step-by-step.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-wizard-form-overview.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

`<WizardForm>` renders one step at a time. The form is submitted when the user clicks on the `Save` button of the last step.

## Usage

Use `<WizardForm>` as the child of `<Create>`. It expects `<WizardForm.Step>` elements as children.

```tsx
import { Create, TextInput, required } from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';

const PostCreate = () => (
    <Create>
        <WizardForm>
            <WizardForm.Step label="First step">
                <TextInput source="title" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step label="Second step">
                <TextInput source="description" />
            </WizardForm.Step>
            <WizardForm.Step label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```

**Note**: You can also use the `<WizardForm>` as child of `<Edit>` but it's considered as a bad practice to provide a wizard form for existing resources.

**Tip**: You can use the `<AutoSave>` component to automatically save the form after a few seconds of inactivity. See [the AutoSave documentation](./AutoSave.md) for details.

## Props

The `<WizardForm>` component accepts the following props:

| Prop                     | Required | Type              | Default | Description                                                |
| ------------------------ | -------- | ----------------- | ------- | ---------------------------------------------------------- |
| `authorizationError`     | Optional | `ReactNode`       | `null`  | The content to display when authorization checks fail                    |
| `children`               | Required | `ReactNode`       | -       | A list of `<WizardForm.Step>` elements.                   |
| `defaultValues`          | Optional | `object|function` | -       | The default values of the record.                          |
| `enableAccessControl`    | Optional | `boolean`         | `false` | Enable checking authorization rights for each panel and input            |
| `id`                     | Optional | `string`          | -       | The id of the underlying `<form>` tag.                     |
| `loading`                | Optional | `ReactNode`       |         | The content to display when checking authorizations                      |
| `noValidate`             | Optional | `boolean`         | -       | Set to `true` to disable the browser's default validation. |
| `onSubmit`               | Optional | `function`        | `save`  | A callback to call when the form is submitted.             |
| `progress`               | Optional | `ReactElement`    | -       | A custom progress stepper element.                         |
| `sanitize EmptyValues`    | Optional | `boolean`         | -       | Set to `true` to remove empty values from the form state.  |
| `toolbar`                | Optional | `ReactElement`    | -       | A custom toolbar element.                                  |
| `validate`               | Optional | `function`        | -       | A function to validate the form values.                    |
| `warnWhen UnsavedChanges` | Optional | `boolean`         | -       | Set to `true` to warn the user when leaving the form with unsaved changes. |


Additional props are passed to `react-hook-form`'s [`useForm` hook](https://react-hook-form.com/docs/useform).

## `authorizationError`

Used when `enableAccessControl` is set to `true` and an error occurs while checking for users permissions. Defaults to `null`:


{% raw %}
```tsx
import { ArrayInput, Edit, DateInput, SimpleFormIterator, TextInput } from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';
import { Alert } from '@mui/material';

const CustomerEdit = () => (
    <Edit>
        <WizardForm
            enableAccessControl
            authorizationError={
                <Alert
                    severity="error"
                    sx={{ px: 2.5, py: 1, mt: 1, width: '100%' }}
                >
                    An error occurred while loading your permissions
                </Alert>
            }
        >
            <WizardForm.Step id="identity">
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step id="occupations">
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </WizardForm.Step>
        </WizardForm>
    </Edit>
);
```
{% endraw %}

## `children`

The children of `<WizardForm>` must be `<WizardForm.Step>` elements.

```tsx
const PostCreate = () => (
    <Create>
        <WizardForm>
            <WizardForm.Step label="First step">
                ...
            </WizardForm.Step>
            <WizardForm.Step label="Second step">
                ...
            </WizardForm.Step>
            <WizardForm.Step label="Third step">
                ...
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```

## `defaultValues`

The value of the form `defaultValues` prop is an object, or a function returning an object, specifying default values for the created record. For instance:

```jsx
const postDefaultValue = () => ({ id: uuid(), created_at: new Date(), nb_views: 0 });

export const PostCreate = () => (
    <Create>
        <WizardForm defaultValues={postDefaultValue}>
            <WizardForm.Step>
                <TextInput source="title" />
                <RichTextInput source="body" />
                <NumberInput source="nb_views" />
                <SaveButton />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```

**Tip**: You can include properties in the form `defaultValues` that are not listed as input components, like the `created_at` property in the previous example.

**Tip**: React-admin also allows to define default values at the input level. See the [Setting default Values](./Forms.md#default-values) section.

## `enableAccessControl`

When set to `true`, React-admin will call the `authProvider.canAccess` method for each panel with the following parameters:
- `action`: `write`
- `resource`: `RESOURCE_NAME.section.PANEL_ID_OR_LABEL`. For instance: `customers.section.identity`
- `record`: The current record

For each panel, react-admin will also call the `authProvider.canAccess` method for each input with the following parameters:
- `action`: `write`
- `resource`: `RESOURCE_NAME.INPUT_SOURCE`. For instance: `customers.first_name`
- `record`: The current record

**Tip**: `<WizardForm.Step>` direct children that don't have a `source` will always be displayed.

```tsx
import { 
    ArrayInput,
    Edit,
    DateInput,
    SimpleFormIterator,
    TextInput
} from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';

const CustomerEdit = () => (
    <Edit>
        <WizardForm enableAccessControl>
            <WizardForm.Step id="identity">
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step id="occupations">
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </WizardForm.Step>
        </WizardForm>
    </Edit>
);
```

## `id`

Normally, a submit button only works when placed inside a `<form>` tag. However, you can place a submit button outside the form if the submit button `form` matches the form `id`.

Set this form `id` via the `id` prop.

```jsx
export const PostCreate = () => (
    <Create>
        <WizardForm defaultValues={postDefaultValue} id="post_create_form">
            <WizardForm.Step>
                <TextInput source="title" />
                <RichTextInput source="body" />
                <NumberInput source="nb_views" />
            </WizardForm.Step>
        </WizardForm>
        <SaveButton form="post_create_form" />
    </Create>
);
```

## `loading`

Used when `enableAccessControl` is set to `true` while checking for users permissions. Defaults to `Loading` from `react-admin`:

```tsx
import { ArrayInput, Edit, DateInput, SimpleFormIterator, TextInput } from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';
import { Typography } from '@mui/material';

const CustomerEdit = () => (
    <Edit>
        <WizardForm
            enableAccessControl
            loading={
                <Typography>
                    Loading your permissions...
                </Typography>
            }
        >
            <WizardForm.Step id="identity">
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step id="occupations">
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </WizardForm.Step>
        </WizardForm>
    </Edit>
);
```

## `noValidate`

The `<form novalidate>` attribute prevents the browser from validating the form. This is useful if you don't want to use the browser's default validation, or if you want to customize the error messages. To set this attribute on the underlying `<form>` tag, set the `noValidate` prop to `true`.

```jsx
const PostCreate = () => (
    <Create>
        <WizardForm noValidate>
            ...
        </WizardForm>
    </Create>
);
```

## `onSubmit`

By default, the `<Form>` calls the `save` callback passed to it by the edit or create controller, via the `SaveContext`. You can override this behavior by setting a callback as the `onSubmit` prop manually.

```jsx
export const PostCreate = () => {
    const [create] = useCreate();
    const postSave = (data) => {
        create('posts', { data });
    };
    return (
        <Create>
            <WizardForm onSubmit={postSave}>
                ...
            </WizardForm>
        </Create>
    );
};
```

## `progress`

You can also customize the progress stepper by passing a custom component in the `progress` prop.

{% raw %}
```tsx
import React from 'react';
import { Create, TextInput, required } from 'react-admin';
import { WizardForm, WizardFormProgressProps, useWizardFormContext } from '@react-admin/ra-form-layout';

const MyProgress = (props: WizardFormProgressProps) => {
    const { currentStep, steps } = useWizardFormContext(props);
    return (
        <ul>
            {steps.map((step, index) => {
                const label = React.cloneElement(step, { intent: 'label' });
                return (
                    <li key={`step_${index}`}>
                        <span
                            style={{
                                textDecoration:
                                    currentStep === index
                                        ? 'underline'
                                        : undefined,
                            }}
                        >
                            {label}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

const PostCreate = () => (
    <Create>
        <WizardForm progress={<MyProgress />}>
            <WizardForm.Step label="First step">
                <TextInput source="title" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step label="Second step">
                <TextInput source="description" />
            </WizardForm.Step>
            <WizardForm.Step label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```
{% endraw %}

Any additional props will be passed to the `<Progress>` component.

You can also hide the progress stepper completely by setting `progress` to `false`.

```tsx
import React from 'react';
import { Create, TextInput, required } from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';

const PostCreate = () => (
    <Create>
        <WizardForm progress={false}>
            <WizardForm.Step label="First step">
                <TextInput source="title" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step label="Second step">
                <TextInput source="description" />
            </WizardForm.Step>
            <WizardForm.Step label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
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
const PostCreate = () =>  (
    <Create>
        <WizardForm sanitizeEmptyValues>
            ...
        </WizardForm>
    </Create>
);
```

For the previous example, the data sent to the `dataProvider` will be:

```jsx
{
    id: 1234,
    title: 'Lorem Ipsum',
}
```

**Note:** Setting the `sanitizeEmptyValues` prop to `true` will also have a (minor) impact on react-admin inputs (like `<TextInput>`, `<NumberInput>`, etc.): empty values (i.e. values equal to `null`) will be removed from the form state on submit, unless the record actually had a value for that field.

**Note** Even with `sanitizeEmptyValues` set to `true`, deeply nested fields won't be set to `null` nor removed. If you need to sanitize those fields, use [the `transform` prop](./Edit.md#transform) of `<Edit>` or `<Create>` components.

If you need a more fine-grained control over the sanitization, you can use [the `transform` prop](./Edit.md#transform) of `<Edit>` or `<Create>` components, or [the `parse` prop](./Inputs.md#parse) of individual inputs.

## `toolbar`

You can customize the form toolbar by passing a custom component in the `toolbar` prop.

```tsx
import { Button } from '@mui/material';
import React from 'react';
import { Create, required, TextInput, useSaveContext } from 'react-admin';
import { useFormState } from 'react-hook-form';
import { useWizardFormContext, WizardForm } from '@react-admin/ra-form-layout';

const MyToolbar = () => {
    const { hasNextStep, hasPreviousStep, goToNextStep, goToPreviousStep } =
        useWizardFormContext();
    const { save } = useSaveContext();
    const { isValidating } = useFormState();

    return (
        <ul>
            {hasPreviousStep ? (
                <li>
                    <Button onClick={() => goToPreviousStep()}>PREVIOUS</Button>
                </li>
            ) : null}
            {hasNextStep ? (
                <li>
                    <Button
                        disabled={isValidating}
                        onClick={() => goToNextStep()}
                    >
                        NEXT
                    </Button>
                </li>
            ) : (
                <li>
                    <Button disabled={isValidating} onClick={save}>
                        SAVE
                    </Button>
                </li>
            )}
        </ul>
    );
};

const PostCreate = () => (
    <Create>
        <WizardForm toolbar={<MyToolbar />}>
            <WizardForm.Step label="First step">
                <TextInput source="title" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step label="Second step">
                <TextInput source="description" />
            </WizardForm.Step>
            <WizardForm.Step label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```

## `validate`

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
        <WizardForm validate={validateUserCreation}>
            <WizardForm.Step>
                <TextInput label="First Name" source="firstName" />
                <TextInput label="Age" source="age" />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```

**Tip**: The `validate` function can return a promise for asynchronous validation. See [the Server-Side Validation section](./Validation.md#server-side-validation) in the Validation documentation.

**Tip**: React-admin also allows to define validation rules at the input level. See [the Validation chapter](./Validation.md#per-input-validation-built-in-field-validators) for details.

## `warnWhenUnsavedChanges`

React-admin keeps track of the form state, so it can detect when the user leaves an `Edit` or `Create` page with unsaved changes. To avoid data loss, you can use this ability to ask the user to confirm before leaving a page with unsaved changes. 

![Warn About Unsaved Changes](./img/warn_when_unsaved_changes.png)

Warning about unsaved changes is an opt-in feature: you must set the `warnWhenUnsavedChanges` prop in the form component to enable it:

```jsx
export const TagEdit = () => (
    <Edit>
        <WizardForm warnWhenUnsavedChanges>
            ...
        </WizardForm>
    </Edit>
);
```

**Note**: Due to limitations in react-router, this feature only works if you use the default router provided by react-admin, or if you use a [Data Router](https://reactrouter.com/en/6.22.3/routers/picking-a-router).

## `<WizardForm.Step>`

The `label` prop of the `<WizardForm.Step>` component accepts a translation key:

```tsx
import React from 'react';
import { Create, TextInput, required } from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';

const PostCreate = () => (
    <Create>
        <WizardForm>
            <WizardForm.Step label="myapp.posts.steps.general">
                <TextInput source="title" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step label="myapp.posts.steps.description">
                <TextInput source="description" />
            </WizardForm.Step>
            <WizardForm.Step label="myapp.posts.steps.misc">
                <TextInput source="fullDescription" validate={required()} />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```

The children of `<WizardForm>` must be `<WizardForm.Step>` elements.

### Props


| Prop                  | Required | Type        | Default | Description                                                                          |
| --------------------- | -------- | ----------- | ------- | ------------------------------------------------------------------------------------ |
| `authorizationError`  | Optional | `ReactNode` | -       | The content to display when authorization checks fail                                |
| `enableAccessControl` | Optional | `ReactNode` | -       | Enable authorization checks                                                          |
| `label`               | Required | `string`    | -       | The main label used as the step title. Appears in red when the section has errors    |
| `loading`             | Optional | `ReactNode` | -       | The content to display while checking authorizations                                 |
| `children`            | Required | `ReactNode` | -       | A list of `<Input>` elements                                                         |
| `sx`                  | Optional | `object`    | -       | An object containing the MUI style overrides to apply to the root component          |

### `authorizationError`

Used when `enableAccessControl` is set to `true` and an error occurs while checking for users permissions. Defaults to `null`:

{% raw %}
```tsx
import { ArrayInput, Edit, DateInput, SimpleFormIterator, TextInput } from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';
import { Alert } from '@mui/material';

const CustomerEdit = () => (
    <Edit>
        <WizardForm enableAccessControl>
            <WizardForm.Step id="identity">
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step id="occupations" authorizationError={
                <Alert
                    severity="error"
                    sx={{ px: 2.5, py: 1, mt: 1, width: '100%' }}
                >
                    An error occurred while loading your permissions
                </Alert>
            }>
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </WizardForm.Step>
        </WizardForm>
    </Edit>
);
```
{% endraw %}


### `enableAccessControl`

When set to `true`, react-admin will also call the `authProvider.canAccess` method for each input with the following parameters:
- `action`: `write`
- `resource`: `RESOURCE_NAME.INPUT_SOURCE`. For instance: `customers.first_name`
- `record`: The current record

**Tip**: `<WizardForm.Step>` direct children that don't have a `source` will always be displayed.

```tsx
import { ArrayInput, Edit, DateInput, SimpleFormIterator, TextInput } from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';

const CustomerEdit = () => (
    <Edit>
        <WizardForm>
            <WizardForm.Step id="identity">
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step id="occupations" enableAccessControl>
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </WizardForm.Step>
        </WizardForm>
    </Edit>
);
```

### `loading`

Used when `enableAccessControl` is set to `true` while checking for users permissions. Defaults to `Loading` from `react-admin`:

```tsx
import { ArrayInput, Edit, DateInput, SimpleFormIterator, TextInput } from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';
import { Typography } from '@mui/material';

const CustomerEdit = () => (
    <Edit>
        <WizardForm enableAccessControl>
            <WizardForm.Step id="identity" loading={
                <Typography>
                    Loading your permissions...
                </Typography>
            }>
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step id="occupations" loading={
                <Typography>
                    Loading your permissions...
                </Typography>
            }>
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </WizardForm.Step>
        </WizardForm>
    </Edit>
);
```

## Adding a Summary Final Step

In order to add a final step with a summary of the form values before submit, you can leverage `react-hook-form` [`useWatch`](https://react-hook-form.com/docs/usewatch) hook:

```tsx
const FinalStepContent = () => {
    const values = useWatch({
        name: ['title', 'description', 'fullDescription'],
    });

    return values?.length > 0 ? (
        <>
            <Typography>title: {values[0]}</Typography>
            <Typography>description: {values[1]}</Typography>
            <Typography>fullDescription: {values[2]}</Typography>
        </>
    ) : null;
};

const PostCreate = () => (
    <Create>
        <WizardForm>
            <WizardForm.Step label="First step">
                <TextInput source="title" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step label="Second step">
                <TextInput source="description" />
            </WizardForm.Step>
            <WizardForm.Step label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step label="">
                <FinalStepContent />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```

## Access Control

`<WizardForm>` can use [Access Control](./Permissions.md#access-control) to check permissions for each section and input. To enable this feature, set the `enableAccessControl` prop to `true`.

Check the [`enableAccessControl` prop](#enableaccesscontrol) section for more details.

```tsx
import { 
    ArrayInput,
    Edit,
    DateInput,
    SimpleFormIterator,
    TextInput
} from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';

const CustomerEdit = () => (
    <Edit>
        <WizardForm enableAccessControl>
            <WizardForm.Step id="identity">
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step id="occupations">
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </WizardForm.Step>
        </WizardForm>
    </Edit>
);
```
