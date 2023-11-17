---
layout: default
title: "TabbedForm"
---

# `<TabbedForm>`

`<TabbedForm>` creates a `<form>` to edit a record, and renders inputs grouped by tab. The tabs are set by using `<TabbedForm.Tab>` components. It is useful for forms with a lot of inputs, to reduce the time taken to change a subset of the fields.

<video controls autoplay playsinline muted loop>
  <source src="./img/tabbed-form.webm" type="video/webm"/>
  <source src="./img/tabbed-form.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

`<TabbedForm>` reads the `record` from the `RecordContext`, uses it to initialize the defaultValues of a `<Form>`, renders its children in a Material UI `<Stack>`, and renders a toolbar with a `<SaveButton>` that calls the `save` callback prepared by the edit or the create controller when pressed.

`<TabbedForm>` is often used as child of `<Create>` or `<Edit>`. It accepts `<TabbedForm.Tab>` elements as children. It relies on [react-hook-form](https://react-hook-form.com/) for form handling. It requires no prop by default.

{% raw %}
```jsx
import * as React from "react";
import {
    TabbedForm,
    Edit,
    Datagrid,
    TextField,
    DateField,
    TextInput,
    ReferenceManyField,
    NumberInput,
    DateInput,
    BooleanInput,
    EditButton
} from 'react-admin';

export const PostEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="summary">
                <TextInput disabled label="Id" source="id" />
                <TextInput source="title" validate={required()} />
                <TextInput multiline source="teaser" validate={required()} />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="body">
                <RichTextInput source="body" validate={required()} label={false} />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Miscellaneous">
                <TextInput label="Password (if protected post)" source="password" type="password" />
                <DateInput label="Publication date" source="published_at" />
                <NumberInput source="average_note" validate={[ number(), minValue(0) ]} />
                <BooleanInput label="Allow comments?" source="commentable" defaultValue />
                <TextInput disabled label="Nb views" source="views" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="comments">
                <ReferenceManyField reference="comments" target="post_id" label={false}>
                    <Datagrid>
                        <TextField source="body" />
                        <DateField source="created_at" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
```
{% endraw %}

`<TabbedForm>` calls react-hook-form's `useForm` hook, and places the result in a `FormProvider` component. This means you can take advantage of the [`useFormContext`](https://react-hook-form.com/docs/useformcontext) and [`useFormState`](https://react-hook-form.com/docs/useformstate) hooks to access the form state.

React-admin highlights the tabs containing validation errors to help users locate incorrect input values.

## Props

Here are all the props you can set on the `<TabbedForm>` component:

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

Additional props are passed to [the `useForm` hook](https://react-hook-form.com/docs/useform) and to the wrapper `<div>` component.

## `children`

`<TabbedForm>` expects `<TabbedForm.Tab>` elements as children. It renders them as tabs using [a Material UI `<Tabs>` component](https://mui.com/material-ui/react-tabs/).

```jsx
export const PostEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="summary">
                ...
            </TabbedForm.Tab>
            <TabbedForm.Tab label="body">
                ...
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Miscellaneous">
                ...
            </TabbedForm.Tab>
            <TabbedForm.Tab label="comments">
                ...
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
```

## `component`

`<TabbedForm>` renders a Material UI `<CardContent>` by default. You replace it by any component you want as wrapper, just pass it as the `component` prop.

```jsx
const PostCreate = () => (
    <Create>
        <TabbedForm component={MyWrapper}>
            ...
        </TabbedForm>
    </Create>
);
```

## `defaultValues`

The value of the form `defaultValues` prop is an object, or a function returning an object, specifying default values for the created record. For instance:

```jsx
const postDefaultValue = () => ({ id: uuid(), created_at: new Date(), nb_views: 0 });

export const PostCreate = () => (
    <Create>
        <TabbedForm defaultValues={postDefaultValue}>
            ...
        </TabbedForm>
    </Create>
);
```

**Tip**: You can include properties in the form `defaultValues` that are not listed as input components, like the `created_at` property in the previous example.

**Tip**: React-admin also allows to define default values at the input level. See the [Setting default Values](./EditTutorial.md#setting-default-values) section.

## `id`

Normally, a submit button only works when placed inside a `<form>` tag. However, you can place a submit button outside of the form if the submit button `form` matches the form `id`.

Set this form `id` via the `id` prop.

```jsx
export const PostCreate = () => (
    <Create>
        <TabbedForm toolbar={false} id="post_create_form">
            ...
        </TabbedForm>
        <SaveButton form="post_create_form" />
    </Create>
);
```

## `noValidate`

The `<form novalidate>` attribute prevents the browser from validating the form. This is useful if you don't want to use the browser's default validation, or if you want to customize the error messages. To set this attribute on the underlying `<form>` tag, set the `noValidate` prop to `true`.

```jsx
const PostCreate = () => (
    <Create>
        <TabbedForm noValidate>
            ...
        </TabbedForm>
    </Create>
);
```

## `onSubmit`

By default, the `<TabbedForm>` calls the `save` callback passed to it by the edit or create controller, via the `SaveContext`. You can override this behavior by setting a callback as the `onSubmit` prop manually.

```jsx
export const PostCreate = () => {
    const [create] = useCreate();
    const postSave = (data) => {
        create('posts', { data });
    };
    return (
        <Create>
            <TabbedForm onSubmit={postSave}>
                ...
            </TabbedForm>
        </Create>
    );
};
```

## `sx`: CSS API

Pass an `sx` prop to customize the style of the main component and the underlying elements.

{% raw %}
```jsx
export const PostCreate = () => (
    <Create>
        <TabbedForm sx={{ border: '1px solid red' }}>
            ...
        </TabbedForm>
    </Create>
);
```
{% endraw %}

**Tip:** If you want to customize the _content_ of the tabs instead, for example to limit the width of the form, you should rather add an `sx` prop to the [`<TabbedForm.Tab>` component](#tabbedformtab).

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
        <TabbedForm sanitizeEmptyValues>
            ...
        </TabbedForm>
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

## `syncWithLocation`

When the user clicks on a tab header, react-admin changes the URL to enable the back button.

However, this makes `<TabbedForm>` impossible to use in pages where the state is already synced with the location by another component (e.g. list filters, or another `<TabbedForm>`). To solve this, you can opt out the location synchronization by passing `false` to the `syncWithLocation` prop.

{% raw %}
```jsx
export const PostEdit = () => (
    <Edit>
        <TabbedForm syncWithLocation={false}>
            <TabbedForm.Tab label="summary">
                <TextInput disabled label="Id" source="id" />
                <TextInput source="title" validate={required()} />
                <TextInput multiline source="teaser" validate={required()} />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="body">
                <RichTextInput source="body" validate={required()} label={false} />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Miscellaneous">
                <TextInput label="Password (if protected post)" source="password" type="password" />
                <DateInput label="Publication date" source="published_at" />
                <NumberInput source="average_note" validate={[ number(), minValue(0) ]} />
                <BooleanInput label="Allow comments?" source="commentable" defaultValue />
                <TextInput disabled label="Nb views" source="views" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="comments">
                <ReferenceManyField reference="comments" target="post_id" label={false}>
                    <Datagrid>
                        <TextField source="body" />
                        <DateField source="created_at" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
```
{% endraw %}

**Tip**: When `syncWithLocation` is `false`, the `path` prop of the `<TabbedForm.Tab>` components is ignored.

## `tabs`

By default, `<TabbedForm>` uses `<TabbedFormTabs>`, an internal react-admin component, to render the tab headers. You can pass a custom component as the `tabs` prop to tweak the UX of these headers. Besides, props from `<TabbedFormTabs>` are passed down to Material UI's `<Tabs>` component.

The following example shows how to make use of scrollable `<Tabs>`. Pass `variant="scrollable"` and `scrollButtons="auto"` props to `<TabbedFormTabs>` and use it in the `tabs` prop from `<TabbedForm>`.

```jsx
import * as React from "react";
import {
    Edit,
    TabbedForm,
    TabbedFormTabs,
} from 'react-admin';

export const PostEdit = () => (
    <Edit>
        <TabbedForm tabs={<TabbedFormTabs variant="scrollable" scrollButtons="auto" />}>
            ...
        </TabbedForm>
    </Edit>
);
```

**Tip**: Material UI only adds the scroll buttons if there isn't enough space to display all the tabs. That can only happen if the Tabs containers have a fixed width.
The solution here is to set a max width on one of the following components:

* the `<Edit>` or `<Create>`
* the `<TabbedForm>`

## `toolbar`

By default, `<TabbedForm>` renders a toolbar at the bottom of the form, containing:

- a submit button on Creation pages,
- a submit button and a delete button on Edition pages.

If you want to tweak the look and feel of that toolbar, add or remove buttons, pass yout own toolbar component to the form using the `toolbar` prop.

```jsx
const PostCreate = () => (
    <Create>
        <TabbedForm toolbar={<MyToolbar />}>
            ...
        </TabbedForm>
    </Create>
);
```

**Tip**: Set the `toolbar` prop to `false` to hide the toolbar.

The most common use case is to display two submit buttons in the `<Create>` view:

- One that creates and redirects to the `<Show>` view of the new resource, and
- One that redirects to a blank `<Create>` view after creation (allowing bulk creation)

For that use case, use the `<SaveButton>` component with a custom `onSuccess` prop:

{% raw %}
```jsx
import * as React from "react";
import { Create, TabbedForm, SaveButton, Toolbar, useRedirect } from 'react-admin';

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
        <TabbedForm toolbar={<PostCreateToolbar />}>
            ...
        </TabbedForm>
    </Create>
);
```
{% endraw %}

Another use case is to remove the `<DeleteButton>` from the toolbar in an edit view. In that case, create a custom toolbar containing only the `<SaveButton>` as a child:

```jsx
import * as React from "react";
import { Edit, TabbedForm, SaveButton, Toolbar } from 'react-admin';

const PostEditToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

export const PostEdit = () => (
    <Edit>
        <TabbedForm toolbar={<PostEditToolbar />}>
            ...
        </TabbedForm>
    </Edit>
);
```

In the default `<Toolbar>`, the `<SaveButton>` is disabled when the form is `pristine`. You can bypass this behavior and always enable it thanks to the prop `alwaysEnable`:

```jsx
import * as React from 'react';
import { Edit, TabbedForm, SaveButton, DeleteButton, Toolbar } from 'react-admin';

const PostEditToolbar = () => (
    <Toolbar>
        <SaveButton alwaysEnable />
        <DeleteButton />
    </Toolbar>
);

export const PostEdit = () => (
    <Edit>
        <TabbedForm toolbar={<PostEditToolbar />}>
            ...
        </TabbedForm>
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
        <TabbedForm validate={validateUserCreation}>
            ...
        </TabbedForm>
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
        <TabbedForm warnWhenUnsavedChanges>
            ...
        </TabbedForm>
    </Edit>
);
```

**Warning**: This feature only works if you have a dependency on react-router 6.3.0 **at most**. The react-router team disabled this possibility in react-router 6.4, so `warnWhenUnsavedChanges` will silently fail with react-router 6.4 or later.

## `<TabbedForm.Tab>`

`<TabbedForm>` expect `<TabbedForm.Tab>` elements as children. `<TabbedForm.Tab>` elements accept five props:

- `label`: the label of the tab
- `path`: the path of the tab in the URL (ignored when `syncWithLocation={false}`)
- `count`: the number of items in the tab (dislayed close to the label)
- `sx`: custom styles to apply to the tab
- `children`: the content of the tab (usually a list of inputs)

`<TabbedForm.Tab>` renders its children in a Material UI `<Stack>` component, i.e. one child per row.

The `sx` prop allows to style the content of the tab, e.g. to limit its width:

{% raw %}
```jsx
const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <TabbedForm>
            <TabbedForm.Tab
                label="resources.products.tabs.image"
                sx={{ maxWidth: '40em' }}
            >
                ...
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
```
{% endraw %}

React-admin passes the `label` through the `translate()` function, so you can use translation keys in the `label` prop.

```jsx
const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <TabbedForm>
            <TabbedForm.Tab label="resources.products.tabs.image">
                ...
            </TabbedForm.Tab>
            <TabbedForm.Tab label="resources.products.tabs.details">
                ...
            </TabbedForm.Tab>
            <TabbedForm.Tab label="resources.products.tabs.description">
                ...
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
```

**Tip**: React-admin renders each tab *twice*: once to get the tab header, and once to get the tab content. If you use a custom component instead of a `<TabbedForm.Tab>`, make sure that it accepts an `intent` prop, and renders differently when the value of that prop is 'header' or 'content'.

## Using Fields As Children

The basic usage of `<TabbedForm>` is to pass [Input components](./Inputs.md) as children of `<TabbedForm.Tab>`. For non-editable fields, you can pass `disabled` inputs, or even [Field components](./Fields.md). But since `<Field>` components have no label by default, you'll have to wrap your inputs in a `<Labeled>` component in that case:

```jsx
import { Edit, TabbedForm, TextInput, Labeled, TextField } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="main">
                <TextInput source="id" />
                <Labeled label="Title">
                    <TextField source="title" />
                </Labeled>
                <TextInput source="body" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
```

## Complex Input Layout

`<TabbedForm>` can be used to render more than one input per row, and arrange inputs in a more user-friendly way.

![complex form layout](./img/TabbedForm-layout.png)

By default, `<TabbedForm.Tab>` renders one child per row. But a given child can be a layout element (e.g. `<Grid>`, `<Stack>`, `<Box>`) and contain several input elements. This lets you build form layouts of any complexity:

{% raw %}
```jsx
const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <TabbedForm>
            <TabbedForm.Tab label="resources.products.tabs.image">
                ...
            </TabbedForm.Tab>
            <TabbedForm.Tab label="resources.products.tabs.details">
                <ProductEditDetails />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="resources.products.tabs.description">
                ...
            </TabbedForm.Tab>
            <TabbedForm.Tab path="reviews">
                ...
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);

const ProductEditDetails = () => (
    <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={8}>
            <TextInput source="reference" fullWidth validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <ReferenceInput source="category_id" reference="categories">
                <SelectInput source="name" validate={req} fullWidth />
            </ReferenceInput>
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput
                source="width"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">cm</InputAdornment>
                    ),
                }}
                validate={req}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput
                source="height"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">cm</InputAdornment>
                    ),
                }}
                validate={req}
                fullWidth
            />
        </Grid>
        <Grid item xs={0} sm={4}></Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput
                source="price"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">€</InputAdornment>
                    ),
                }}
                validate={req}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput source="stock" validate={req} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput source="sales" validate={req} fullWidth />
        </Grid>
    </Grid>
);
```
{% endraw %}

## Subscribing To Form Changes

`<TabbedForm>` relies on [react-hook-form's `useForm`](https://react-hook-form.com/docs/useform) to manage the form state and validation. You can subscribe to form changes using the [`useFormContext`](https://react-hook-form.com/docs/useformcontext) and [`useFormState`](https://react-hook-form.com/docs/useformstate) hooks.

**Reminder:** [react-hook-form's `formState` is wrapped with a Proxy](https://react-hook-form.com/docs/useformstate/#rules) to improve render performance and skip extra computation if specific state is not subscribed. So, make sure you deconstruct or read the `formState` before render in order to enable the subscription.

```js
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState
```

## Dynamic Tab Label

`<TabbedForm>` often contain not only inputs, but also related data (e.g. the reviews of a product). Users appreciate that the label of such tabs show the actual number of related elements, to avoid clicking on a tab to reveal an empty list.

![dynamic tab label](./img/FormTab-dynamic-label.png)

To achieve that, create a custom commponent that renders a `<TabbedForm.Tab>` with a dynamic `label`:

```jsx
const ReviewsFormTab = props => {
    const record = useRecordContext();
    const { isLoading, total } = useGetManyReference(
        'reviews',
        {
            target: 'product_id',
            id: record.id,
            pagination: { page: 1, perPage: 25 },
            sort: { field: 'id', order: 'DESC' },
        },
        { enabled: !!record }
    );
    const translate = useTranslate();
    let label = translate('resources.products.tabs.reviews');
    if (!isLoading) {
        label += ` (${total})`;
    }
    return <TabbedForm.Tab label={label} {...props} />;
};
```

Then, use this custom component in a `<TabbedForm>`:

{% raw %}
```jsx
const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <TabbedForm>
            <TabbedForm.Tab label="resources.products.tabs.image">
                ...
            </TabbedForm.Tab>
            <TabbedForm.Tab label="resources.products.tabs.details">
                ...
            </TabbedForm.Tab>
            <TabbedForm.Tab label="resources.products.tabs.description">
                ...
            </TabbedForm.Tab>
            <ReviewsFormTab path="reviews">
                <ReferenceManyField
                    reference="reviews"
                    target="product_id"
                    pagination={<Pagination />}
                >
                    <Datagrid
                        sx={{
                            width: '100%',
                            '& .column-comment': {
                                maxWidth: '20em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            },
                        }}
                    >
                        <DateField source="date" />
                        <CustomerReferenceField />
                        <StarRatingField />
                        <TextField source="comment" />
                        <TextField source="status" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </ReviewsFormTab>
        </TabbedForm>
    </Edit>
);
```
{% endraw %}

**Tip**: In this example, both the `<ReviewsFormTab>` and the `<ReferenceManyField>` issue a `dataProvider.getManyReference()` call to fetch the related reviews. Thanks to react-query's query deduplication logic, the dataProvider only receives one request to fetch the reviews.

## Displaying a Tab Based On Permissions

You can leverage [the `usePermissions` hook](./usePermissions.md) to display a tab only if the user has the required permissions.

{% raw %}
```jsx
import { usePermissions, Edit, TabbedForm, FormTab } from 'react-admin';

const UserEdit = () => {
    const { permissions } = usePermissions();
    return (
        <Edit>
            <TabbedForm>
                <TabbedForm.Tab label="summary">
                    ...
                </TabbedForm.Tab>
                {permissions === 'admin' &&
                    <TabbedForm.Tab label="Security">
                        ...
                    </TabbedForm.Tab>
                }
            </TabbedForm>
        </Edit>
    );
};
```
{% endraw %}

## AutoSave

In forms where users may spend a lot of time, it's a good idea to save the form automatically after a few seconds of inactivity. You can auto save the form content by using [the `<AutoSave>` component](./AutoSave.md).

{% raw %}
```tsx
import { AutoSave } from '@react-admin/ra-form-layout';
import { Edit, SaveButton, TabbedForm, TextInput, Toolbar } from 'react-admin';

const AutoSaveToolbar = () => (
    <Toolbar>
        <SaveButton />
        <AutoSave />
    </Toolbar>
);

const PostEdit = () => (
    <Edit mutationMode="optimistic">
        <TabbedForm
            resetOptions={{ keepDirtyValues: true }}
            toolbar={<AutoSaveToolbar />}
        >
            <TabbedForm.Tab label="summary">
                <TextInput source="title" />
                <TextInput source="teaser" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
```
{% endraw %}

Note that you **must** set the `<TabbedForm resetOptions>` prop to `{ keepDirtyValues: true }`. If you forget that prop, any change entered by the end user after the autosave but before its acknowledgement by the server will be lost.

If you're using it in an `<Edit>` page, you must also use a `pessimistic` or `optimistic` [`mutationMode`](https://marmelab.com/react-admin/Edit.html#mutationmode) - `<AutoSave>` doesn't work with the default `mutationMode="undoable"`.

Check [the `<AutoSave>` component](./AutoSave.md) documentation for more details.

## Role-Based Access Control (RBAC)

You can show or hide tabs and inputs based on user permissions by using the [`<TabbedForm>`](./AuthRBAC.md#tabbedform) component from the `@react-admin/ra-rbac` package instead of the `react-admin` package.

[`<TabbedForm>`](./AuthRBAC.md#tabbedform) shows only the tabs for which users have write permissions, using the `[resource].tab.[tabName]` string as resource identifier. It also renders the delete button only if the user has a permission for the `delete` action in the current resource. `<TabbedForm.Tab>` shows only the child inputs for which users have the write permissions, using the `[resource].[source]` string as resource identifier.

{% raw %}
```tsx
import { Edit, TextInput } from 'react-admin';
import { TabbedForm } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve([
        // crud (the delete action is missing)
        { action: ['list', 'edit'], resource: 'products' },
        // tabs ('products.tab.stock' is missing)
        { action: 'write', resource: 'products.tab.description' },
        { action: 'write', resource: 'products.tab.images' },
        // fields ('products.description' and 'products.image' are missing)
        { action: 'write', resource: 'products.reference' },
        { action: 'write', resource: 'products.width' },
        { action: 'write', resource: 'products.height' },
        { action: 'write', resource: 'products.thumbnail' },
    ]),
};

const ProductEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                {/* the description input is not displayed */}
                <TextInput source="description" />
            </TabbedForm.Tab>
            {/* the stock tab is not displayed */}
            <TabbedForm.Tab label="Stock" name="stock">
                <TextInput source="stock" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Images" name="images">
                {/* the images input is not displayed */}
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </TabbedForm.Tab>
            {/* the delete button is not displayed */}
        </TabbedForm>
    </Edit>
);
```
{% endraw %}

Check [the RBAC `<TabbedForm>` component](./AuthRBAC.md#tabbedform) documentation for more details.

## Linking Two Inputs

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
