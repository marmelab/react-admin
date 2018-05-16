/* eslint react/jsx-key: off */
import React from 'react';
import {
    Create,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    required,
} from 'react-admin';

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
                variant="flat"
            />
        )}
    </Toolbar>
);

const UserCreate = ({ permissions, ...props }) => (
    <Create {...props}>
        <SimpleForm
            toolbar={<UserCreateToolbar permissions={permissions} />}
            defaultValue={{ role: 'user' }}
        >
            <TextInput source="name" validate={[required()]} />
            {permissions === 'admin' && (
                <TextInput source="role" validate={[required()]} />
            )}
        </SimpleForm>
    </Create>
);

export default UserCreate;
