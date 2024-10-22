/* eslint react/jsx-key: off */
import * as React from 'react';
import { Show, TabbedShowLayout, TextField, useCanAccess } from 'react-admin';

import Aside from './Aside';

const UserShow = () => {
    const { isPending, canAccess: canSeeRole } = useCanAccess({
        action: 'show',
        resource: 'users.role',
    });
    if (isPending) {
        return null;
    }
    return (
        <Show>
            <TabbedShowLayout>
                <TabbedShowLayout.Tab label="user.form.summary">
                    <TextField source="id" />
                    <TextField source="name" />
                </TabbedShowLayout.Tab>
                {canSeeRole ? (
                    <TabbedShowLayout.Tab
                        label="user.form.security"
                        path="security"
                    >
                        <TextField source="role" />
                    </TabbedShowLayout.Tab>
                ) : null}
            </TabbedShowLayout>
            <Aside />
        </Show>
    );
};

export default UserShow;
