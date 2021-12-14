---
layout: default
title: "The EditableDatagrid Component"
---

# `<EditableDatagrid>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an "edit-in-place" experience in a `<Datagrid>`.

![Editable Datagrid](https://marmelab.com/ra-enterprise/modules/assets/ra-editable-datagrid-overview.gif)

## Usage

`<EditableDatagrid>` is a drop-in replacement for `<Datagrid>`. It expects 2 additional props: `createForm` and `editForm`, the components to be displayed when a user creates or edits a row. The `<RowForm>` comopnent allows to create such forms using react-admin Input components. 

```jsx
import * as React from 'react';
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

const ArtistList = () => (
    <List hasCreate empty={false}>
        <EditableDatagrid
            undoable
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

const ArtistForm = props => (
    <RowForm {...props}>
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
```

Check [the `ra-editable-datagrid` documentation](https://marmelab.com/ra-enterprise/modules/ra-editable-datagrid) for more details.
