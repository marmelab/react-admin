---
layout: default
title: "CreateDialog"
---

# `<CreateDialog>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers a replacement to [the `<Create>` component](./Create.md) allowing users to create records without leaving the context of the list page.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/create-dialog.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/create-dialog.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Usage

Add the `<CreateDialog>` component as a sibling to a `<List>` component.

```jsx
import {
    List,
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
        <List hasCreate>
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

**Tip**: In the example above, notice the `<List hasCreate>` prop. It is necessary in order to display the "Create" button, because react-admin has no way of knowing that creation form for the "customer" resource exists.

In the related `<Resource>`, you don't need to declare a `create` component as the creation UI is part of the `list` component:

```jsx
<Resource name="customers" list={CustomerList} />
```

**Note**: You can't use the `<CreateDialog>` and have a standard `<Edit>` specified on your `<Resource>`, because the `<Routes>` declarations would conflict. If you need this, use the [`<CreateInDialogButton>`](./CreateInDialogButton.md) instead.

`<CreateDialog>` accepts the same props as the [`<Create>`](./Create.md) component, and the same type of children (e.g. a [`<SimpleForm>`](./SimpleForm.md) element).

* `children`: the components that renders the form
* `className`: passed to the root component
* [`component`](./Create.md#component): override the root component
* [`disableAuthentication`](./Create.md#disableauthentication): disable the authentication check
* [`mutationOptions`](./Create.md#mutationoptions): options for the `dataProvider.create()` call
* [`record`](./Create.md#record): initialize the form with a record
* [`redirect`](./Create.md#redirect): change the redirect location after successful creation
* [`resource`](./Create.md#resource): override the name of the resource to create
* [`sx`](./Create.md#sx-css-api): Override the styles
* [`title`](./Create.md#title): override the page title
* [`transform`](./Create.md#transform): transform the form data before calling `dataProvider.create()`

Check [the `ra-form-layout` documentation](https://marmelab.com/ra-enterprise/modules/ra-form-layout#createdialog-editdialog--showdialog) for more details.

## Usage Without Routing

By default, `<CreateDialog>` creates a react-router `<Route>` for the creation path (e.g. `/posts/create`), and renders when users go to that location (either by clicking on a `<CreateButton>`, or by typing the URL in the browser). If you embed it in the `list` page as explained above, the dialog will always render on top of the list. 

This may not be what you want if you need to display the creation dialog in another page (e.g. to create a related record).

In that case, use [the `<CreateInDialogButton>` component](./CreateInDialogButton.md), which doesn't create a route, but renders the dialog when the user clicks on it.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/CreateInDialogButton.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/CreateInDialogButton.mp4" type="video/mp4" />
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
