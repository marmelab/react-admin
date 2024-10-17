/* eslint react/jsx-key: off */
import PeopleIcon from '@mui/icons-material/People';
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
    useCanAccess,
} from 'react-admin';

import Aside from './Aside';
import UserEditEmbedded from './UserEditEmbedded';
export const UserIcon = PeopleIcon;

const getUserFilters = (canSeeRole: boolean): React.ReactElement[] => {
    const filters = [
        <SearchInput source="q" alwaysOn />,
        <TextInput source="name" />,
    ];
    if (canSeeRole) {
        filters.push(<TextInput source="role" />);
    }
    return filters;
};

const UserBulkActionButtons = props => (
    <BulkDeleteWithConfirmButton {...props} />
);

const UserList = () => {
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('md')
    );
    const { isPending, canAccess: canSeeRole } = useCanAccess({
        action: 'show',
        resource: 'users.role',
    });
    if (isPending) {
        return null;
    }
    return (
        <List
            filters={getUserFilters(canSeeRole ?? false)}
            filterDefaultValues={{ role: 'user' }}
            sort={{ field: 'name', order: 'ASC' }}
            aside={<Aside />}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => (canSeeRole ? record.role : null)}
                />
            ) : (
                <Datagrid
                    expand={<UserEditEmbedded />}
                    bulkActionButtons={<UserBulkActionButtons />}
                    optimized
                >
                    <TextField source="id" />
                    <TextField source="name" />
                    {canSeeRole && <TextField source="role" />}
                </Datagrid>
            )}
        </List>
    );
};

export default UserList;
