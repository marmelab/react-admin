/* eslint react/jsx-key: off */
import PeopleIcon from '@material-ui/icons/People';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import React from 'react';
import {
    Filter,
    List,
    Pagination,
    Responsive,
    SimpleList,
    TextInput,
} from 'react-admin';
import EditableDatagrid from 'ra-editable-datagrid';
export const UserIcon = PeopleIcon;

const UserFilter = ({ permissions, ...props }) => (
    <Filter {...props}>
        <TextInput
            label="user.list.search"
            source="q"
            alwaysOn
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon color="disabled" />
                    </InputAdornment>
                ),
            }}
        />
        <TextInput source="name" />
        {permissions === 'admin' ? <TextInput source="role" /> : null}
    </Filter>
);

const columns = [
    { key: 'id', name: 'ID', resizable: true, locked: true, sortable: true },
    {
        key: 'name',
        name: 'Name',
        editable: true,
        resizable: true,
        sortable: true,
    },
];
const UserList = ({ permissions, ...props }) => (
    <List
        {...props}
        filters={<UserFilter permissions={permissions} />}
        sort={{ field: 'name', order: 'ASC' }}
        perPage={5}
        pagination={<Responsive small={<Pagination />} medium={null} />}
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
            medium={<EditableDatagrid columns={columns} pageSize={5} />}
        />
    </List>
);

export default UserList;
