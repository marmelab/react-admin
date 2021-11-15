/* eslint react/jsx-key: off */
import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Show,
    Tab,
    TabbedShowLayout,
    TextField,
    usePermissions,
} from 'react-admin';

import UserTitle from './UserTitle';
import Aside from './Aside';

const UserShow = () => {
    const { permissions } = usePermissions();
    return (
        <Show title={<UserTitle />} aside={<Aside />}>
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
};

UserShow.propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    permissions: PropTypes.string,
};

export default UserShow;
