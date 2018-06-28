/* eslint react/jsx-key: off */
import React from 'react';
import PropTypes from 'prop-types';
import { Show, Tab, TabbedShowLayout, TextField } from 'react-admin'; // eslint-disable-line import/no-unresolved
import { Link } from 'react-router-dom';
import UserTitle from './UserTitle';

// The last part of the pathname matching our tabs
const tabs = [
    'show', // First tab's pathname will be the show route root
    'security',
];

const UserShow = ({ permissions, ...props }) => {
    const lastPartOfPathname = props.location.pathname.substr(
        props.location.pathname.lastIndexOf('/') + 1
    );
    const tab = tabs.indexOf(lastPartOfPathname);
    return (
        <Show title={<UserTitle />} {...props}>
            <TabbedShowLayout value={tab}>
                <Tab
                    label="user.form.summary"
                    component={Link}
                    to={props.match.url}
                >
                    <TextField source="id" />
                    <TextField source="name" />
                </Tab>
                {permissions === 'admin' && (
                    <Tab
                        label="user.form.security"
                        component={Link}
                        to={`${props.match.url}/security`}
                    >
                        <TextField source="role" />
                    </Tab>
                )}
            </TabbedShowLayout>
        </Show>
    );
};

UserShow.propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    permissions: PropTypes.string,
};

export default UserShow;
