---
layout: default
title: "EditDialog"
---

# `<EditDialog>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers a replacement to [the `<Edit>` component](./Edit.md) allowing users to update records without leaving the context of the list page.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/edit-dialog.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/edit-dialog.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Usage

Add the `<EditDialog>` component as a sibling to a `<List>` component.

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

`<EditDialog>` accepts the same props as the [`<Edit>`](./Edit.md) component, and the same type of children (e.g. a [`<SimpleForm>`](./SimpleForm.md) element).

* `children`: the components that renders the form
* `className`: passed to the root component
* [`component`](./Edit.md#component): override the root component
* [`disableAuthentication`](./Edit.md#disableauthentication): disable the authentication check
* [`id`](./Edit.md#id): the id of the record to edit
* [`mutationMode`](./Edit.md#mutationmode): switch to optimistic or pessimistic mutations (undoable by default)
* [`mutationOptions`](./Edit.md#mutationoptions): options for the `dataProvider.update()` call
* [`queryOptions`](./Edit.md#queryoptions): options for the `dataProvider.getOne()` call
* [`redirect`](./Edit.md#redirect): change the redirect location after successful creation
* [`resource`](./Edit.md#resource): override the name of the resource to create
* [`sx`](./Edit.md#sx-css-api): Override the styles
* [`title`](./Edit.md#title): override the page title
* [`transform`](./Edit.md#transform): transform the form data before calling `dataProvider.update()`

Check [the `ra-form-layout` documentation](https://marmelab.com/ra-enterprise/modules/ra-form-layout#createdialog-editdialog--showdialog) for more details.

## Usage Without Routing

By default, `<EditDialog>` creates a react-router `<Route>` for the edition path (e.g. `/posts/2`), and renders when users go to that location (either by clicking on a datagrid row, or by typing the URL in the browser). If you embed it in the `list` page as explained above, the dialog will always render on top of the list. 

This may not be what you want if you need to display the edit dialog in another page (e.g. to edit a related record).

In that case, use [the `<EditInDialogButton>` component](./EditInDialogButton.md), which doesn't create a route, but renders the dialog when the user clicks on it.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/InDialogButtons.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/InDialogButtons.mp4" type="video/mp4" />
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