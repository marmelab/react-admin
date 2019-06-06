/* eslint react/jsx-key: off */
import React from 'react';
import PropTypes from 'prop-types';
import { Show, Tab, TabbedShowLayout, TextField } from 'react-admin'; // eslint-disable-line import/no-unresolved

import UserTitle from './UserTitle';
import Aside from './Aside';

const UserShow = ({ permissions, ...props }) => (
    <Show title={<UserTitle />} aside={<Aside />} {...props}>
        <TabbedShowLayout>
            <Tab label="user.form.summary">
                <TextField source="id" />
                <TextField source="name" />
            </Tab>
            {permissions === 'admin' && (
                <Tab label="user.form.security" path="security">
                    <TextField source="role" />
                </Tab>
            )}
        </TabbedShowLayout>
    </Show>
);

UserShow.propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    permissions: PropTypes.string,
};

export default UserShow;
