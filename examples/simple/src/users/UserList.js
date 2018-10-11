/* eslint react/jsx-key: off */
import PeopleIcon from '@material-ui/icons/People';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import React from 'react';
import {
    Datagrid,
    EditButton,
    Filter,
    List,
    Responsive,
    SearchInput,
    ShowButton,
    SimpleList,
    TextField,
    TextInput,
} from 'react-admin';
export const UserIcon = PeopleIcon;

import Aside from './Aside';

const UserFilter = ({ permissions, ...props }) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <TextInput source="name" />
        {permissions === 'admin' ? <TextInput source="role" /> : null}
    </Filter>
);

const UserList = ({ permissions, ...props }) => (
    <List
        {...props}
        filters={<UserFilter permissions={permissions} />}
        filterDefaultValues={{ role: 'user' }}
        sort={{ field: 'name', order: 'ASC' }}
        aside={<Aside />}
    >
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record =>
                        permissions === 'admin' ? record.role : null
                    }
                />
            }
            medium={
                <Datagrid rowClick="show">
                    <TextField source="id" />
                    <TextField source="name" />
                    {permissions === 'admin' && <TextField source="role" />}
                </Datagrid>
            }
        />
    </List>
);

export default UserList;
