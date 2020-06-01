/* eslint react/jsx-key: off */
import React from 'react';
import PropTypes from 'prop-types';
import {
    DeleteWithConfirmButton,
    DisabledInput,
    Edit,
    FormTab,
    SaveButton,
    SelectInput,
    SelectArrayInput,
    TabbedForm,
    TextInput,
    Toolbar,
    required,
} from 'react-admin';
import { withStyles } from '@material-ui/core';

import UserTitle from './UserTitle';
import Aside from './Aside';

const toolbarStyles = {
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

/**
 * Custom Toolbar for the Edit form
 *
 * Save with undo, but delete with confirm
 */
const UserEditToolbar = withStyles(toolbarStyles)(props => (
    <Toolbar {...props}>
        <SaveButton />
        <DeleteWithConfirmButton />
    </Toolbar>
));

const UserEdit = ({ permissions, ...props }) => (
    <Edit title={<UserTitle />} aside={<Aside />} {...props}>
        <TabbedForm
            defaultValue={{ role: 'user' }}
            toolbar={<UserEditToolbar />}
        >
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
                    <SelectArrayInput
                        source="permissions"
                        choices={[
                            { id: 'can_login', name: 'Can login' },
                            { id: 'can_view_posts', name: 'Can view posts' },
                            {
                                id: 'can_remove_posts',
                                name: 'Can remove posts',
                                disabled: true,
                            },
                        ]}
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
