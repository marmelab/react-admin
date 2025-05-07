import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
    AppBar,
    Layout,
    InspectorButton,
    TitlePortal,
    useNotify,
} from 'react-admin';
import { onlineManager, useQueryClient } from '@tanstack/react-query';
import { Stack, Tooltip } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import '../assets/app.css';

const MyAppBar = () => {
    const isOnline = useIsOnline();
    return (
        <AppBar>
            <TitlePortal />
            <Stack direction="row" spacing={1}>
                <Tooltip title={isOnline ? 'Online' : 'Offline'}>
                    <CircleIcon
                        sx={{
                            color: isOnline ? 'success.main' : 'warning.main',
                            width: 24,
                            height: 24,
                        }}
                    />
                </Tooltip>
            </Stack>
            <InspectorButton />
        </AppBar>
    );
};

export default ({ children }) => {
    return (
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
};

const useIsOnline = () => {
    const [isOnline, setIsOnline] = React.useState(onlineManager.isOnline());
    React.useEffect(() => {
        const handleChange = isOnline => {
            setIsOnline(isOnline);
        };
        return onlineManager.subscribe(handleChange);
    });

    return isOnline;
};

/**
 * When react-query resumes persisted mutations through their default functions (provided in the getOfflineFirstQueryClient file) after the browser tab
 * has been closed, it cannot handle their side effects unless we set up some defaults. In order to leverage the react-admin notification system
 * we add a default onSettled function to the mutation defaults here.
 */
const NotificationsFromQueryClient = () => {
    const queryClient = useQueryClient();
    const notify = useNotify();

    queryClient.setMutationDefaults([], {
        onSettled(data, error) {
            if (error) {
                notify(error.message, { type: 'error' });
            }
        },
    });
    return null;
};
