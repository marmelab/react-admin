/* eslint react/jsx-key: off */
import * as React from 'react';
import { Show, TabbedShowLayout, TextField, usePermissions } from 'react-admin';

import Aside from './Aside';

const UserShow = () => {
    const { permissions } = usePermissions();
    return (
        <Show>
            <TabbedShowLayout>
                <TabbedShowLayout.Tab label="user.form.summary">
                    <TextField source="id" />
                    <TextField source="name" />
                </TabbedShowLayout.Tab>
                {permissions === 'admin' && (
                    <TabbedShowLayout.Tab
                        label="user.form.security"
                        path="security"
                    >
                        <TextField source="role" />
                    </TabbedShowLayout.Tab>
                )}
            </TabbedShowLayout>
            <Aside />
        </Show>
    );
};

export default UserShow;
