import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import {
    CoreAdminContext,
    testDataProvider,
    ListContextProvider,
    useNotificationContext,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { BulkDeleteWithConfirmButton } from './BulkDeleteWithConfirmButton';

const theme = createTheme();

describe('<BulkDeleteWithConfirmButton />', () => {
    it('should display success message after successful deletion', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest
                .fn()
                .mockResolvedValueOnce({ data: [{ id: 123 }] }),
        });

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        const successMessage = 'Test Message';
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={{
                            selectedIds: [123],
                            onUnselectItems: jest.fn(),
                        }}
                    >
                        <BulkDeleteWithConfirmButton
                            resource="test"
                            mutationMode={'pessimistic'}
                            successMessage={successMessage}
                        />
                        <Notification />
                    </ListContextProvider>
                </ThemeProvider>
            </CoreAdminContext>
        );
        fireEvent.click(screen.getByLabelText('ra.action.delete'));
        fireEvent.click(screen.getByText('ra.action.confirm'));

        await waitFor(() => {
            expect(notificationsSpy).toEqual([
                {
                    message: successMessage,
                    type: 'info',
                    notificationOptions: {
                        messageArgs: {
                            smart_count: 1,
                            _: 'ra.notification.deleted',
                        },
                        undoable: false,
                    },
                },
            ]);
        });
    });
});
