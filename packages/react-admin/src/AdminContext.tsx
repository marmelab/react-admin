import * as React from 'react';
import { CoreAdminContext, AdminContextProps } from 'ra-core';
import { defaultTheme, ThemeProvider } from 'ra-ui-materialui';

import { defaultI18nProvider } from './defaultI18nProvider';

export const AdminContext = (props: AdminContextProps) => {
    const { theme = defaultTheme, ...rest } = props;
    return (
        <ThemeProvider theme={theme}>
            <CoreAdminContext {...rest} />
        </ThemeProvider>
    );
};
AdminContext.defaultProps = {
    i18nProvider: defaultI18nProvider,
};

AdminContext.displayName = 'AdminContext';
