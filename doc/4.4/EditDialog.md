---
layout: default
title: "EditDialog"
---

# `<EditDialog>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an alternative layout for updating a record without leaving the context of the list page.

![EditDialog](https://marmelab.com/ra-enterprise/modules/assets/edit-dialog.gif)

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
            <Datagrid>
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

Check [the `ra-form-layout` documentation](https://marmelab.com/ra-enterprise/modules/ra-form-layout#createdialog-editdialog--showdialog) for more details.

