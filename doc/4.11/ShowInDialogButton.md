---
layout: default
title: "ShowInDialogButton"
---

# `<ShowInDialogButton>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers a way to open a `<Show>` view inside a dialog, hence allowing to show a record without leaving the current view.

It can be useful in case you want the ability to show a record linked by a reference to the currently edited record, or if you have a nested `<Datagrid>` inside a `<Show>` or an `<Edit>` view. 

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/InDialogButtons.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/InDialogButtons.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Below is an example of an `<Edit>` view, inside which is a nested `<Datagrid>`, offering the ability to **create**, **edit** and **show** the rows thanks to `<CreateInDialogButton>`, `<EditInDialogButton>` and `<ShowInDialogButton>`:

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

const CustomerForm = (props) => (
  <SimpleForm defaultValues={{ firstname: "John", name: "Doe" }} {...props}>
    <TextInput source="first_name" validate={required()} fullWidth />
    <TextInput source="last_name" validate={required()} fullWidth />
    <DateInput source="dob" label="born" validate={required()} fullWidth />
    <SelectInput source="sex" choices={sexChoices} fullWidth />
  </SimpleForm>
);

const CustomerLayout = (props) => (
  <SimpleShowLayout {...props}>
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

Check out [the `ra-form-layout` documentation](https://marmelab.com/ra-enterprise/modules/ra-form-layout#createindialogbutton-editindialogbutton-and-showindialogbutton) for more details.

