---
layout: default
title: "CreateInDialogButton"
---

# `<CreateInDialogButton>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> component offers a way to open a `<Create>` view inside a dialog, hence allowing to create a new record without leaving the current view.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-form-layout/latest/CreateInDialogButton.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

It can be useful in case you want the ability to create a record linked by a reference to the currently edited record, or if you have a nested `<Datagrid>` inside a `<Show>` or an `<Edit>` view. 

Note that this component doesn't use routing, so it doesn't change the URL. It's therefore not possible to bookmark the creation dialog, or to link to it from another page. If you need that functionality, use [`<CreateDialog>`](./CreateDialog.md) instead.

## Usage

First, install the `@react-admin/ra-form-layout` package:

```sh
npm install --save @react-admin/ra-form-layout
# or
yarn add @react-admin/ra-form-layout
```

**Tip**: [`ra-form-layout`](https://react-admin-ee.marmelab.com/documentation/ra-form-layout#createindialogbutton-editindialogbutton-and-showindialogbutton) is hosted in a private npm registry. You need to subscribe to one of the [Enterprise Edition](https://react-admin-ee.marmelab.com/) plans to access this package.

Then, put `<CreateInDialogButton>` wherever you would put a `<CreateButton>`, and use the same children as you would for a `<Create>` component (e.g. a `<SimpleForm>`): 

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

## Props

`<CreateInDialogButton>` accepts the following props:

| Prop           | Required | Type              | Default | Description |
| -------------- | -------- | ----------------- | ------- | ----------- |
| `children`     | Required | `ReactNode`       |         | The content of the dialog. |
| `ButtonProps`  | Optional | `object`          |         | Object containing props to pass to Material UI's `<Button>`. |
| `fullWidth`    | Optional | `boolean`         | `false` | If `true`, the dialog stretches to the full width of the screen. |
| `icon`         | Optional | `ReactElement`    |         | Allows to override the default icon. |
| `inline`       | Optional | `boolean`         |         | Set to true to display only a Material UI `<IconButton>` instead of the full `<Button>`. |
| `label`        | Optional | `string`          |         | Allows to override the default button label. I18N is supported. |
| `maxWidth`     | Optional | `string`          | `sm`    | The max width of the dialog. |
| `mutation Options` | Optional | `object`       |         | The options to pass to the `useMutation` hook. |
| `resource`     | Optional | `string`          |         | The resource name, e.g. `posts`
| `sx`           | Optional | `object`          |         | Override the styles applied to the dialog component. |


## `children`

`<CreateInDialogButton>` doesn't render any field by default - it delegates this to its children, usually a Form component.

React-admin provides several built-in form layout components:

- [`SimpleForm`](./SimpleForm.md) for a single-column layout
- [`TabbedForm`](./TabbedForm.md) for a tabbed layout
- [`AccordionForm`](./AccordionForm.md) for long forms with collapsible sections
- [`LongForm`](./LongForm.md) for long forms with a navigation sidebar
- [`WizardForm`](./WizardForm.md) for multi-step forms
- and [`Form`](./Form.md), a headless component to use as a base for your custom layouts

To use an alternative form layout, switch the `<CreateInDialogButton>` child component:

```diff
const CreateButton = () => (
    <CreateInDialogButton fullWidth maxWidth="md">
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
    </CreateInDialogButton>
);
```

## `ButtonProps`

The `ButtonProps` prop allows you to pass props to the MUI `<Button>` component. For instance, to change the color and size of the button:

{% raw %}
```jsx
const CreateButton = () => (
  <CreateInDialogButton ButtonProps={{ color: 'primary', fullWidth: true }}>
      <SimpleForm>
          ...
      </SimpleForm>
  </CreateInDialogButton>
);
```
{% endraw %}

## `fullWidth`

By default, `<CreateInDialogButton>` renders a [Material UI `<Dialog>`](https://mui.com/material-ui/react-dialog/#full-screen-dialogs) component that takes the width of its content.

You can make the dialog full width by setting the `fullWidth` prop to `true`:

```jsx
const CreateButton = () => (
  <CreateInDialogButton fullWidth>
      ...
  </CreateInDialogButton>
);
```

In addition, you can set a dialog maximum width by using the `maxWidth` enumerable in combination with the `fullWidth` boolean. When the `fullWidth` prop is true, the dialog will adapt based on the `maxWidth` value.

```jsx
const CreateButton = () => (
  <CreateInDialogButton fullWidth maxWidth="sm">
      ...
  </CreateInDialogButton>
);
```

## `icon`

The `icon` prop allows you to pass an icon to the button. It can be a MUI icon component, or a custom icon component.

```jsx
import { Create } from '@mui/icons-material';

const CreateButton = () => (
  <CreateInDialogButton icon={<Create />}>
      ...
  </CreateInDialogButton>
);
```

## `inline`

By default, `<CreateInDialogButton>` renders a `<Button>` component. If you want to display only an `<IconButton>`, set the `inline` prop to `true`:

```jsx
const CreateButton = () => (
  <CreateInDialogButton inline>
      ...
  </CreateInDialogButton>
);
```

## `label`

The `label` prop allows you to pass a custom label to the button, instead of the default ("Create"). It can be a string, or a React element.

```jsx
const CreateButton = () => (
  <CreateInDialogButton label="Edit details">
      ...
  </CreateInDialogButton>
);
```

## `maxWidth`

The `maxWidth` prop allows you to set the max width of the dialog. It can be one of the following values: `xs`, `sm`, `md`, `lg`, `xl`, `false`. The default is `sm`.

For example, you can use that prop to make the dialog full width:

```jsx
const CreateButton = () => (
  <CreateInDialogButton fullWidth maxWidth={false}>
      ...
  </CreateInDialogButton>
);
```

## `mutationOptions`

The `mutationOptions` prop allows you to pass options to the `useMutation` hook. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.create()` call.

{% raw %}
```jsx
const CreateButton = () => (
  <CreateInDialogButton mutationOptions={{ meta: { fetch: 'author' } }}>
      ...
  </CreateInDialogButton>
);
```
{% endraw %}

## `resource`

The `resource` prop allows you to pass the resource name to the `<CreateInDialogButton>` component. If not provided, it will be deduced from the resource context.

This is useful to link to a related record. For instance, the following button lets you create the author of a book:

```jsx
const CreateAuthorButton = () => {
  return (
    <CreateInDialogButton resource="authors">
        ...
    </CreateInDialogButton>
  );
};
```

## `sx`

Customize the styles applied to the Material UI `<Dialog>` component:

{% raw %}
```jsx
const CreateButton = () => (
  <CreateInDialogButton sx={{ backgroundColor: 'paper' }}>
      ...
  </CreateInDialogButton>
);
```
{% endraw %}

## Combining With `<EditInDialogButton>`

Below is an example of an `<Edit>` view, inside which is a nested `<Datagrid>`, offering the ability to **create**, **edit** and **show** the rows thanks to `<CreateInDialogButton>`, [`<EditInDialogButton>`](./EditInDialogButton.md) and [`<ShowInDialogButton>`](./ShowInDialogButton.md):

{% raw %}
```jsx
import React from "react";
import {
  Datagrid,
  DateField,
  DateInput,
  Edit,
  ReferenceManyField,
  required,
  SelectField,
  SelectInput,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  useRecordContext,
} from "react-admin";
import {
  CreateInDialogButton,
  EditInDialogButton,
  ShowInDialogButton,
} from "@react-admin/ra-form-layout";

const sexChoices = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];

const CustomerForm = () => (
  <SimpleForm defaultValues={{ firstname: "John", name: "Doe" }}>
    <TextInput source="first_name" validate={required()} fullWidth />
    <TextInput source="last_name" validate={required()} fullWidth />
    <DateInput source="dob" label="born" validate={required()} fullWidth />
    <SelectInput source="sex" choices={sexChoices} fullWidth />
  </SimpleForm>
);

const CustomerLayout = () => (
  <SimpleShowLayout>
    <TextField source="first_name" fullWidth />
    <TextField source="last_name" fullWidth />
    <DateField source="dob" label="born" fullWidth />
    <SelectField source="sex" choices={sexChoices} fullWidth />
  </SimpleShowLayout>
);

// helper component to add actions buttons in a column (children),
// and also in the header (label) of a Datagrid
const DatagridActionsColumn = ({ label, children }) => <>{children}</>;

const NestedCustomersDatagrid = () => {
  const record = useRecordContext();

  const createButton = (
    <CreateInDialogButton
      inline
      fullWidth
      maxWidth="md"
      record={{ employer_id: record?.id }} // pre-populates the employer_id to link the new customer to the current employer
    >
      <CustomerForm />
    </CreateInDialogButton>
  );

  const editButton = (
    <EditInDialogButton fullWidth maxWidth="md">
      <CustomerForm />
    </EditInDialogButton>
  );

  const showButton = (
    <ShowInDialogButton fullWidth maxWidth="md">
      <CustomerLayout />
    </ShowInDialogButton>
  );

  return (
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
        {/* Using a component as label is a trick to render it in the Datagrid header */}
        <DatagridActionsColumn label={createButton}>
          {editButton}
          {showButton}
        </DatagridActionsColumn>
      </Datagrid>
    </ReferenceManyField>
  );
};

const EmployerEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="address" validate={required()} />
      <TextInput source="city" validate={required()} />
      <NestedCustomersDatagrid />
    </SimpleForm>
  </Edit>
);
```
{% endraw %}
