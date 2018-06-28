/* eslint react/jsx-key: off */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    DisabledInput,
    Edit,
    FormTab,
    TabbedForm,
    TextInput,
    required,
} from 'react-admin';
import UserTitle from './UserTitle';

const UserEdit = ({ permissions, ...props }) => {
    // The last part of the pathname matching our tabs
    const tabs = [
        props.id, // First tab's pathname will be the id parameter of the edit route root
        'security',
    ];
    const lastPartOfPathname = props.location.pathname.substr(
        props.location.pathname.lastIndexOf('/') + 1
    );
    const tab = tabs.indexOf(lastPartOfPathname);
    return (
        <Edit title={<UserTitle />} {...props}>
            <TabbedForm defaultValue={{ role: 'user' }} value={tab}>
                <FormTab
                    label="user.form.summary"
                    component={Link}
                    to={props.match.url}
                >
                    {permissions === 'admin' && <DisabledInput source="id" />}
                    <TextInput source="name" validate={required()} />
                </FormTab>
                {permissions === 'admin' && (
                    <FormTab
                        label="user.form.security"
                        component={Link}
                        to={`${props.match.url}/security`}
                    >
                        <TextInput source="role" validate={required()} />
                    </FormTab>
                )}
            </TabbedForm>
        </Edit>
    );
};

UserEdit.propTypes = {
    id: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    permissions: PropTypes.string,
};

export default UserEdit;
