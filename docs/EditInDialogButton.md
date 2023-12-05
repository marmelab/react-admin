---
layout: default
title: "EditInDialogButton"
---

# `<EditInDialogButton>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component renders a button opening an `<Edit>` view inside a dialog, hence allowing to edit a record without leaving the current view.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/InDialogButtons.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/InDialogButtons.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

It can be useful in case you want the ability to edit a record linked by a reference to the currently edited record, or if you have a nested `<Datagrid>` inside a `<Show>` or an `<Edit>` view. 

Note that this component doesn't use routing, so it doesn't change the URL. It's therefore not possible to bookmark the edit dialog, or to link to it from another page. If you need that functionality, use [`<EditDialog>`](./EditDialog.md) instead.

## Usage

First, install the `@react-admin/ra-form-layout` package:

```sh
npm install --save @react-admin/ra-form-layout
# or
yarn add @react-admin/ra-form-layout
```

**Tip**: [`ra-form-layout`](https://marmelab.com/ra-enterprise/modules/ra-form-layout#createindialogbutton-editindialogbutton-and-EditInDialogButton) is hosted in a private npm registry. You need to subscribe to one of the [Enterprise Edition](https://marmelab.com/ra-enterprise/) plans to access this package.

Then, put `<EditInDialogButton>` wherever you would put an `<EditButton>`, and use the same children as you would for an [`<Edit>`](./Edit.md) component (e.g. a `<SimpleForm>`): 

```jsx
import {
  Datagrid,
  ReferenceManyField,
  Show,
  SimpleForm,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";
import { EditInDialogButton } from "@react-admin/ra-form-layout";

const CompanyShow = () => (
    <Show>
        <SimpleForm>
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
        </SimpleForm>
    </Show>
);
```

## Props

`<EditInDialogButton>` accepts the following props:

| Prop           | Required | Type              | Default | Description |
| -------------- | -------- | ----------------- | ------- | ----------- |
| `children`     | Required | `ReactNode`       |         | The content of the dialog. |
| `ButtonProps`  | Optional | `object`          |         | Object containing props to pass to Material UI's `<Button>`. |
| `empty WhileLoading` | Optional | `boolean`   |         | Set to `true` to return `null` while the list is loading. |
| `fullWidth`    | Optional | `boolean`         | `false` | If `true`, the dialog stretches to the full width of the screen. |
| `icon`         | Optional | `ReactElement`    |         | Allows to override the default icon. |
| `id`           | Optional | `string | number` |         | The record id. If not provided, it will be deduced from the record context. |
| `inline`       | Optional | `boolean`         |         | Set to true to display only a Material UI `<IconButton>` instead of the full `<Button>`. |
| `label`        | Optional | `string`          |         | Allows to override the default button label. I18N is supported. |
| `maxWidth`     | Optional | `string`          | `sm`    | The max width of the dialog. |
| `mutation Options` | Optional | `object`       |         | The options to pass to the `useMutation` hook. |
| `queryOptions` | Optional | `object`          |         | The options to pass to the `useQuery` hook.
| `resource`     | Optional | `string`          |         | The resource name, e.g. `posts`
| `sx`           | Optional | `object`          |         | Override the styles applied to the dialog component. |

## `children`

`<EditInDialogButton>` doesn't render any field by default - it delegates this to its children, usually a Form component.

React-admin provides several built-in form layout components:

- [`SimpleForm`](./SimpleForm.md) for a single-column layout
- [`TabbedForm`](./TabbedForm.md) for a tabbed layout
- [`AccordionForm`](./AccordionForm.md) for long forms with collapsible sections
- [`LongForm`](./LongForm.md) for long forms with a navigation sidebar
- [`WizardForm`](./WizardForm.md) for multi-step forms
- [`EditDialog`](./EditDialog.md) for sub-forms in a modal dialog
- and [`Form`](./Form.md), a headless component to use as a base for your custom layouts

To use an alternative form layout, switch the `<EditInDialogButton>` child component:

```diff
const EditButton = () => (
    <EditInDialogButton fullWidth maxWidth="md">
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
    </EditInDialogButton>
);
```

## `ButtonProps`

The `ButtonProps` prop allows you to pass props to the MUI `<Button>` component. For instance, to change the color and size of the button:

{% raw %}
```jsx
const EditButton = () => (
  <EditInDialogButton ButtonProps={{ color: 'primary', fullWidth: true }}>
      <SimpleForm>
          ...
      </SimpleForm>
  </EditInDialogButton>
);
```
{% endraw %}

## `emptyWhileLoading`

By default, `<EditInDialogButton>` renders its child component even before the `dataProvider.getOne()` call returns. If you use `<SimpleForm>` or `<TabbedForm>`, this isn't a problem as these components only render when the record has been fetched. But if you use a custom child component that expects the record context to be defined, your component will throw an error.

To avoid this, set the `emptyWhileLoading` prop to `true`:

```jsx
const EditButton = () => (
  <EditInDialogButton emptyWhileLoading>
      ...
  </EditInDialogButton>
);
```

## `fullWidth`

By default, `<EditInDialogButton>` renders a [Material UI `<Dialog>`](https://mui.com/material-ui/react-dialog/#full-screen-dialogs) component that takes the width of its content.

You can make the dialog full width by setting the `fullWidth` prop to `true`:

```jsx
const EditButton = () => (
  <EditInDialogButton fullWidth>
      ...
  </EditInDialogButton>
);
```

In addition, you can set a dialog maximum width by using the `maxWidth` enumerable in combination with the `fullWidth` boolean. When the `fullWidth` prop is true, the dialog will adapt based on the `maxWidth` value.

```jsx
const EditButton = () => (
  <EditInDialogButton fullWidth maxWidth="sm">
      ...
  </EditInDialogButton>
);
```

## `icon`

The `icon` prop allows you to pass an icon to the button. It can be a MUI icon component, or a custom icon component.

```jsx
import { Edit } from '@mui/icons-material';

const EditButton = () => (
  <EditInDialogButton icon={<Edit />}>
      ...
  </EditInDialogButton>
);
```

## `id`

The `id` prop allows you to pass the record id to the `<EditInDialogButton>` component. If not provided, it will be deduced from the record context.

This is useful to link to a related record. For instance, the following button lets you show the author of a book:

```jsx
const EditAuthorButton = () => {
  const book = useRecordContext();
  return (
    <EditInDialogButton resource="authors" id={book.author_id}>
        ...
    </EditInDialogButton>
  );
};
```

## `inline`

By default, `<EditInDialogButton>` renders a `<Button>` component. If you want to display only an `<IconButton>`, set the `inline` prop to `true`:

```jsx
const EditButton = () => (
  <EditInDialogButton inline>
      ...
  </EditInDialogButton>
);
```

## `label`

The `label` prop allows you to pass a custom label to the button, instead of the default ("Edit"). It can be a string, or a React element.

```jsx
const EditButton = () => (
  <EditInDialogButton label="Edit details">
      ...
  </EditInDialogButton>
);
```

## `maxWidth`

The `maxWidth` prop allows you to set the max width of the dialog. It can be one of the following values: `xs`, `sm`, `md`, `lg`, `xl`, `false`. The default is `sm`.

For example, you can use that prop to make the dialog full width:

```jsx
const EditButton = () => (
  <EditInDialogButton fullWidth maxWidth={false}>
      ...
  </EditInDialogButton>
);
```

## `mutationOptions`

The `queryOptions` prop allows you to pass options to the `useMutation` hook. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.update()` call.

{% raw %}
```jsx
const EditButton = () => (
  <EditInDialogButton mutationOptions={{ meta: { fetch: 'author' } }}>
      ...
  </EditInDialogButton>
);
```
{% endraw %}

## `queryOptions`

The `queryOptions` prop allows you to pass options to the `useQuery` hook. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.getOne()` call.

{% raw %}
```jsx
const EditButton = () => (
  <EditInDialogButton queryOptions={{ meta: { fetch: 'author' } }}>
      ...
  </EditInDialogButton>
);
```
{% endraw %}

## `resource`

The `resource` prop allows you to pass the resource name to the `<EditInDialogButton>` component. If not provided, it will be deduced from the resource context.

This is useful to link to a related record. For instance, the following button lets you show the author of a book:

```jsx
const EditAuthorButton = () => {
  const book = useRecordContext();
  return (
    <EditInDialogButton resource="authors" id={book.author_id}>
        ...
    </EditInDialogButton>
  );
};
```

## `sx`

Customize the styles applied to the Material UI `<Dialog>` component:

{% raw %}
```jsx
const EditButton = () => (
  <EditInDialogButton sx={{ backgroundColor: 'paper' }}>
      ...
  </EditInDialogButton>
);
```
{% endraw %}

## Redirection After Deletion

If you use `<SimpleForm>` as child of `<EditInDialogButton>`, the default form toolbar includes a `<DeleteButton>`. And upon deletion, this button redirects to the current resource list. This is probably not what you want, so it's common to customize the form toolbar to disable the redirection after deletion:

{% raw %}
```tsx
// src/CustomToolbar.tsx
import { Toolbar, SaveButton, DeleteButton } from 'react-admin';

export const CustomToolbar = () => (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
        <SaveButton />
        <DeleteButton redirect={false} />
    </Toolbar>
);

// src/EmployerEdit.tsx
import { Edit, SimpleForm, TextInput, ReferenceManyField } from 'react-admin';
import { EditInDialogButton } from '@react-admin/ra-form-layout';
import { CustomToolbar } from './CustomToolbar';

const EmployerEdit = () => (
    <Edit>
        <SimpleForm>
            ...
            <ReferenceManyField target="employer_id" reference="customers">
                <Datagrid>
                    ...
                    <EditInDialogButton fullWidth maxWidth="sm">
                        <SimpleForm toolbar={<CustomToolbar />}>
                            <TextInput source="first_name" />
                            <TextInput source="last_name" />
                        </SimpleForm>
                    </EditInDialogButton>
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

## Combining With `<CreateInDialogButton>`

Below is an example of an `<Edit>` view, inside which is a nested `<Datagrid>`, offering the ability to **create**, **edit** and **show** the rows thanks to [`<CreateInDialogButton>`](./CreateInDialogButton.md), `<EditInDialogButton>` and [`<ShowInDialogButton>`](./ShowInDialogButton.md):

{% raw %}
```jsx
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


