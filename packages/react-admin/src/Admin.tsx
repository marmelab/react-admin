import React, { FunctionComponent } from 'react';
import { CoreAdmin } from 'ra-core';
import {
    Layout as DefaultLayout,
    Loading,
    Login,
    Logout,
    NotFound,
} from 'ra-ui-materialui';

import defaultI18nProvider from './defaultI18nProvider';
import { AdminProps } from 'ra-core/esm/CoreAdmin';

const Admin: FunctionComponent<AdminProps> = ({
    locale,
    i18nProvider,
    ...props
}) => {
    const finalI18nProvider = i18nProvider || defaultI18nProvider(locale);

    return (
        <CoreAdmin
            locale={locale}
            i18nProvider={finalI18nProvider}
            {...props}
        />
    );
};

Admin.defaultProps = {
    appLayout: DefaultLayout,
    catchAll: NotFound,
    loading: Loading,
    loginPage: Login,
    logoutButton: Logout,
};

export default Admin;
