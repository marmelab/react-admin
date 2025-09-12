import * as React from 'react';
import {
    CoreAdminContext,
    testDataProvider,
    ListContextProvider,
    MutationMode,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { BulkDeleteWithConfirmButton } from './BulkDeleteWithConfirmButton';
import { Notification } from '../layout';

export default { title: 'ra-ui-materialui/button/BulkDeleteWithConfirmButton' };

const theme = createTheme();

export const Default = ({
    mutationMode = 'pessimistic',
}: {
    mutationMode?: MutationMode;
}) => {
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
                        mutationMode={mutationMode}
                    />
                    <Notification />
                </ListContextProvider>
            </ThemeProvider>
        </CoreAdminContext>
    );
};

Default.args = {
    mutationMode: 'pessimistic',
};

Default.argTypes = {
    mutationMode: {
        options: ['pessimistic', 'optimistic', 'undoable'],
        control: {
            type: 'select',
        },
    },
};
