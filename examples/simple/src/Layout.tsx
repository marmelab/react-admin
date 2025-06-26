import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
    AppBar,
    Layout,
    InspectorButton,
    TitlePortal,
    useNotify,
    useIsOffine,
} from 'react-admin';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, Tooltip } from '@mui/material';
import OfflineIcon from '@mui/icons-material/SignalWifiConnectedNoInternet4';
import '../assets/app.css';

const MyAppBar = () => {
    const isOffline = useIsOffine();
    return (
        <AppBar>
            <TitlePortal />
            <Stack direction="row" spacing={1}>
                {isOffline ? (
                    <Tooltip title="Offline">
                        <OfflineIcon
                            sx={{
                                color: 'warning.main',
                                width: 24,
                                height: 24,
                            }}
                        />
                    </Tooltip>
                ) : null}
            </Stack>
            <InspectorButton />
        </AppBar>
    );
};

export const MyLayout = ({ children }) => (
    <>
        <Layout appBar={MyAppBar}>
            {children}
            <NotificationsFromQueryClient />
        </Layout>
        <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
        />
    </>
);

/**
 * When react-query resumes persisted mutations through their default functions (provided in the getOfflineFirstQueryClient file) after the browser tab
 * has been closed, it cannot handle their side effects unless we set up some defaults. In order to leverage the react-admin notification system
 * we add a default onSettled function to the mutation defaults here.
 */
const NotificationsFromQueryClient = () => {
    const queryClient = useQueryClient();
    const notify = useNotify();

    React.useEffect(() => {
        queryClient.setMutationDefaults([], {
            onSettled(data, error) {
                if (error) {
                    notify(error.message, { type: 'error' });
                }
            },
        });
    }, [queryClient, notify]);

    return null;
};
