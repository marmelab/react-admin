---
layout: default
title: "SimpleForm"
---

# `<SimpleForm>`

The `<SimpleForm>` creates a `<form>` to edit a record, and renders its children (usually Input components) in a simple layout, one child per row.

<iframe src="https://www.youtube-nocookie.com/embed/QoNjUeLvQ2A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

## Usage

`<SimpleForm>` reads the `record` from the `RecordContext`, uses it to initialize the defaultValues of a `<Form>`, renders its children in a Material UI `<Stack>`, and renders a toolbar with a `<SaveButton>` that calls the `save` callback prepared by the edit or the create controller when pressed.

`<SimpleForm>` is often used as child of `<Create>` or `<Edit>`. It accepts Input and Field components as children. It relies on [react-hook-form](https://react-hook-form.com/) for form handling. It requires no prop by default.

```jsx
import { Create, SimpleForm, TextInput, NumberInput } from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
    </Create>
);
```

`<SimpleForm>` calls react-hook-form's `useForm` hook, and places the result in a `FormProvider` component. This means you can take advantage of the [`useFormContext`](https://react-hook-form.com/docs/useformcontext) and [`useFormState`](https://react-hook-form.com/docs/useformstate) hooks to access the form state.

## Props

Here are all the props you can set on the `<SimpleForm>` component:

| Prop                      | Required | Type               | Default | Description                                                |
| ------------------------- | -------- | ------------------ | ------- | ---------------------------------------------------------- |
| `children`                | Required | `element`          | -       | The form content.                                          |
| `component`               | Optional | `elementType`      | `CardContent` | The component used to wrap the form.                |
| `defaultValues`           | Optional | `object| function` | -       | The default values of the record.                          |
| `id`                      | Optional | `string`           | -       | The id of the underlying `<form>` tag.                     |
| `noValidate`              | Optional | `boolean`          | -       | Set to `true` to disable the browser's default validation. |
| `onSubmit`                | Optional | `function`         | `save`  | A callback to call when the form is submitted.             |
| `sanitize EmptyValues`    | Optional | `boolean`          | -       | Set to `true` to remove empty values from the form state.  |
| `sx`                      | Optional | `object`           | -       | Custom styles                                              |
| `toolbar`                 | Optional | `element`          | -       | The toolbar component.                                     |
| `validate`                | Optional | `function`         | -       | A function to validate the form values.                    |
| `warnWhen UnsavedChanges` | Optional | `boolean`          | -       | Set to `true` to warn the user when leaving the form with unsaved changes. |

Additional props are passed to [the `useForm` hook](https://react-hook-form.com/docs/useform) and to [the material-ui `<Stack>` component](https://mui.com/material-ui/react-stack/).

## `children`

`<SimpleForm>` renders its children (usually Input components) row by row. It uses a [Material UI `<Stack>`](https://mui.com/material-ui/react-stack/).

```jsx
import { Create, SimpleForm, TextInput, RichTextInput, NumberInput } from 'react-admin';

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
    </Create>
);
```

You can also pass non-input children to build a custom form layout. See the [Complex Input Layout](#complex-input-layout) section for an example.

## `component`

`<SimpleForm>` renders a Material UI `<CardContent>` by default. You replace it by any component you want as wrapper, just pass it as the `component` prop.

```jsx
const PostCreate = () => (
    <Create>
        <SimpleForm component={MyWrapper}>
            <TextInput source="title" />
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
    </Create>
);
```

## `defaultValues`

The value of the form `defaultValues` prop is an object, or a function returning an object, specifying default values for the created record. For instance:

```jsx
const postDefaultValue = () => ({ id: uuid(), created_at: new Date(), nb_views: 0 });

export const PostCreate = () => (
    <Create>
        <SimpleForm defaultValues={postDefaultValue}>
            <TextInput source="title" />
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
    </Create>
);
```

**Tip**: You can include properties in the form `defaultValues` that are not listed as input components, like the `created_at` property in the previous example.

**Tip**: React-admin also allows to define default values at the input level. See the [Setting default Values](./Forms.md#default-values) section.

## `id`

Normally, a submit button only works when placed inside a `<form>` tag. However, you can place a submit button outside of the form if the submit button `form` matches the form `id`.

Set this form `id` via the `id` prop.

```jsx
export const PostCreate = () => (
    <Create>
        <SimpleForm toolbar={false} id="post_create_form">
            <TextInput source="title" />
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
        <SaveButton form="post_create_form" />
    </Create>
);
```

## `noValidate`

The `<form novalidate>` attribute prevents the browser from validating the form. This is useful if you don't want to use the browser's default validation, or if you want to customize the error messages. To set this attribute on the underlying `<form>` tag, set the `noValidate` prop to `true`.

```jsx
const PostCreate = () => (
    <Create>
        <SimpleForm noValidate>
            <TextInput source="title" />
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
    </Create>
);
```

## `onSubmit`

By default, the `<SimpleForm>` calls the `save` callback passed to it by the edit or create controller, via the `SaveContext`. You can override this behavior by setting a callback as the `onSubmit` prop manually.

```jsx
export const PostCreate = () => {
    const [create] = useCreate();
    const postSave = (data) => {
        create('posts', { data });
    };
    return (
        <Create>
            <SimpleForm onSubmit={postSave}>
                <TextInput source="title" />
                <RichTextInput source="body" />
                <NumberInput source="nb_views" />
            </SimpleForm>
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
        <SimpleForm sanitizeEmptyValues>
            ...
        </SimpleForm>
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

## `sx`: CSS API

Pass an `sx` prop to customize the style of the main component and the underlying elements.

The most common usage is to limit the width of the form, to avoid long inputs on large screens:

{% raw %}
```jsx
export const PostCreate = () => (
    <Create>
        <SimpleForm sx={{ maxWidth: { lg: 600 } }}>
            <TextInput source="title" />
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
    </Create>
);
```
{% endraw %}

## `toolbar`

By default, `<SimpleForm>` renders a toolbar at the bottom of the form, containing:

- a submit button on Creation pages,
- a submit button and a delete button on Edition pages. 

If you want to tweak the look and feel of that toolbar, add or remove buttons, pass your own toolbar component to the form using the `toolbar` prop.

```jsx
const PostCreate = () => (
    <Create>
        <SimpleForm toolbar={<MyToolbar />}>
            <TextInput source="title" />
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
    </Create>
);
```

**Tip**: Set the `toolbar` prop to `false` to hide the toolbar.

The most common use case is to display two submit buttons in the `<Create>` view:

- One that creates and redirects to the `<Show>` view of the new resource, and
- One that redirects to a blank `<Create>` view after creation (allowing bulk creation)

![Form toolbar](./img/form-toolbar.png)

For that use case, use the `<SaveButton>` component with a custom `onSuccess` prop:

{% raw %}
```jsx
import * as React from "react";
import { Create, SimpleForm, SaveButton, Toolbar, useRedirect, useNotify } from 'react-admin';

const PostCreateToolbar = () => {
    const redirect = useRedirect();
    const notify = useNotify();
    return (
        <Toolbar>
            <SaveButton
                label="post.action.save_and_show"
            />
            <SaveButton
                label="post.action.save_and_add"
                mutationOptions={{
                    onSuccess: data => {
                        notify('ra.notification.created', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                        redirect(false);
                    }}
                }
                type="button"
                variant="text"
            />
        </Toolbar>
    );
};

export const PostCreate = () => (
    <Create redirect="show">
        <SimpleForm toolbar={<PostCreateToolbar />}>
            ...
        </SimpleForm>
    </Create>
);
```
{% endraw %}

Another use case is to remove the `<DeleteButton>` from the toolbar in an edit view. In that case, create a custom toolbar containing only the `<SaveButton>` as a child:

```jsx
import * as React from "react";
import { Edit, SimpleForm, SaveButton, Toolbar } from 'react-admin';

const PostEditToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

export const PostEdit = () => (
    <Edit>
        <SimpleForm toolbar={<PostEditToolbar />}>
            // ...
        </SimpleForm>
    </Edit>
);
```

In the default `<Toolbar>`, the `<SaveButton>` is disabled when the form is `pristine`. You can bypass this behavior and always enable it thanks to the prop `alwaysEnable`:

```jsx
import * as React from 'react';
import { Edit, SimpleForm, SaveButton, DeleteButton, Toolbar } from 'react-admin';

const PostEditToolbar = () => (
    <Toolbar>
        <SaveButton alwaysEnable />
        <DeleteButton />
    </Toolbar>
);

export const PostEdit = () => (
    <Edit>
        <SimpleForm toolbar={<PostEditToolbar />}>
            ...
        </SimpleForm>
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
        <SimpleForm validate={validateUserCreation}>
            <TextInput label="First Name" source="firstName" />
            <TextInput label="Age" source="age" />
        </SimpleForm>
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
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="id" />
            <TextInput source="name" />
            ...
        </SimpleForm>
    </Edit>
);
```

**Note**: Due to limitations in react-router, this feature only works if you use the default router provided by react-admin, or if you use a [Data Router](https://reactrouter.com/en/6.22.3/routers/picking-a-router).

## Using Fields As Children

<iframe src="https://www.youtube-nocookie.com/embed/fWc7c0URQMQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

The basic usage of `<SimpleForm>` is to pass [Input components](./Inputs.md) as children. For non-editable fields, you can pass `disabled` inputs, or even [Field components](./Fields.md). But since `<Field>` components have no label by default, you'll have to wrap your inputs in a `<Labeled>` component in that case:

```jsx
import { Edit, SimpleForm, TextInput, Labeled, TextField } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <Labeled label="Title">
                <TextField source="title" />
            </Labeled>
            <TextInput source="body" />
        </SimpleForm>
    </Edit>
);
```

## Complex Input Layout

`<SimpleForm>` can be used to render more than one input per row, and arrange inputs in a more user-friendly way.

![complex form layout](./img/simpleform-layout.png)

By default, `<SimpleForm>` renders one child per row. But a given child can be a layout element (e.g. `<Grid>`, `<Stack>`, `<Box>`) and contain several input elements. This lets you build form layouts of any complexity:

{% raw %}
```jsx
const UserCreate = () => (
    <Create>
        <SimpleForm sx={{ maxWidth: { lg: '500' } }}>
            <Typography variant="h6" gutterBottom>
                Identity
            </Typography>
            <Box display={{ xs: 'block', sm: 'flex', width: '100%' }}>
                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput source="first_name" isRequired />
                </Box>
                <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <TextInput source="last_name" isRequired />
                </Box>
            </Box>
            <TextInput type="email" source="email" isRequired />
            <DateInput source="birthday" />
            <Separator />
            
            <Typography variant="h6" gutterBottom>
                Address
            </Typography>
            <TextInput source="address" multiline helperText={false} />
            <Box display={{ xs: 'block', sm: 'flex' }}>
                <Box flex={2} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput source="city" helperText={false} />
                </Box>
                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput source="stateAbbr" helperText={false} />
                </Box>
                <Box flex={2}>
                    <TextInput source="zipcode" helperText={false} />
                </Box>
            </Box>
            <Separator />
            
            <Typography variant="h6" gutterBottom>
                Password
            </Typography>
            <Box display={{ xs: 'block', sm: 'flex' }}>
                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <PasswordInput source="password" />
                </Box>
                <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <PasswordInput source="confirm_password" />
                </Box>
            </Box>
        </SimpleForm>
    </Create>
);

const Separator = () => <Box pt="1em" />;
```
{% endraw %}

Before building your own custom layout, take a look at the existing form layout components provided by react-admin:

- [`SimpleForm`](./SimpleForm.md) for a single-column layout
- [`TabbedForm`](./TabbedForm.md) for a tabbed layout
- [`AccordionForm`](./AccordionForm.md) for long forms with collapsible sections
- [`LongForm`](./LongForm.md) for long forms with a navigation sidebar
- [`WizardForm`](./WizardForm.md) for multi-step forms
- [`EditDialog`](./EditDialog.md) for sub-forms in a modal dialog
- and [`Form`](./Form.md), a headless component to use as a base for your custom layouts

## Subscribing To Form Changes

`<SimpleForm>` relies on [react-hook-form's `useForm`](https://react-hook-form.com/docs/useform) to manage the form state and validation. You can subscribe to form changes using the [`useFormContext`](https://react-hook-form.com/docs/useformcontext) and [`useFormState`](https://react-hook-form.com/docs/useformstate) hooks.
 
**Reminder:** [react-hook-form's `formState` is wrapped with a Proxy](https://react-hook-form.com/docs/useformstate/#rules) to improve render performance and skip extra computation if specific state is not subscribed. So, make sure you deconstruct or read the `formState` before render in order to enable the subscription.

```js
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState      
```

## Displaying Inputs Based On Permissions

You can leverage [the `usePermissions` hook](./usePermissions.md) to display inputs if the user has the required permissions.

{% raw %}
```jsx
import { usePermissions, Create, SimpleForm, TextInput } from 'react-admin';

export const UserCreate = () => {
    const { permissions } = useGetPermissions();
    return (
        <Create redirect="show">
            <SimpleForm>
                <TextInput source="name" validate={[required()]} />
                {permissions === 'admin' &&
                    <TextInput source="role" validate={[required()]} />}
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

## Configurable

You can let end users customize the fields displayed in the `<SimpleForm>` by using the `<SimpleFormConfigurable>` component instead.

<video controls autoplay playsinline muted loop>
  <source src="./img/SimpleFormConfigurable.webm" type="video/webm"/>
  <source src="./img/SimpleFormConfigurable.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


```diff
import {
    Edit,
-   SimpleForm,
+   SimpleFormConfigurable,
    TextInput,
} from 'react-admin';

const PostEdit = () => (
    <Edit>
-       <SimpleForm>
+       <SimpleFormConfigurable>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="year" />
-       </SimpleForm>
+       </SimpleFormConfigurable>
    </Edit>
);
```

When users enter the configuration mode and select the `<SimpleForm>`, they can show / hide SimpleForm inputs.

By default, `<SimpleFormConfigurable>` renders all child inputs. But you can also omit some of them by passing an `omit` prop containing an array of input sources:

```jsx
// By default, hide the author input
// users can choose to show it in configuration mode
const PostEdit = () => (
    <Edit>
        <SimpleFormConfigurable omit={['author']}>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="year" />
        </SimpleFormConfigurable>
    </Edit>
);
```

If you render more than one `<SimpleFormConfigurable>` in the same page, you must pass a unique `preferenceKey` prop to each one:

```jsx
const PostEdit = () => (
    <Edit>
        <SimpleFormConfigurable preferenceKey="posts.simpleForm">
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="year" />
        </SimpleFormConfigurable>
    </Edit>
);
```

`<SimpleFormConfigurable>` accepts the same props as `<SimpleForm>`.

## AutoSave

In forms where users may spend a lot of time, it's a good idea to save the form automatically after a few seconds of inactivity. You can auto save the form content by using [the `<AutoSave>` component](./AutoSave.md).

<video controls autoplay playsinline muted loop>
  <source src="./img/AutoSave.webm" type="video/webm"/>
  <source src="./img/AutoSave.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

{% raw %}
```tsx
import { AutoSave } from '@react-admin/ra-form-layout';
import { Edit, SimpleForm, TextInput, DateInput, SelectInput, Toolbar } from 'react-admin';

const AutoSaveToolbar = () => (
    <Toolbar>
        <AutoSave />
    </Toolbar>
);

const PersonEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm
            resetOptions={{ keepDirtyValues: true }}
            toolbar={<AutoSaveToolbar />}
        >
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <DateInput source="dob" />
            <SelectInput source="sex" choices={[
                { id: 'male', name: 'Male' },
                { id: 'female', name: 'Female' },
            ]}/>
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

Note that you **must** set the `<SimpleForm resetOptions>` prop to `{ keepDirtyValues: true }`. If you forget that prop, any change entered by the end user after the autosave but before its acknowledgement by the server will be lost.

If you're using it in an `<Edit>` page, you must also use a `pessimistic` or `optimistic` [`mutationMode`](https://marmelab.com/react-admin/Edit.html#mutationmode) - `<AutoSave>` doesn't work with the default `mutationMode="undoable"`.

Check [the `<AutoSave>` component](./AutoSave.md) documentation for more details.

## Role-Based Access Control (RBAC)

Fine-grained permissions control can be added by using the [`<SimpleForm>`](./AuthRBAC.md#simpleform) component provided by the `@react-admin/ra-rbac` package. 

{% raw %}
```jsx
import { Edit, TextInput } from 'react-admin';
import { SimpleForm } from '@react-admin/ra-rbac';

const authProvider= {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            // 'delete' is missing
            { action: ['list', 'edit'], resource: 'products' },
            { action: 'write', resource: 'products.reference' },
            { action: 'write', resource: 'products.width' },
            { action: 'write', resource: 'products.height' },
            // 'products.description' is missing
            { action: 'write', resource: 'products.thumbnail' },
            // 'products.image' is missing
        ]
    }),
};

const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="reference" />
            <TextInput source="width" />
            <TextInput source="height" />
            {/* not displayed */}
            <TextInput source="description" />
            {/* not displayed */}
            <TextInput source="image" />
            <TextInput source="thumbnail" />
            {/* no delete button */}
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

Check [the RBAC `<SimpleForm>` component](./AuthRBAC.md#simpleform) documentation for more details.

## Versioning

By default, `<SimpleForm>` updates the current record (via `dataProvider.update()`), so the previous version of the record is lost. If you want to keep the previous version, you can use the [`<SimpleFormWithRevision>`](https://react-admin-ee.marmelab.com/documentation/ra-history#simpleformwithrevision) component instead:

```diff
// in src/posts/PostCreate.js
-import { Create, SimpleForm, TextInput, RichTextInput, NumberInput } from 'react-admin';
+import { Create, TextInput, RichTextInput, NumberInput } from 'react-admin';
+import { SimpleFormWithRevision } from "@react-admin/ra-history";

export const PostCreate = () => (
    <Create>
-       <SimpleForm>
+       <SimpleFormWithRevision>
            <TextInput source="title" />
            <TextInput source="teaser" />
            <TextInput multiline source="body" />
-       </SimpleForm>
+       </SimpleFormWithRevision>
    </Create>
);
```

This won't change the look and feel of the form. But when the user submits the form, they will see a dialog asking them for the reason of the change.

![SimpleFormWithRevision](https://react-admin-ee.marmelab.com/assets/ra-history/latest/SimpleFormWithRevision.png)

After submitting this dialog, react-admin will update the main record and **create a new revision**. A revision represents the state of the record at a given point in time. It is immutable. A revision also records the date, author, and reason of the change. Past revisions can be accessed via the [`<RevisionsButton>`](https://react-admin-ee.marmelab.com/documentation/ra-history#revisionsbutton) component.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/RevisionsButton.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

```jsx
// in src/posts/PostEdit.js
import { Edit, TextInput, TopToolbar } from "react-admin";
import {
  SimpleFormWithRevision,
  RevisionsButton,
} from "@react-admin/ra-history";

const PostEditActions = () => (
  <TopToolbar>
    <RevisionsButton />
  </TopToolbar>
);

export const PostEdit = () => (
  <Edit actions={<PostEditActions />}>
    <SimpleFormWithRevision>
      <TextInput source="title" />
      <TextInput source="teaser" />
      <TextInput multiline source="body" />
    </SimpleFormWithRevision>
  </Edit>
);
```

Check the [`<SimpleFormWithRevision>`](https://react-admin-ee.marmelab.com/documentation/ra-history#simpleformwithrevision) and [`<RevisionsButton>`](https://react-admin-ee.marmelab.com/documentation/ra-history#revisionsbutton) documentation for more details.

## Linking Two Inputs

<iframe src="https://www.youtube-nocookie.com/embed/YkqjydtmfcU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

Edition forms often contain linked inputs, e.g. country and city (the choices of the latter depending on the value of the former).

React-admin relies on [react-hook-form](https://react-hook-form.com/) for form handling. You can grab the current form values using react-hook-form's [useWatch](https://react-hook-form.com/docs/usewatch) hook.

```jsx
import * as React from 'react';
import { Edit, SimpleForm, SelectInput } from 'react-admin';
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
    <Edit>
        <SimpleForm>
            <SelectInput source="country" choices={toChoices(countries)} />
            <CityInput />
        </SimpleForm>
    </Edit>
);

export default OrderEdit;
```

**Tip:** If you'd like to avoid creating an intermediate component like `<CityInput>`, or are using an `<ArrayInput>`, you can use the [`<FormDataConsumer>`](./Inputs.md#linking-two-inputs) component as an alternative.

## Headless Version

`<SimpleForm>` renders its children in a Material UI `<Stack>`, and renders a toolbar with a `<SaveButton>`. If you want to build a custom form layout, you can use [the `<Form>` component](./Form.md) instead.

```jsx
import { Create, Form, TextInput, RichTextInput, SaveButton } from 'react-admin';
import { Grid } from '@mui/material';

export const PostCreate = () => (
    <Create>
        <Form>
            <Grid container>
                <Grid item xs={6}>
                    <TextInput source="title" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="author" />
                </Grid>
                <Grid item xs={12}>
                    <RichTextInput source="body" />
                </Grid>
                <Grid item xs={12}>
                    <SaveButton />
                </Grid>
            </Grid>
        </Form>
    </Create>
);
```

React-admin forms leverage react-hook-form's [`useForm` hook](https://react-hook-form.com/docs/useform).
