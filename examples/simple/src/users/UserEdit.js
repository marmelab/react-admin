/* eslint react/jsx-key: off */
import React from 'react';
import {
    DisabledInput,
    Edit,
    FormTab,
    TabbedForm,
    TextInput,
    required,
} from 'react-admin';
import UserTitle from './UserTitle';

const UserEdit = ({ permissions, ...props }) => (
    <Edit title={<UserTitle />} {...props}>
        <TabbedForm defaultValue={{ role: 'user' }}>
            <FormTab label="user.form.summary">
                {permissions === 'admin' && <DisabledInput source="id" />}
                <TextInput source="name" validate={required()} />
            </FormTab>
            {permissions === 'admin' && (
                <FormTab label="user.form.security">
                    <TextInput source="role" validate={required()} />
                </FormTab>
            )}
        </TabbedForm>
    </Edit>
);

export default UserEdit;
