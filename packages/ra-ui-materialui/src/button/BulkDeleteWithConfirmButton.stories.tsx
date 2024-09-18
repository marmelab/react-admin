import * as React from 'react';
import {
    CoreAdminContext,
    testDataProvider,
    ListContextProvider,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { BulkDeleteWithConfirmButton } from './BulkDeleteWithConfirmButton';
import { Notification } from '../layout';

export default { title: 'ra-ui-materialui/button/BulkDeleteWithConfirmButton' };

const theme = createTheme();

export const Default = () => {
    const dataProvider = testDataProvider({
        deleteMany: async () => ({ data: [{ id: 123 }] as any }),
    });

    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <ThemeProvider theme={theme}>
                <ListContextProvider
                    value={
                        {
                            selectedIds: [123],
                            onUnselectItems: () => {},
                        } as any
                    }
                >
                    <BulkDeleteWithConfirmButton
                        resource="books"
                        mutationMode="pessimistic"
                    />
                    <Notification />
                </ListContextProvider>
            </ThemeProvider>
        </CoreAdminContext>
    );
};
