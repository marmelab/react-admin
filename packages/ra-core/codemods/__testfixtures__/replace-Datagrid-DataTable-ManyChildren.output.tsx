/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import {
    List,
    DataTable,
    TextField,
    EmailField,
    EditButton,
    ReferenceField,
    UrlField,
    DateField,
} from 'react-admin';

// @ts-ignore
import { MyCustomField } from './MyCustomField';

const PostList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="email" field={EmailField} />
            <DataTable.NumberCol source="nb_vues" />
            <DataTable.Col source="title" />
            <DataTable.Col source="userId">
                <ReferenceField source="userId" reference="users">
                    <TextField source="name" />
                </ReferenceField>
            </DataTable.Col>
            <DataTable.Col source="url" field={UrlField} />
            <DataTable.Col source="createdAt" field={DateField} />
            <DataTable.Col source="code" field={MyCustomField} />
            <EditButton />
        </DataTable>
    </List>
);

export default PostList;
