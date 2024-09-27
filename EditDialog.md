---
layout: default
title: "EditDialog"
---

# `<EditDialog>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> component offers a replacement to [the `<Edit>` component](./Edit.md) allowing users to update records without leaving the context of the list page.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/edit-dialog.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Usage

First, install the `@react-admin/ra-form-layout` package:

```sh
npm install --save @react-admin/ra-form-layout
# or
yarn add @react-admin/ra-form-layout
```

**Tip**: [`ra-form-layout`](https://react-admin-ee.marmelab.com/documentation/ra-form-layout#createdialog-editdialog--showdialog) is hosted in a private npm registry. You need to subscribe to one of the [Enterprise Edition](https://react-admin-ee.marmelab.com/) plans to access this package.

Then, add the `<EditDialog>` component as a sibling to a `<List>` component.

```jsx
import {
    List,
    Datagrid,
    SimpleForm,
    TextField,
    TextInput,
    DateInput,
    DateField,
    required,
} from 'react-admin';
import { EditDialog } from '@react-admin/ra-form-layout';

const CustomerList = () => (
    <>
        <List>
            <Datagrid rowClick="edit">
                ...
            </Datagrid>
        </List>
        <EditDialog>
            <SimpleForm>
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="date_of_birth" />
            </SimpleForm>
        </EditDialog>
    </>
);
```

In the related `<Resource>`, you don't need to declare an `edit` component as the edition UI is part of the `list` component:

```jsx
<Resource name="customers" list={CustomerList} />
```

## Props

`<EditDialog>` accepts the following props:

| Prop           | Required | Type              | Default | Description |
| -------------- | -------- | ----------------- | ------- | ----------- |
| `children`     | Required | `ReactNode`       |         | The content of the dialog. |
| `fullWidth`    | Optional | `boolean`         | `false` | If `true`, the dialog stretches to the full width of the screen. |
| `id`           | Optional | `string | number` |         | The record id. If not provided, it will be deduced from the record context. |
| `maxWidth`     | Optional | `string`          | `sm`    | The max width of the dialog. |
| `mutation Options` | Optional | `object`       |         | The options to pass to the `useMutation` hook. |
| `queryOptions` | Optional | `object`          |         | The options to pass to the `useQuery` hook.
| `resource`     | Optional | `string`          |         | The resource name, e.g. `posts`
| `sx`           | Optional | `object`          |         | Override the styles applied to the dialog component. |
| `transform`    | Optional | `function`        |         | Transform the form data before calling `dataProvider.update()`. |

## `children`

`<EditDialog>` doesn't render any field by default - it delegates this to its children, usually a Form component.

React-admin provides several built-in form layout components:

- [`SimpleForm`](./SimpleForm.md) for a single-column layout
- [`TabbedForm`](./TabbedForm.md) for a tabbed layout
- [`AccordionForm`](./AccordionForm.md) for long forms with collapsible sections
- [`LongForm`](./LongForm.md) for long forms with a navigation sidebar
- [`WizardForm`](./WizardForm.md) for multi-step forms
- and [`Form`](./Form.md), a headless component to use as a base for your custom layouts

To use an alternative form layout, switch the `<EditDialog>` child component:

```diff
const MyEditDialog = () => (
    <EditDialog fullWidth maxWidth="md">
-       <SimpleForm>
+       <TabbedForm>
+           <TabbedForm.Tab label="Identity">
                <TextInput source="first_name" fullWidth />
                <TextInput source="last_name" fullWidth />
+           </TabbedForm.Tab>
+           <TabbedForm.Tab label="Informations">
                <DateInput source="dob" label="born" fullWidth />
                <SelectInput source="sex" choices={sexChoices} fullWidth />
+           </TabbedForm.Tab>
-       </SimpleForm>
+       </TabbedForm>
    </EditDialog>
);
```

## `fullWidth`

By default, `<EditDialog>` renders a [Material UI `<Dialog>`](https://mui.com/material-ui/react-dialog/#full-screen-dialogs) component that takes the width of its content.

You can make the dialog full width by setting the `fullWidth` prop to `true`:

```jsx
const MyEditDialog = () => (
  <EditDialog fullWidth>
      ...
  </EditDialog>
);
```

In addition, you can set a dialog maximum width by using the `maxWidth` enumerable in combination with the `fullWidth` boolean. When the `fullWidth` prop is true, the dialog will adapt based on the `maxWidth` value.

```jsx
const MyEditDialog = () => (
  <EditDialog fullWidth maxWidth="sm">
      ...
  </EditDialog>
);
```

## `id`

The `id` prop allows you to pass the record id to the `<EditDialog>` component. If not provided, it will be deduced from the record context.

This is useful to link to a related record. For instance, the following dialog lets you show the author of a book:

```jsx
const EditAuthorDialog = () => {
  const book = useRecordContext();
  return (
    <EditDialog resource="authors" id={book.author_id}>
        ...
    </EditDialog>
  );
};
```

## `maxWidth`

The `maxWidth` prop allows you to set the max width of the dialog. It can be one of the following values: `xs`, `sm`, `md`, `lg`, `xl`, `false`. The default is `sm`.

For example, you can use that prop to make the dialog full width:

```jsx
const MyEditDialog = () => (
  <EditDialog fullWidth maxWidth={false}>
      ...
  </EditDialog>
);
```

## `mutationOptions`

The `mutationOptions` prop allows you to pass options to the `useMutation` hook. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.update()` call.

{% raw %}
```jsx
const MyEditDialog = () => (
  <EditDialog mutationOptions={{ meta: { fetch: 'author' } }}>
      ...
  </EditDialog>
);
```
{% endraw %}

## `queryOptions`

The `queryOptions` prop allows you to pass options to the `useQuery` hook. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.getOne()` call.

{% raw %}
```jsx
const MyEditDialog = () => (
  <EditDialog queryOptions={{ meta: { fetch: 'author' } }}>
      ...
  </EditDialog>
);
```
{% endraw %}

## `resource`

The `resource` prop allows you to pass the resource name to the `<EditDialog>` component. If not provided, it will be deduced from the resource context.

This is useful to link to a related record. For instance, the following dialog lets you show the author of a book:

```jsx
const EditAuthorDialog = () => {
  const book = useRecordContext();
  return (
    <EditDialog resource="authors" id={book.author_id}>
        ...
    </EditDialog>
  );
};
```

## `sx`

Customize the styles applied to the Material UI `<Dialog>` component:

{% raw %}
```jsx
const MyEditDialog = () => (
  <EditDialog sx={{ backgroundColor: 'paper' }}>
      ...
  </EditDialog>
);
```
{% endraw %}

## `transform`

To transform a record after the user has submitted the form but before the record is passed to `dataProvider.update()`, use the `transform` prop. It expects a function taking a record as argument, and returning a modified record. For instance, to add a computed field upon edition:

```jsx
export const UserEdit = () => {
    const transform = data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    });
    return (
        <EditDialog transform={transform}>
            ...
        </EditDialog>
    );
}
```

The `transform` function can also return a `Promise`, which allows you to do all sorts of asynchronous calls (e.g. to the `dataProvider`) during the transformation.

**Tip**: If you want to have different transformations based on the button clicked by the user (e.g. if the creation form displays two submit buttons, one to "save", and another to "save and notify other admins"), you can set the `transform` prop on [the `<SaveButton>` component](./SaveButton.md), too.

**Tip**: The `transform` function also gets the `previousData` in its second argument:

```jsx
export const UserEdit = () => {
    const transform = (data, { previousData }) => ({
        ...data,
        avoidChangeField: previousData.avoidChangeField
    });
    return (
        <EditDialog transform={transform}>
            ...
        </EditDialog>
    );
}
```

## Usage Without Routing

By default, `<EditDialog>` creates a react-router `<Route>` for the edition path (e.g. `/posts/2`), and renders when users go to that location (either by clicking on a datagrid row, or by typing the URL in the browser). If you embed it in the `list` page as explained above, the dialog will always render on top of the list. 

This may not be what you want if you need to display the edit dialog in another page (e.g. to edit a related record).

In that case, use [the `<EditInDialogButton>` component](./EditInDialogButton.md), which doesn't create a route, but renders the dialog when the user clicks on it.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-form-layout/latest/InDialogButtons.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Put `<EditInDialogButton>` wherever you would put an `<EditButton>`, and use the same children as you would for an `<Edit>` component (e.g. a `<SimpleForm>`): 

```jsx
import {
  Datagrid,
  ReferenceManyField,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";
import { EditInDialogButton } from "@react-admin/ra-form-layout";

const CompanyShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="name" />
            <TextField source="address" />
            <TextField source="city" />
            <ReferenceManyField target="company_id" reference="employees">
                <Datagrid>
                    <TextField source="first_name" />
                    <TextField source="last_name" />
                    <EditInDialogButton>
                        <SimpleForm>
                            <TextInput source="first_name" />
                            <TextInput source="last_name" />
                        </SimpleForm>
                    </EditInDialogButton>
                </Datagrid>
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);
```

Check [the `<EditInDialogButton>` component](./EditInDialogButton.md) for more details.

## Standalone Usage

`<EditDialog>` also offer the ability to work standalone, without using the Router's location.

To allow for standalone usage, they require the following props:

-   `isOpen`: a boolean holding the open/close state
-   `open`: a function that will be called when a component needs to open the dialog (e.g. a button)
-   `close`: a function that will be called when a component needs to close the dialog (e.g. the dialog's close button)

**Tip:** These props are exactly the same as what is stored inside a `FormDialogContext`. This means that you can also rather provide your own `FormDialogContext` with these values, and render your dialog component inside it, to activate standalone mode.

Below is an example of an `<Edit>` page, including a 'create a new customer' button, that opens a fully controlled `<EditDialog>`.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/FullyControlledCreateDialog.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

{% raw %}

```tsx
import React, { useCallback, useState } from 'react';
import {
    Button,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    ReferenceManyField,
    required,
    SelectField,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
    useRecordContext,
} from 'react-admin';
import { EditDialog } from '@react-admin/ra-form-layout';

const sexChoices = [
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
];

const CustomerForm = (props: any) => (
    <SimpleForm defaultValues={{ firstname: 'John', name: 'Doe' }} {...props}>
        <TextInput source="first_name" validate={required()} />
        <TextInput source="last_name" validate={required()} />
        <DateInput source="dob" label="born" validate={required()} />
        <SelectInput source="sex" choices={sexChoices} />
    </SimpleForm>
);

const EmployerSimpleFormWithFullyControlledDialogs = () => {
    const record = useRecordContext();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const openEditDialog = useCallback(() => {
        setIsEditDialogOpen(true);
    }, []);
    const closeEditDialog = useCallback(() => {
        setIsEditDialogOpen(false);
    }, []);

    return (
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <TextInput source="address" validate={required()} />
            <TextInput source="city" validate={required()} />
            <ReferenceManyField
                label="Customers"
                reference="customers"
                target="employer_id"
            >
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="first_name" />
                    <TextField source="last_name" />
                    <DateField source="dob" label="born" />
                    <SelectField source="sex" choices={sexChoices} />
                    <Button
                        label="Edit customer"
                        onClick={() => openEditDialog()}
                        size="medium"
                        variant="contained"
                        sx={{ mb: 4 }}
                    />
                </Datagrid>
            </ReferenceManyField>
            <EditDialog
                fullWidth
                maxWidth="md"
                record={{ employer_id: record?.id }} // pre-populates the employer_id to link the new customer to the current employer
                isOpen={isEditDialogOpen}
                open={openEditDialog}
                close={closeEditDialog}
                resource="customers"
            >
                <CustomerForm />
            </EditDialog>
        </SimpleForm>
    );
};

const EmployerEdit = () => (
    <Edit>
        <EmployerSimpleFormWithFullyControlledDialogs />
    </Edit>
);
```

{% endraw %}
