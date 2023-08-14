---
layout: default
title: "AccordionForm"
---

# `<AccordionForm>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an alternative layout for Edit and Create forms, where Inputs are grouped into expandable panels.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-accordion-form-overview.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-accordion-form-overview.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Users can open or close each panel independently, and each panel has a header that gets highlighted when the section contains validation errors.

This form layout is useful for long forms, where users can focus on one section at a time.

## Usage

Use the `<AccordionForm>` component as a child of `<Edit>` or `<Create>`, and organize the content in `<AccordionForm.Panel>` elements:

```jsx
import {
    Edit,
    TextField,
    TextInput,
    DateInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    BooleanInput,
} from 'react-admin';
import { AccordionForm } from '@react-admin/ra-form-layout';

// don't forget the component="div" prop on the main component to disable the main Card
const CustomerEdit = () => (
    <Edit component="div">
        <AccordionForm autoClose>
            <AccordionForm.Panel label="Identity">
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="dob" label="born" validate={required()} />
                <SelectInput source="sex" choices={sexChoices} />
            </AccordionForm.Panel>
            <AccordionForm.Panel label="Occupations">
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </AccordionForm.Panel>
            <AccordionForm.Panel label="Preferences">
                <SelectInput
                    source="language"
                    choices={languageChoices}
                    defaultValue="en"
                />
                <BooleanInput source="dark_theme" />
                <BooleanInput source="accepts_emails_from_partners" />
            </AccordionForm.Panel>
        </AccordionForm>
    </Edit>
);
```

By default, each child accordion element handles its expanded state independently.

