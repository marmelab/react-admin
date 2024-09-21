---
layout: default
title: "CreateDialog"
---

# `<CreateDialog>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> component offers a replacement to [the `<Create>` component](./Create.md) allowing users to create records without leaving the context of the list page.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/create-dialog.mp4" type="video/mp4" />
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

Then, add the `<CreateDialog>` component as a sibling to a `<List>` component.

```jsx
import {
    List,
    ListActions,
    Datagrid,
    SimpleForm,
    TextInput,
    DateInput,
    DateField,
    required,
} from 'react-admin';
import { CreateDialog } from '@react-admin/ra-form-layout';

const CustomerList = () => (
    <>
        <List actions={<ListActions hasCreate />}>
            <Datagrid>
                ...
            </Datagrid>
        </List>
        <CreateDialog>
            <SimpleForm>
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="date_of_birth" />
            </SimpleForm>
        </CreateDialog>
    </>
);
```

**Tip**: In the example above, notice the `<List actions>` prop. It is necessary in order to display the "Create" button, because react-admin has no way of knowing that creation form for the "customer" resource exists.

In the related `<Resource>`, you don't need to declare a `create` component as the creation UI is part of the `list` component:

```jsx
<Resource name="customers" list={CustomerList} />
```

**Note**: You can't use the `<CreateDialog>` and have a standard `<Edit>` specified on your `<Resource>`, because the `<Routes>` declarations would conflict. If you need this, use the [`<CreateInDialogButton>`](./CreateInDialogButton.md) instead.

## Props

`<CreateDialog>` accepts the following props:

| Prop           | Required | Type              | Default | Description |
| -------------- | -------- | ----------------- | ------- | ----------- |
| `children`     | Required | `ReactNode`       |         | The content of the dialog. |
| `fullWidth`    | Optional | `boolean`         | `false` | If `true`, the dialog stretches to the full width of the screen. |
| `maxWidth`     | Optional | `string`          | `sm`    | The max width of the dialog. |
| `mutation Options` | Optional | `object`       |         | The options to pass to the `useMutation` hook. |
| `resource`     | Optional | `string`          |         | The resource name, e.g. `posts`
| `sx`           | Optional | `object`          |         | Override the styles applied to the dialog component. |
| `transform`    | Optional | `function`        |         | Transform the form data before calling `dataProvider.create()`. |

## `children`

`<CreateDialog>` doesn't render any field by default - it delegates this to its children, usually a Form component.

React-admin provides several built-in form layout components:

- [`SimpleForm`](./SimpleForm.md) for a single-column layout
- [`TabbedForm`](./TabbedForm.md) for a tabbed layout
- [`AccordionForm`](./AccordionForm.md) for long forms with collapsible sections
- [`LongForm`](./LongForm.md) for long forms with a navigation sidebar
- [`WizardForm`](./WizardForm.md) for multi-step forms
- and [`Form`](./Form.md), a headless component to use as a base for your custom layouts

To use an alternative form layout, switch the `<CreateDialog>` child component:

```diff
const MyCreateDialog = () => (
    <CreateDialog fullWidth maxWidth="md">
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
    </CreateDialog>
);
```

## `fullWidth`

