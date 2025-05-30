/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    NumberField,
    EditButton,
    ReferenceField,
    UrlField,
    DateField,
} from 'react-admin';

// @ts-ignore
import { MyCustomField } from './MyCustomField';

const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <EmailField source="email" />
            <EmailField
                source="author_email"
                label="Email of the author of the post"
            />
            <NumberField source="nb_vues" />
            <NumberField
                source="price"
                locales="fr-FR"
                options={{ style: 'currency', currency: 'USD' }}
            />
            <TextField source="title" />
            <ReferenceField source="userId" reference="users">
                <TextField source="name" />
            </ReferenceField>
            <UrlField source="url" />
            <DateField source="createdAt" />
            <MyCustomField source="code" />
            <EditButton />
        </Datagrid>
    </List>
);

export default PostList;
