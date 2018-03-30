import React from 'react';
import {
    Responsive,
    SimpleList,
    List,
    Datagrid,
    EmailField,
    TextField,
} from 'react-admin';

export const UserList = props => (
    <List title="All users" {...props}>
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.username}
                    tertiaryText={record => record.email}
                />
            }
            medium={
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
                    <TextField source="username" />
                    <EmailField source="email" />
                </Datagrid>
            }
        />
    </List>
);
