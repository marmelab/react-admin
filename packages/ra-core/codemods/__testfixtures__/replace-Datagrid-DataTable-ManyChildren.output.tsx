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
            <DataTable.Col source="email">
                <EmailField source="email" />
            </DataTable.Col>
            <DataTable.Col label="Email of the author of the post">
                <EmailField
                    source="author_email"
                    label="Email of the author of the post"
                />
            </DataTable.Col>
            <DataTable.NumberCol source="nb_vues" />
            <DataTable.NumberCol
                source="price"
                locales="fr-FR"
                options={{ style: 'currency', currency: 'USD' }}
            />
            <DataTable.Col source="title" />
            <DataTable.Col source="userId">
                <ReferenceField source="userId" reference="users">
                    <TextField source="name" />
                </ReferenceField>
            </DataTable.Col>
            <DataTable.Col source="url">
                <UrlField source="url" />
            </DataTable.Col>
            <DataTable.Col source="createdAt">
                <DateField source="createdAt" />
            </DataTable.Col>
            <DataTable.Col source="code">
                <MyCustomField source="code" />
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export default PostList;
