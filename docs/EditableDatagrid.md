---
layout: default
title: "The EditableDatagrid Component"
---

# `<EditableDatagrid>`

The default react-admin user-experience consists of three pages: List, Edit, and Create. However, in some cases, users may prefer to do all search and edition tasks in one page.

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an "edit-in-place" experience, that allows users to edit, create, and delete records in place inside a `<Datagrid>`.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-editable-datagrid-overview.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-editable-datagrid-overview.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

With `<EditableDatagrid>`, users can click on a row in the datagrid to replace the row with an edition form, and edit the corresponding record without leaving the list. They can also create new records by clicking on the Create button, which inserts an empty editable row as the first line of the list. Finally, they can delete a record by clicking on the Delete button on each row.

You can test it live in [the Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-editable-datagrid-editabledatagrid--undoable) and in [the e-commerce demo](https://marmelab.com/ra-enterprise-demo/#/tours/ra-editable-datagrid).

## Usage

First, install the `@react-admin/ra-editable-datagrid` package:

```sh
npm install --save @react-admin/ra-editable-datagrid
# or
yarn add @react-admin/ra-editable-datagrid
```

**Tip**: `ra-editable-datagrid` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

Then, use `<EditableDatagrid>` in replacement of a `<Datagrid>`, as a child of a react-admin `<List>`, `<ReferenceManyField>` or any other component that creates a `ListContext`. In addition, pass a form component to be displayed when the user switches to edit or create mode.

{% raw %}
```tsx
import {
    List,
    TextField,
    TextInput,
    DateField,
    DateInput,
    SelectField,
    SelectInput,
    required,
} from 'react-admin';
import { EditableDatagrid, RowForm } from '@react-admin/ra-editable-datagrid';

const professionChoices = [
    { id: 'actor', name: 'Actor' },
    { id: 'singer', name: 'Singer' },
    { id: 'other', name: 'Other' },
];

const ArtistForm = () => (
    <RowForm>
        <TextField source="id" />
        <TextInput source="firstname" validate={required()} />
        <TextInput source="name" validate={required()} />
        <DateInput source="dob" label="born" validate={required()} />
        <SelectInput
            source="prof"
            label="Profession"
            choices={professionChoices}
        />
    </RowForm>
);

export const ArtistList = () => (
    <List hasCreate empty={false}>
        <EditableDatagrid
            mutationMode="undoable"
            createForm={<ArtistForm />}
            editForm={<ArtistForm />}
        >
            <TextField source="id" />
            <TextField source="firstname" />
            <TextField source="name" />
            <DateField source="dob" label="born" />
            <SelectField
                source="prof"
                label="Profession"
                choices={professionChoices}
            />
        </EditableDatagrid>
    </List>
);
```
{% endraw %}


## Props

| Prop           | Required | Type         | Default    | Description                                                               |
| -------------- | -------- | ------------ | ---------- | ------------------------------------------------------------------------- |
| `editForm`     | Required | ReactElement | -          | The component to display instead of a row when the users edit a record.   |
| `actions`      | Optional | ReactElement | -          | The component used to customize the actions buttons.                      |
| `createForm`   | Optional | ReactElement | -          | The component to display as the first row when the user creates a record. |
| `mutationMode` | Optional | `string`     | `undoable` | Mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`).          |
| `noDelete`     | Optional | boolean      | -          | Disable the inline Delete button.                                         |

`<EditableDatagrid>` is a drop-in replacement for `<Datagrid>` it means that you can provide additional props to passed them down to [`<Datagrid>` component](./Datagrid.md#props).

## `editForm` 

The component to display instead of a row when the users edit a record. It renders as many columns as the `<EditableDatagrid>` has children.

The `<EditableDatagrid>` component renders the `editForm` elements in a `<table>`, so these elements should render a `<tr>`. We advise you to use the [`<RowForm>`](#rowform) component for `editForm`, which renders a `<tr>` by default. But you can also use your own component to render the row form ([see below](#rowform)).

```tsx
const ArtistForm = () => (
    <RowForm>
        <TextField source="id" />
        {/*...*/}
    </RowForm>
);

export const ArtistList = () => (
    <List>
        <EditableDatagrid editForm={<ArtistForm />}>
            <TextField source="id" />
            {/*...*/}
        </EditableDatagrid>
    </List>
);
```

**Tip**: No need to include an `<EditButton>` as child, the `<EditableDatagrid>` component adds a column with edit/delete/save/cancel buttons itself.

## `actions`

By default, the `<EditableDatagrid>` will show both edit and delete buttons when users hover a row. If you want to either customize the buttons behavior or provide more actions, you can leverage the `actions` prop, which accepts a React element. For instance, here's how to customize the delete button so that it asks users for a confirmation but still allows to undo the deletion:

{% raw %}
```tsx
import React from 'react';
import { List, TextField } from 'react-admin';
import {
    DeleteWithConfirmIconButton,
    EditableDatagrid,
    EditRowButton,
} from '@react-admin/ra-editable-datagrid';
import { ArtistForm } from './ArtistForm';

const CustomAction = () => (
    <>
        <EditRowButton />
        <DeleteWithConfirmIconButton mutationMode="undoable" />
    </>
);

export const ArtistList = () => (
    <List hasCreate sort={{ field: 'id', order: 'DESC' }} empty={false}>
        <EditableDatagrid
            actions={<CustomAction />}
            // The mutation mode is still applied to updates
            mutationMode="undoable"
            editForm={<ArtistForm />}
        >
            <TextField source="id" />
            <TextField source="firstname" />
            <TextField source="name" />
        </EditableDatagrid>
    </List>
);
```
{% endraw %}

## `createForm`

The component to display as the first row when the user creates a record.

The `<EditableDatagrid>` component renders the `createForm` elements in a `<table>`, so these elements should render a `<tr>`. We advise you to use the [`<RowForm>`](#rowform) component for `createForm`, which renders a `<tr>` by default. But you can also use your own component to render the row form ([see below](#rowform))

To display a create button on top of the list, you should add the [`hasCreate`](./List.md#hascreate) prop to the `<List>` component, as in the example below.

```tsx
const ArtistForm = () => (
    <RowForm>
        <TextField source="id" />
        {/*...*/}
    </RowForm>
);

export const ArtistList = () => (
    <List hasCreate>
        <EditableDatagrid createForm={<ArtistForm />}>
            <TextField source="id" />
            {/*...*/}
        </EditableDatagrid>
    </List>
);
```

To be able to add a new row when the list is empty, you need to bypass the default `<List>` empty page system by passing `empty={false}` as `<List>` prop.

```tsx
export const ArtistList = () => (
    <List hasCreate empty={false}>
        <EditableDatagrid createForm={<ArtistForm />}>
           {/*...*/}
        </EditableDatagrid>
    </List>
);
```

**Tip**: To display a custom create button, pass a custom component as the [`empty`](./Datagrid.md#empty) `Datagrid>` prop. It can use the [`useEditableDatagridContext`](#useeditabledatagridcontext) hook that allows you to manage the visibility of the creation form.

```tsx
const MyCreateButton = () => (
    <Box>
        <Typography>No books yet</Typography>
        <Typography>Do you want to add one?</Typography>
        <CreateButton label="Create the first book" />
    </Box>
);

export const ArtistList = () => (
    <List hasCreate empty={false}>
        <EditableDatagrid createForm={<ArtistForm />} empty={<MyCreateButton />}>
           {/*...*/}
        </EditableDatagrid>
    </List>
);
```

Feel free to visit the [dedicated stories](https://react-admin.github.io/ra-enterprise/?path=/story/ra-editable-datagrid-empty--custom-empty-in-list) to see more examples.

## `mutationMode`

Use the `mutationMode` prop to specify the [mutation mode](./Edit.html#mutationmode). By default, the `<EditableDatagrid>` uses the `undoable` mutation mode. 

```jsx
<EditableDatagrid mutationMode="undoable">
    {/*...*/}
</EditableDatagrid>
```

## `noDelete`

You can disable the delete button by setting the `noDelete` prop to `true`:

```jsx
<EditableDatagrid noDelete={true}>
    {/*...*/}
</EditableDatagrid>
```

## `<RowForm>`

`<RowForm>` renders a table row with one cell per child. That means that `<RowForm>` and `<EditableDatagrid>` should have the same number of children, and these children should concern the same `source`.

If you want to avoid the edition of a column, use a `<Field>` component instead of an `<Input>` component (like the `<TextField>` in the example above).

`<RowForm>` accepts the following props:

| Prop              | Required | Type         | Default | Description                                                               |
| ----------------- | -------- | ------------ | ------- | ------------------------------------------------------------------------- |
| `mutationOptions` | Optional | `Object` | -       | An object that can contain `onSuccess` and `onError` functions to be executed after the row has been saved and after the row has failed to be saved respectively.   |
| `submitOnEnter`   | Optional | `function` | -       | A function to transform the row before it is saved. |
| `transform`       | Optional | `boolean` | `true`       |  Whether the form can be submitted by pressing the Enter key.                 |

Any additional props passed to `<RowForm>` are passed to the underlying react-admin [`<Form>`](./Form.md) component. That means that you can pass e.g. `defaultValues`, or `validate` props.

{% raw %}
```tsx
import { RowForm } from '@react-admin/ra-editable-datagrid';

const ArtistForm = () => (
    <RowForm defaultValues={{ firstname: 'John', name: 'Doe' }}>
        <TextField source="id" disabled />
        <TextInput source="name" validate={required()} />
    </RowForm>
);
```
{% endraw %}

## `useEditableDatagridContext`

For advanced use cases, you can use the `useEditableDatagridContext` hook to manage the visibility of the creation form. It returns the following callbacks:

-   `openStandaloneCreateForm`: A function to open the create form.
-   `closeStandaloneCreateForm`: A function to close the create form.

```tsx
import React from 'react';
import { Typography, Box } from '@mui/material';
import { CreateButton, List } from 'react-admin';
import {
    EditableDatagrid,
    useEditableDatagridContext,
} from '@react-admin/ra-editable-datagrid';

const MyCreateButton = () => {
    const { openStandaloneCreateForm } = useEditableDatagridContext();
    const handleClick = () => {
        openStandaloneCreateForm();
    };
    return (
        <Box>
            <Typography>No books yet</Typography>
            <Typography>Do you want to add one?</Typography>
            <CreateButton onClick={handleClick} label="Create the first book" />
        </Box>
    );
};

export const BookList = () => (
    <List hasCreate empty={false}>
        <EditableDatagrid empty={<MyCreateButton />}>
           {/*...*/}
        </EditableDatagrid>
    </List>
);
```

Feel free to visit the [dedicated stories](https://react-admin.github.io/ra-enterprise/?path=/story/ra-editable-datagrid-empty--custom-empty-standalone) to see more examples.

## Recipes

### Inside A `<ReferenceManyField>`

Here is another example inside a `<ReferenceManyField>`. The only difference with its usage in a `<List>` is that you have to initialize the foreign key in the create form using the `defaultValues` prop:

{% raw %}
```tsx
import React from 'react';
import {
    DateField,
    DateInput,
    Edit,
    NumberField,
    NumberInput,
    ReferenceManyField,
    required,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { EditableDatagrid, RowForm } from '@react-admin/ra-editable-datagrid';

const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <ReferenceManyField
                fullWidth
                label="Products"
                reference="products"
                target="order_id"
            >
                <EditableDatagrid
                    mutationMode="undoable"
                    createForm={<ProductForm />}
                    editForm={<ProductForm />}
                    rowClick="edit"
                >
                    <TextField source="id" />
                    <TextField source="name" />
                    <NumberField source="price" label="Default Price" />
                    <DateField source="available_since" />
                </EditableDatagrid>
            </ReferenceManyField>
            <DateInput source="purchase_date" />
        </SimpleForm>
    </Edit>
);

const ProductForm = () => {
    const { getValues } = useFormContext();
    return (
        <RowForm defaultValues={{ order_id: getValues('id') }}>
            <TextInput source="id" disabled />
            <TextInput source="name" validate={required()} />
            <NumberInput
                source="price"
                label="Default Price"
                validate={required()}
            />
            <DateInput source="available_since" validate={required()} />
        </RowForm>
    );
};
```
{% endraw %}

In these examples, the same form component is used in `createForm` and `editForm`, but you can pass different forms (e.g. if some fields can be set at creation but not changed afterwards).

### Providing Custom Side Effects

Like other forms in react-admin, you can provide your own side effects in response to successful or failed actions by passing functions to the `onSuccess` or `onError` inside the `mutationOptions` prop:

{% raw %}
```tsx
import { TextInput, DateInput, SelectInput, useNotify } from 'react-admin';
import { RowForm, useRowContext } from '@react-admin/ra-editable-datagrid';

const ArtistEditForm = () => {
    const notify = useNotify();
    const { close } = useRowContext();

    const handleSuccess = response => {
        notify(
            `Artist ${response.name} ${response.firstName} has been updated`
        );
        close();
    };

    return (
        <RowForm mutationOptions={{ onSuccess: handleSuccess }}>
            <TextField source="id" />
            <TextInput source="firstname" validate={required()} />
            <TextInput source="name" validate={required()} />
            <DateInput source="dob" label="born" validate={required()} />
            <SelectInput
                source="prof"
                label="Profession"
                choices={professionChoices}
            />
        </RowForm>
    );
};

const ArtistCreateForm = () => {
    const notify = useNotify();
    const { close } = useRowContext();

    const handleSuccess = response => {
        notify(`Artist ${response.name} ${response.firstName} has been added`);
        close();
    };

    return (
        <RowForm mutationOptions={{ onSuccess: handleSuccess }}>
            <TextInput source="firstname" validate={required()} />
            <TextInput source="name" validate={required()} />
            <DateInput source="dob" label="born" validate={required()} />
            <SelectInput
                source="prof"
                label="Profession"
                choices={professionChoices}
            />
        </RowForm>
    );
};
```
{% endraw %}

Note that we provide an additional side effects hook: `useRowContext` which allows you to close the form.

**Tip**: If you use `useNotify` inside an `onSuccess` side effect for an Edit form in addition to the `<EditableDatagrid mutationMode="undoable">` prop, you will need to set the notification as undoable for the changes to take effects. Also, note that, on undoable forms, the `onSuccess` side effect will be called immediately, without any `response` argument.

```ts
const handleSuccess = () => {
    notify('Artist has been updated', { type: 'info', undoable: true });
    close();
};
```

Besides, the `<RowForm>` also accept a function for its `transform` prop allowing you to alter the data before sending it to the dataProvider:

```tsx
import { TextInput, DateInput, SelectInput } from 'react-admin';
import { RowForm } from '@react-admin/ra-editable-datagrid';

const ArtistCreateForm = () => {
    const handleTransform = data => {
        return {
            ...data,
            fullName: `${data.firstName} ${data.name}`,
        };
    };

    return (
        <RowForm transform={handleTransform}>
            <TextInput source="firstname" validate={required()} />
            <TextInput source="name" validate={required()} />
            <DateInput source="dob" label="born" validate={required()} />
            <SelectInput
                source="prof"
                label="Profession"
                choices={professionChoices}
            />
        </RowForm>
    );
};
```

### Adding A `meta` Prop To All Mutations

Just like with `<Datagrid>`, if you'd like to add a `meta` prop to all the dataProvider calls, you will need to provide custom `mutationOptions` at all the places where mutations occur:

-   the `createForm`
-   the `editForm`
-   the `<DeleteRowButton>`

Here is a complete example:

{% raw %}
```tsx
import * as React from 'react';
import {
    TextInput,
    DateInput,
    SelectInput,
    TextField,
    DateField,
    SelectField,
    required,
    List,
} from 'react-admin';
import {
    EditableDatagrid,
    RowForm,
    RowFormProps,
    EditRowButton,
    DeleteRowButton,
} from '@react-admin/ra-editable-datagrid';

const ArtistForm = ({ meta }) => (
    <RowForm
        defaultValues={{ firstname: 'John', name: 'Doe' }}
        mutationOptions={{ meta }}
    >
        <TextField source="id" />
        <TextInput source="firstname" validate={required()} />
        <TextInput source="name" validate={required()} />
        <DateInput source="dob" label="Born" validate={required()} />
        <SelectInput
            source="prof"
            label="Profession"
            choices={professionChoices}
        />
    </RowForm>
);

const ArtistListWithMeta = () => {
    const meta = { foo: 'bar' };
    return (
        <List hasCreate sort={{ field: 'id', order: 'DESC' }} empty={false}>
            <EditableDatagrid
                createForm={<ArtistForm meta={meta} />}
                editForm={<ArtistForm meta={meta} />}
                rowClick="edit"
                actions={
                    <>
                        <EditRowButton />
                        <DeleteRowButton mutationOptions={{ meta }} />
                    </>
                }
            >
                <TextField source="id" />
                <TextField source="firstname" />
                <TextField source="name" />
                <DateField source="dob" label="Born" />
                <SelectField
                    source="prof"
                    label="Profession"
                    choices={professionChoices}
                />
            </EditableDatagrid>
        </List>
    );
};
```
{% endraw %}

### Configurable

You can let end users customize what fields are displayed in the `<EditableDatagrid>` by using the `<EditableDatagridConfigurable>` component instead, together with the `<RowFormConfigurable>` component.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-editable-datagrid-configurable.mp4" type="video/mp4"/>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-editable-datagrid-configurable.webm" type="video/webm"/>
  Your browser does not support the video tag.
</video>

```diff
import { List, TextField } from 'react-admin';
import {
-   EditableDatagrid,
+   EditableDatagridConfigurable,
-   RowForm,
+   RowFormConfigurable,
} from '@react-admin/ra-editable-datagrid';

const ArtistForm = ({ meta }) => (
-    <RowForm>
+    <RowFormConfigurable>
        <TextField source="id" />
        <TextInput source="firstname" validate={required()} />
        <TextInput source="name" validate={required()} />
        <DateInput source="dob" label="Born" validate={required()} />
        <SelectInput
            source="prof"
            label="Profession"
            choices={professionChoices}
        />
-   </RowForm>
+    </RowFormConfigurable>
);

const ArtistList = () => (
    <List hasCreate empty={false}>
-        <EditableDatagrid
+        <EditableDatagridConfigurable
            mutationMode="undoable"
            createForm={<ArtistForm />}
            editForm={<ArtistForm />}
        >
            <TextField source="id" />
            <TextField source="firstname" />
            <TextField source="name" />
            <DateField source="dob" label="born" />
            <SelectField
                source="prof"
                label="Profession"
                choices={professionChoices}
            />
-        </EditableDatagrid>
+        </EditableDatagridConfigurable>
    </List>
);
```

When users enter the configuration mode and select the `<EditableDatagrid>`, they can show / hide datagrid columns. They can also use the [`<SelectColumnsButton>`](./SelectColumnsButton.md)

By default, `<EditableDatagridConfigurable>` renders all child fields. But you can also omit some of them by passing an `omit` prop containing an array of field sources:

```tsx
// by default, hide the id and author columns
// users can choose to show them in configuration mode
const PostList = () => (
    <List>
        <EditableDatagridConfigurable omit={['id', 'author']}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </EditableDatagridConfigurable>
    </List>
);
```

If you render more than one `<EditableDatagridConfigurable>` in the same page, you must pass a unique `preferenceKey` prop to each one:

```tsx
const PostList = () => (
    <List>
        <EditableDatagridConfigurable preferenceKey="posts.datagrid">
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </EditableDatagridConfigurable>
    </List>
);
```

The inspector uses the field `source` (or `label` when it's a string) to display the column name. If you use non-field children (e.g. action buttons), then it's your responsibility to wrap them in a component with a `label` prop, that will be used by the inspector:

```tsx
const FieldWrapper = ({ children, label }) => children;
const PostList = () => (
    <List>
        <EditableDatagridConfigurable>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
            <FieldWrapper label="Actions">
                <EditButton />
            </FieldWrapper>
        </EditableDatagridConfigurable>
    </List>
);
```

`<EditableDatagridConfigurable>` accepts the same props as `<EditableDatagrid>`.