/* eslint react/jsx-key: off */
import PeopleIcon from '@material-ui/icons/People';
import memoize from 'lodash/memoize';

import React from 'react';
import {
    BulkDeleteWithConfirmButton,
    Datagrid,
    Filter,
    List,
    Responsive,
    SearchInput,
    SimpleList,
    TextField,
    TextInput,
} from 'react-admin';
export const UserIcon = PeopleIcon;

import Aside from './Aside';
import UserEditEmbedded from './UserEditEmbedded';

const UserFilter = ({ permissions, ...props }) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <TextInput source="name" />
        {permissions === 'admin' ? <TextInput source="role" /> : null}
    </Filter>
);

const UserBulkActionButtons = props => (
    <BulkDeleteWithConfirmButton {...props} />
);

const rowClick = memoize(permissions => (id, basePath, record) => {
    return permissions === 'admin'
        ? Promise.resolve('edit')
        : Promise.resolve('show');
});

const UserList = ({ permissions, ...props }) => (
    <List
        {...props}
        filters={<UserFilter permissions={permissions} />}
        filterDefaultValues={{ role: 'user' }}
        sort={{ field: 'name', order: 'ASC' }}
        aside={<Aside />}
        bulkActionButtons={<UserBulkActionButtons />}
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
                <Datagrid
                    rowClick={rowClick(permissions)}
                    expand={<UserEditEmbedded />}
                >
                    <TextField source="id" />
                    <TextField source="name" />
                    {permissions === 'admin' && <TextField source="role" />}
                </Datagrid>
            }
        />
    </List>
);

export default UserList;
