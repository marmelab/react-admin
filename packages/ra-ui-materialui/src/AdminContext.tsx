import * as React from 'react';
import { CoreAdminContext, CoreAdminContextProps } from 'ra-core';

import { defaultTheme } from './defaultTheme';
import { ThemeProvider } from './layout/Theme';

export const AdminContext = (props: CoreAdminContextProps) => {
    const { theme = defaultTheme, ...rest } = props;
    return (
        <ThemeProvider theme={theme}>
            <CoreAdminContext {...rest} />
        </ThemeProvider>
    );
};

AdminContext.displayName = 'AdminContext';