You can also use the `<AccordionSection>` component as a child of `<SimpleForm>` for secondary inputs:

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-accordion-section-overview.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-accordion-section-overview.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Check [the `ra-form-layout` documentation](https://marmelab.com/ra-enterprise/modules/ra-form-layout##accordionform) for more details.

## Props

Here are all the props you can set on the `<AccordionForm>` component:

| Prop                     | Required | Type              | Default | Description                                                |
| ------------------------ | -------- | ----------------- | ------- | ---------------------------------------------------------- |
| `autoClose`              | Optional | `boolean`         | -       | Set to `true` to close the current accordion when opening another one. |
| `children`               | Required | `ReactNode`       | -       | A list of `<AccordionForm.Panel>` elements.                   |
| `defaultValues`          | Optional | `object|function` | -       | The default values of the record.                          |
| `id`                     | Optional | `string`          | -       | The id of the underlying `<form>` tag.                     |
| `noValidate`             | Optional | `boolean`         | -       | Set to `true` to disable the browser's default validation. |
| `onSubmit`               | Optional | `function`        | `save`  | A callback to call when the form is submitted.             |
| `sanitize EmptyValues`    | Optional | `boolean`         | -       | Set to `true` to remove empty values from the form state.  |
| `toolbar`                | Optional | `ReactElement`    | -       | A custom toolbar element.                                  |
| `validate`               | Optional | `function`        | -       | A function to validate the form values.                    |
| `warnWhen UnsavedChanges` | Optional | `boolean`         | -       | Set to `true` to warn the user when leaving the form with unsaved changes. |


Additional props are passed to `react-hook-form`'s [`useForm` hook](https://react-hook-form.com/docs/useform).

## `autoClose`

When setting the `<AccordionForm autoClose>` prop, only one accordion remains open at a time. The first accordion is open by default, and when a user opens another one, the current open accordion closes.

```diff
import { Edit, TextField, TextInput, DateInput, SelectInput, ArrayInput, SimpleFormIterator, BooleanInput } from 'react-admin';
import { AccordionForm } from '@react-admin/ra-form-layout';

// don't forget the component="div" prop on the main component to disable the main Card
const CustomerEdit = (props: EditProps) => (
    <Edit {...props} component="div">
-       <AccordionForm>
+       <AccordionForm autoClose>
            <AccordionForm.Panel label="Identity" defaultExpanded>
                <TextField source="id" />
                ...
```

## `children`

The children of `<AccordionForm>` must be `<AccordionForm.Panel>` elements.

```jsx
const CustomerEdit = () => (
    <Edit component="div">
        <AccordionForm autoClose>
            <AccordionForm.Panel label="Identity">
                ...
            </AccordionForm.Panel>
            <AccordionForm.Panel label="Occupations">
                ...
            </AccordionForm.Panel>
            <AccordionForm.Panel label="Preferences">
                ...
            </AccordionForm.Panel>
        </AccordionForm>
    </Edit>
);
```

The component creates one panel per child, and uses the `label` prop as the panel summary.

## `defaultValues`

The value of the form `defaultValues` prop is an object, or a function returning an object, specifying default values for the created record. For instance:

```jsx
const postDefaultValue = () => ({ id: uuid(), created_at: new Date(), nb_views: 0 });

export const PostCreate = () => (
    <Create>
        <AccordionForm defaultValues={postDefaultValue}>
            <AccordionForm.Panel>
                <TextInput source="title" />
                <RichTextInput source="body" />
                <NumberInput source="nb_views" />
                <SaveButton />
            </AccordionForm.Panel>
        </AccordionForm>
    </Create>
);
```

**Tip**: You can include properties in the form `defaultValues` that are not listed as input components, like the `created_at` property in the previous example.

**Tip**: React-admin also allows to define default values at the input level. See the [Setting default Values](./EditTutorial.md#setting-default-values) section.

## `id`

Normally, a submit button only works when placed inside a `<form>` tag. However, you can place a submit button outside the form if the submit button `form` matches the form `id`.

Set this form `id` via the `id` prop.

```jsx
export const PostCreate = () => (
    <Create>
        <AccordionForm defaultValues={postDefaultValue} id="post_create_form">
            <AccordionForm.Panel>
                <TextInput source="title" />
                <RichTextInput source="body" />
                <NumberInput source="nb_views" />
            </AccordionForm.Panel>
        </AccordionForm>
        <SaveButton form="post_create_form" />
    </Create>
);
```

## `noValidate`

The `<form novalidate>` attribute prevents the browser from validating the form. This is useful if you don't want to use the browser's default validation, or if you want to customize the error messages. To set this attribute on the underlying `<form>` tag, set the `noValidate` prop to `true`.

```jsx
const PostCreate = () => (
    <Create>
        <AccordionForm noValidate>
            ...
        </AccordionForm>
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
            <AccordionForm onSubmit={postSave}>
                ...
            </AccordionForm>
        </Create>
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
const PostCreate = () =>  (
    <Create>
        <AccordionForm sanitizeEmptyValues>
            ...
        </AccordionForm>
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

If you need a more fine-grained control over the sanitization, you can use [the `transform` prop](./Edit.md#transform) of `<Edit>` or `<Create>` components, or [the `parse` prop](./Inputs.md#parse) of individual inputs.

## `toolbar`

You can customize the form Toolbar by passing a custom element in the `toolbar` prop. The form expects the same type of element as `<SimpleForm>`, see [the `<SimpleForm toolbar>` prop documentation](https://marmelab.com/react-admin/CreateEdit.html#toolbar) in the react-admin docs.

```jsx
import { Edit, SaveButton, Toolbar } from 'react-admin';
import { AccordionForm } from '@react-admin/ra-form-layout';

const CustomToolbar = props => (
    <Toolbar {...props}>
        <SaveButton label="Save and return" type="button" variant="outlined" />
    </Toolbar>
);

const CustomerEdit = () => (
    <Edit component="div">
        <AccordionForm toolbar={<CustomToolbar />}>
            <AccordionForm.Panel label="Identity">
                ...
            </AccordionForm.Panel>
            <AccordionForm.Panel label="Occupations">
                ...
            </AccordionForm.Panel>
            <AccordionForm.Panel label="Preferences">
                ...
            </AccordionForm.Panel>
        </AccordionForm>
    </Edit>
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
        <AccordionForm validate={validateUserCreation}>
            <AccordionForm.Panel>
                <TextInput label="First Name" source="firstName" />
                <TextInput label="Age" source="age" />
            </AccordionForm.Panel>
        </AccordionForm>
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
        <AccordionForm warnWhenUnsavedChanges>
            ...
        </AccordionForm>
    </Edit>
);
```

**Warning**: This feature only works if you have a dependency on react-router 6.3.0 **at most**. The react-router team disabled this possibility in react-router 6.4, so `warnWhenUnsavedChanges` will silently fail with react-router 6.4 or later.

## `<AccordionForm.Panel>`

The children of `<AccordionForm>` must be `<AccordionForm.Panel>` elements.

This component renders a [Material UI `<Accordion>` component](https://mui.com/components/accordion/). Children are rendered in a Stack, one child per row, just like for `<SimpleForm>`.

### Props

Here are all the props you can set on the `<AccordionForm.Panel>` component:

| Prop              | Required | Type        | Default | Description                                                                                      |
| ----------------- | -------- | ----------- | ------- | ------------------------------------------------------------------------------------------------ |
| `label`           | Required | `string`    | -       | The main label used as the accordion summary. Appears in red when the accordion has errors       |
| `children`        | Required | `ReactNode` | -       | A list of `<Input>` elements                                                                     |
| `secondary`       | Optional | `string`    | -       | The secondary label used as the accordion summary                                                |
| `defaultExpanded` | Optional | `boolean`   | `false` | Set to true to have the accordion expanded by default (except if autoClose = true on the parent) |
| `disabled`        | Optional | `boolean`   | `false` | If true, the accordion will be displayed in a disabled state.                                    |
| `square`          | Optional | `boolean`   | `false` | If true, rounded corners are disabled.                                                           |

```tsx
import {
    Edit,
    TextField,
    TextInput,
    DateInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    BooleanInput,
} from 'react-admin';
import { AccordionForm } from '@react-admin/ra-form-layout';

const CustomerEdit = () => (
    <Edit component="div">
        <AccordionForm>
            <AccordionForm.Panel label="Identity" defaultExpanded>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="dob" label="born" validate={required()} />
                <SelectInput source="sex" choices={sexChoices} />
            </AccordionForm.Panel>
        </AccordionForm>
    </Edit>
);
```

## `<AccordionSection>`

Renders children (Inputs) inside a Material UI `<Accordion>` element without a Card style. To be used as child of a `<SimpleForm>` or a `<TabbedForm>` element.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-accordion-section-overview.webm" type="video/webm"/>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-accordion-section-overview.mp4" type="video/mp4"/>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-accordion-section-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Prefer `<AccordionSection>` to `<AccordionForm>` to always display a list of important inputs, then offer accordions for secondary inputs.

### Props

Here are all the props you can set on the `<AccordionSection>` component:

| Prop               | Required | Type        | Default | Description                                                   |
| ------------------ | -------- | ----------- | ------- | ------------------------------------------------------------- |
| `Accordion`        | Optional | `Component` | -       | The component to use as the accordion.                        |
| `AccordionDetails` | Optional | `Component` | -       | The component to use as the accordion details.                |
| `AccordionSummary` | Optional | `Component` | -       | The component to use as the accordion summary.                |
| `label`            | Required | `string`    | -       | The main label used as the accordion summary.                 |
| `children`         | Required | `ReactNode` | -       | A list of `<Input>` elements                                  |
| `fullWidth`        | Optional | `boolean`   | `false` | If true, the Accordion take sthe entire form width.           |
| `className`        | Optional | `string`    | -       | A class name to style the underlying `<Accordion>`            |
| `secondary`        | Optional | `string`    | -       | The secondary label used as the accordion summary             |
| `defaultExpanded`  | Optional | `boolean`   | `false` | Set to true to have the accordion expanded by default         |
| `disabled`         | Optional | `boolean`   | `false` | If true, the accordion will be displayed in a disabled state. |
| `square`           | Optional | `boolean`   | `false` | If true, rounded corners are disabled.                        |

```tsx
import {
    Edit,
    TextField,
    TextInput,
    DateInput,
    SelectInput,
    ArrayInput,
    SimpleForm,
    SimpleFormIterator,
    BooleanInput,
} from 'react-admin';
import { AccordionSection } from '@react-admin/ra-form-layout';

const CustomerEdit = () => (
    <Edit component="div">
        <SimpleForm>
            <TextField source="id" />
            <TextInput source="first_name" validate={required()} />
            <TextInput source="last_name" validate={required()} />
            <DateInput source="dob" label="born" validate={required()} />
            <SelectInput source="sex" choices={sexChoices} />
            <AccordionSection label="Occupations" fullWidth>
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </AccordionSection>
            <AccordionSection label="Preferences" fullWidth>
                <SelectInput
                    source="language"
                    choices={languageChoices}
                    defaultValue="en"
                />
                <BooleanInput source="dark_theme" />
                <BooleanInput source="accepts_emails_from_partners" />
            </AccordionSection>
        </SimpleForm>
    </Edit>
);
```

## AutoSave

In forms where users may spend a lot of time, it's a good idea to save the form automatically after a few seconds of inactivity. You turn on this feature by using [the `<AutoSave>` component](./AutoSave.md).

{% raw %}
```tsx
import { AccordionForm, AutoSave } from '@react-admin/ra-form-layout';
import { Edit, TextInput, DateInput, SelectInput, Toolbar } from 'react-admin';

const AutoSaveToolbar = () => (
    <Toolbar>
        <AutoSave />
    </Toolbar>
);

const PersonEdit = () => (
    <Edit mutationMode="optimistic">
        <AccordionForm
            resetOptions={{ keepDirtyValues: true }}
            toolbar={<AutoSaveToolbar />}
        >
            <AccordionForm.Panel label="identity">
                <TextInput source="first_name" />
                <TextInput source="last_name" />
                <DateInput source="dob" />
                <SelectInput source="sex" choices={[
                    { id: 'male', name: 'Male' },
                    { id: 'female', name: 'Female' },
                ]}/>
            </AccordionForm.Panel>
        </AccordionForm>
    </Edit>
);
```
{% endraw %}

Note that you **must** set the `<AccordionForm resetOptions>` prop to `{ keepDirtyValues: true }`. If you forget that prop, any change entered by the end user after the autosave but before its acknowledgement by the server will be lost.

If you're using it in an `<Edit>` page, you must also use a `pessimistic` or `optimistic` [`mutationMode`](https://marmelab.com/react-admin/Edit.html#mutationmode) - `<AutoSave>` doesn't work with the default `mutationMode="undoable"`.

Check [the `<AutoSave>` component](./AutoSave.md) documentation for more details.

## Role-Based Access Control (RBAC)

Fine-grained permissions control can be added by using the [`<AccordionForm>`](./AuthRBAC.md#accordionform), [`<AccordionFormPanel>`](./AuthRBAC.md#accordionformpanel) and [`<AccordionSection>`](./AuthRBAC.md#accordionsection) components provided by the `@react-admin/ra-enterprise` package. 

{% raw %}
```tsx
import { AccordionForm } from '@react-admin/ra-enterprise';

const authProvider = {
    checkAuth: () => Promise.resolve(),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () =>Promise.resolve([
        // 'delete' is missing
        { action: ['list', 'edit'], resource: 'products' },
        { action: 'write', resource: 'products.reference' },
        { action: 'write', resource: 'products.width' },
        { action: 'write', resource: 'products.height' },
        // 'products.description' is missing
        { action: 'write', resource: 'products.thumbnail' },
        // 'products.image' is missing
        { action: 'write', resource: 'products.panel.description' },
        { action: 'write', resource: 'products.panel.images' },
        // 'products.panel.stock' is missing
    ]),
};

const ProductEdit = () => (
    <Edit>
        <AccordionForm>
            <AccordionForm.Panel name="description" label="Description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                <TextInput source="description" />
            </AccordionForm.Panel>
            <AccordionForm.Panel name="images" label="Images">
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </AccordionForm.Panel>
            <AccordionForm.Panel name="stock" label="Stock">
                <TextInput source="stock" />
            </AccordionForm.Panel>
            { /* delete button not displayed */ }
        </AccordionForm>
    </Edit>
);
```
{% endraw %}

Check [the RBAC `<AccordionForm>` component](./AuthRBAC.md#accordionform) documentation for more details.
