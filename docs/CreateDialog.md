---
layout: default
title: "CreateDialog"
---

# `<CreateDialog>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an alternative layout for creating records without leaving the context of the list page.

![CreateDialog](https://marmelab.com/ra-enterprise/modules/assets/edit-dialog.gif)

```jsx
import * as React from 'react';
import { List, Datagrid, SimpleForm, TextField, TextInput, DateInput, required } from 'react-admin';
import { CreateDialog } from '@react-admin/ra-form-layout';

const CustomerList = () => (
    <>
        <List>
            <Datagrid>
                ...
            </Datagrid>
        </List>
        <CreateDialog {...props}>
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="date_of_birth" label="born" validate={required()} />
            </SimpleForm>
        </CreateDialog>
    </>
);
```

Check [the `ra-form-layout` documentation](https://marmelab.com/ra-enterprise/modules/ra-form-layout) for more details.

