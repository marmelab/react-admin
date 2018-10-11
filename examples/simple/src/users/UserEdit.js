/* eslint react/jsx-key: off */
import React from 'react';
import PropTypes from 'prop-types';
import {
    DisabledInput,
    Edit,
    FormTab,
    SelectInput,
    TabbedForm,
    TextInput,
    required,
} from 'react-admin';

import UserTitle from './UserTitle';
import Aside from './Aside';

const UserEdit = ({ permissions, ...props }) => (
    <Edit title={<UserTitle />} aside={<Aside />} {...props}>
        <TabbedForm defaultValue={{ role: 'user' }}>
            <FormTab label="user.form.summary" path="">
                {permissions === 'admin' && <DisabledInput source="id" />}
                <TextInput
                    source="name"
                    defaultValue="slim shady"
                    validate={required()}
                />
            </FormTab>
            {permissions === 'admin' && (
                <FormTab label="user.form.security" path="security">
                    <SelectInput
                        source="role"
                        validate={required()}
                        choices={[
                            { id: '', name: 'None' },
                            { id: 'admin', name: 'Admin' },
                            { id: 'user', name: 'User' },
                        ]}
                        defaultValue={'user'}
                    />
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
