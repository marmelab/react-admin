/* eslint react/jsx-key: off */
import PeopleIcon from '@material-ui/icons/People';
import memoize from 'lodash/memoize';
import { useMediaQuery, Theme } from '@material-ui/core';
import * as React from 'react';
import {
    BulkDeleteWithConfirmButton,
    Datagrid,
    List,
    SearchInput,
    SimpleList,
    TextField,
    TextInput,
} from 'react-admin';

import Aside from './Aside';
import UserEditEmbedded from './UserEditEmbedded';
export const UserIcon = PeopleIcon;

const getUserFilters = permissions =>
    [
        <SearchInput source="q" alwaysOn />,
        <TextInput source="name" />,
        permissions === 'admin' ? <TextInput source="role" /> : null,
    ].filter(filter => filter !== null);

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
        filters={getUserFilters(permissions)}
        filterDefaultValues={{ role: 'user' }}
        sort={{ field: 'name', order: 'ASC' }}
        aside={<Aside />}
        bulkActionButtons={<UserBulkActionButtons />}
    >
        {useMediaQuery((theme: Theme) => theme.breakpoints.down('sm')) ? (
            <SimpleList
                primaryText={record => record.name}
                secondaryText={record =>
                    permissions === 'admin' ? record.role : null
                }
            />
        ) : (
            <Datagrid
                rowClick={rowClick(permissions)}
                expand={<UserEditEmbedded />}
                optimized
            >
                <TextField source="id" />
                <TextField source="name" />
                {permissions === 'admin' && <TextField source="role" />}
            </Datagrid>
        )}
    </List>
);

export default UserList;
