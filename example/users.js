/* eslint react/jsx-key: off */
import React from 'react';
import {
    Create,
    Datagrid,
    DisabledInput,
    Edit,
    EditButton,
    Filter,
    FormTab,
    List,
    Responsive,
    SaveButton,
    Show,
    ShowButton,
    SimpleForm,
    SimpleList,
    Tab,
    TabbedForm,
    TabbedShowLayout,
    TextField,
    TextInput,
    Toolbar,
    required,
    translate,
} from 'admin-on-rest'; // eslint-disable-line import/no-unresolved

import PeopleIcon from 'material-ui/svg-icons/social/people';
export const UserIcon = PeopleIcon;

const UserFilter = props => (
    <Filter {...props}>
        {permissions => [
            <TextInput key="q" label="user.list.search" source="q" alwaysOn />,
            <TextInput key="name" source="name" />,
            permissions === 'admin' ? (
                <TextInput key="role" source="role" />
            ) : null,
        ]}
    </Filter>
);

const titleFieldStyle = {
    maxWidth: '20em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};
export const UserList = props => (
    <List
        {...props}
        filters={<UserFilter />}
        sort={{ field: 'name', order: 'ASC' }}
    >
        {permissions => (
            <Responsive
                key="userList"
                small={
                    <SimpleList
                        primaryText={record => record.name}
                        secondaryText={record =>
                            permissions === 'admin' ? record.role : ''}
                    />
                }
                medium={
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="name" style={titleFieldStyle} />
                        {permissions === 'admin' && <TextField source="role" />}
                        <EditButton />
                        <ShowButton />
                    </Datagrid>
                }
            />
        )}
    </List>
);

const UserTitle = translate(({ record, translate }) => (
    <span>
        {record ? translate('user.edit.title', { title: record.name }) : ''}
    </span>
));

const UserCreateToolbar = ({ permissions, ...props }) => (
    <Toolbar {...props}>
        <SaveButton
            label="user.action.save_and_show"
            redirect="show"
            submitOnEnter={true}
        />
        {permissions === 'admin' && (
            <SaveButton
                label="user.action.save_and_add"
                redirect={false}
                submitOnEnter={false}
                raised={false}
            />
        )}
    </Toolbar>
);

export const UserCreate = props => (
    <Create {...props}>
        {permissions => (
            <SimpleForm
                toolbar={<UserCreateToolbar permissions={permissions} />}
                defaultValue={{ role: 'user' }}
            >
                <TextInput source="name" validate={[required]} />
                {permissions === 'admin' && (
                    <TextInput source="role" validate={[required]} />
                )}
            </SimpleForm>
        )}
    </Create>
);

export const UserEdit = props => (
    <Edit title={<UserTitle />} {...props}>
        {permissions => (
            <TabbedForm defaultValue={{ role: 'user' }}>
                <FormTab label="user.form.summary">
                    {permissions === 'admin' && <DisabledInput source="id" />}
                    <TextInput source="name" validate={required} />
                </FormTab>
                {permissions === 'admin' && (
                    <FormTab label="user.form.security">
                        <TextInput source="role" validate={required} />
                    </FormTab>
                )}
            </TabbedForm>
        )}
    </Edit>
);

export const UserShow = props => (
    <Show title={<UserTitle />} {...props}>
        {permissions => (
            <TabbedShowLayout>
                <Tab label="user.form.summary">
                    <TextField source="id" />
                    <TextField source="name" />
                </Tab>
                {permissions === 'admin' && (
                    <Tab label="user.form.security">
                        <TextField source="role" />
                    </Tab>
                )}
            </TabbedShowLayout>
        )}
    </Show>
);
