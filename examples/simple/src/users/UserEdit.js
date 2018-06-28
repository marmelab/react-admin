/* eslint react/jsx-key: off */
import React from 'react';
import PropTypes from 'prop-types';
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
            <FormTab label="user.form.summary" path="">
                {permissions === 'admin' && <DisabledInput source="id" />}
                <TextInput source="name" validate={required()} />
            </FormTab>
            {permissions === 'admin' && (
                <FormTab label="user.form.security" path="security">
                    <TextInput source="role" validate={required()} />
                </FormTab>
            )}
        </TabbedForm>
    </Edit>
);

UserEdit.propTypes = {
    id: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    permissions: PropTypes.string,
};

export default UserEdit;
