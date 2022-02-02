import * as React from 'react';
import { CoreAdminContext, CoreAdminContextProps } from 'ra-core';

import { defaultTheme } from './defaultTheme';
import { ThemeProvider } from './layout/Theme';

export const AdminContext = (props: CoreAdminContextProps) => {
    const { theme = defaultTheme, children, ...rest } = props;
    return (
        <CoreAdminContext {...rest}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </CoreAdminContext>
    );
};

AdminContext.displayName = 'AdminContext';