By default, `<CreateDialog>` renders a [Material UI `<Dialog>`](https://mui.com/material-ui/react-dialog/#full-screen-dialogs) component that takes the width of its content.

You can make the dialog full width by setting the `fullWidth` prop to `true`:

```jsx
const MyCreateDialog = () => (
  <CreateDialog fullWidth>
      ...
  </CreateDialog>
);
```

In addition, you can set a dialog maximum width by using the `maxWidth` enumerable in combination with the `fullWidth` boolean. When the `fullWidth` prop is true, the dialog will adapt based on the `maxWidth` value.

```jsx
const MyCreateDialog = () => (
  <CreateDialog fullWidth maxWidth="sm">
      ...
  </CreateDialog>
);
```

## `maxWidth`

The `maxWidth` prop allows you to set the max width of the dialog. It can be one of the following values: `xs`, `sm`, `md`, `lg`, `xl`, `false`. The default is `sm`.

For example, you can use that prop to make the dialog full width:

```jsx
const MyCreateDialog = () => (
  <CreateDialog fullWidth maxWidth={false}>
      ...
  </CreateDialog>
);
```

## `mutationOptions`

The `mutationOptions` prop allows you to pass options to the `useMutation` hook. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.create()` call.

{% raw %}
```jsx
const MyCreateDialog = () => (
  <CreateDialog mutationOptions={{ meta: { fetch: 'author' } }}>
      ...
  </CreateDialog>
);
```
{% endraw %}

## `resource`

The `resource` prop allows you to pass the resource name to the `<CreateDialog>` component. If not provided, it will be deduced from the resource context.

This is useful to link to a related record. For instance, the following dialog lets you create the author of a book:

```jsx
const EditAuthorDialog = () => {
  const book = useRecordContext();
  return (
    <CreateDialog resource="authors">
        ...
    </CreateDialog>
  );
};
```

## `sx`

Customize the styles applied to the Material UI `<Dialog>` component:

{% raw %}
```jsx
const MyCreateDialog = () => (
  <CreateDialog sx={{ backgroundColor: 'paper' }}>
      ...
  </CreateDialog>
);
```
{% endraw %}

## `transform`

To transform a record after the user has submitted the form but before the record is passed to `dataProvider.create()`, use the `transform` prop. It expects a function taking a record as argument, and returning a modified record. For instance, to add a computed field upon edition:

```jsx
export const UseCreate = () => {
    const transform = data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    });
    return (
        <CreateDialog transform={transform}>
            ...
        </CreateDialog>
    );
}
```

The `transform` function can also return a `Promise`, which allows you to do all sorts of asynchronous calls (e.g. to the `dataProvider`) during the transformation.

**Tip**: If you want to have different transformations based on the button clicked by the user (e.g. if the creation form displays two submit buttons, one to "save", and another to "save and notify other admins"), you can set the `transform` prop on [the `<SaveButton>` component](./SaveButton.md), too.

**Tip**: The `transform` function also gets the `previousData` in its second argument:

```jsx
export const UseCreate = () => {
    const transform = (data, { previousData }) => ({
        ...data,
        avoidChangeField: previousData.avoidChangeField
    });
    return (
        <CreateDialog transform={transform}>
            ...
        </CreateDialog>
    );
}
```

## Usage Without Routing

By default, `<CreateDialog>` creates a react-router `<Route>` for the creation path (e.g. `/posts/create`), and renders when users go to that location (either by clicking on a `<CreateButton>`, or by typing the URL in the browser). If you embed it in the `list` page as explained above, the dialog will always render on top of the list. 

This may not be what you want if you need to display the creation dialog in another page (e.g. to create a related record).

In that case, use [the `<CreateInDialogButton>` component](./CreateInDialogButton.md), which doesn't create a route, but renders the dialog when the user clicks on it.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-form-layout/latest/CreateInDialogButton.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Put `<CreateInDialogButton>` wherever you would put a `<CreateButton>`, and use the same children as you would for a `<Create>` component (e.g. a `<SimpleForm>`). Don't forget to preset the `record` prop if you want to initialize the form with a foreign key.

{% raw %}
```jsx
import {
  Datagrid,
  ReferenceManyField,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  WithRecord,
} from "react-admin";
import { CreateInDialogButton } from "@react-admin/ra-form-layout";

const CompanyShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="name" />
            <TextField source="address" />
            <TextField source="city" />
            <ReferenceManyField target="company_id" reference="employees">
                <WithRecord render={record => (
                    <CreateInDialogButton record={{ company_id: record.id }}>
                        <SimpleForm>
                            <TextInput source="first_name" />
                            <TextInput source="last_name" />
                        </SimpleForm>
                    </CreateInDialogButton>
                )} />
                <Datagrid>
                    <TextField source="first_name" />
                    <TextField source="last_name" />
                </Datagrid>
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);
```
{% endraw %}

In the above example, `<CreateInDialogButton>` is used to create a new employee for the current company. [The `<WithRecord>` component](./WithRecord.md) helps to set the new employee company id by default.

## Standalone Usage

`<CreateDialog>` also offer the ability to work standalone, without using the Router's location.

To allow for standalone usage, they require the following props:

-   `isOpen`: a boolean holding the open/close state
-   `open`: a function that will be called when a component needs to open the dialog (e.g. a button)
-   `close`: a function that will be called when a component needs to close the dialog (e.g. the dialog's close button)

**Tip:** These props are exactly the same as what is stored inside a `FormDialogContext`. This means that you can also rather provide your own `FormDialogContext` with these values, and render your dialog component inside it, to activate standalone mode.

Below is an example of an `<Edit>` page, including a 'create a new customer' button, that opens a fully controlled `<CreateDialog>`.

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
import { CreateDialog } from '@react-admin/ra-form-layout';

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

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const openCreateDialog = useCallback(() => {
        setIsCreateDialogOpen(true);
    }, []);
    const closeCreateDialog = useCallback(() => {
        setIsCreateDialogOpen(false);
    }, []);

    return (
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <TextInput source="address" validate={required()} />
            <TextInput source="city" validate={required()} />
            <Button
                label="Create a new customer"
                onClick={() => openCreateDialog()}
                size="medium"
                variant="contained"
                sx={{ mb: 4 }}
            />
            <CreateDialog
                fullWidth
                maxWidth="md"
                record={{ employer_id: record?.id }} // pre-populates the employer_id to link the new customer to the current employer
                isOpen={isCreateDialogOpen}
                open={openCreateDialog}
                close={closeCreateDialog}
                resource="customers"
            >
                <CustomerForm />
            </CreateDialog>
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
                </Datagrid>
            </ReferenceManyField>
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
