/* eslint react/jsx-key: off */
import PeopleIcon from '@mui/icons-material/People';
import memoize from 'lodash/memoize';
import { useMediaQuery, Theme } from '@mui/material';
import * as React from 'react';
import {
    BulkDeleteWithConfirmButton,
    Datagrid,
    List,
    SearchInput,
    SimpleList,
    TextField,
    TextInput,
    usePermissions,
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

const rowClick = memoize(permissions => () => {
    return permissions === 'admin'
        ? Promise.resolve('edit')
        : Promise.resolve('show');
});

const UserList = () => {
    const { permissions } = usePermissions();
    return (
        <List
            filters={getUserFilters(permissions)}
            filterDefaultValues={{ role: 'user' }}
            sort={{ field: 'name', order: 'ASC' }}
            aside={<Aside />}
        >
            {useMediaQuery((theme: Theme) => theme.breakpoints.down('md')) ? (
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
                    bulkActionButtons={<UserBulkActionButtons />}
                    optimized
                >
                    <TextField source="id" />
                    <TextField source="name" />
                    {permissions === 'admin' && <TextField source="role" />}
                </Datagrid>
            )}
        </List>
    );
};

export default UserList;
