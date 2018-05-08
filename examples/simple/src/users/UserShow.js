/* eslint react/jsx-key: off */
import React from 'react';
import { Show, Tab, TabbedShowLayout, TextField } from 'react-admin'; // eslint-disable-line import/no-unresolved
import UserTitle from './UserTitle';

const UserShow = ({ permissions, ...props }) => (
    <Show title={<UserTitle />} {...props}>
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
    </Show>
);

export default UserShow;
