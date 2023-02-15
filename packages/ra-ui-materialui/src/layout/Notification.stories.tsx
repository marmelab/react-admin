import * as React from 'react';
import { useNotify, NotificationContextProvider } from 'ra-core';
import { Alert } from '@mui/material';

import { Notification } from './Notification';

export default {
    title: 'ra-ui-materialui/layout/Notification',
};

const Wrapper = ({ children }) => (
    <NotificationContextProvider>
        <Notification />
        {children}
    </NotificationContextProvider>
);

const BasicNotification = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify('hello, world');
    }, [notify]);
    return null;
};

export const Basic = () => (
    <Wrapper>
        <BasicNotification />
    </Wrapper>
);

const TypeNotification = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify('hello, world', { type: 'warning' });
    }, [notify]);
    return null;
};

export const Type = () => (
    <Wrapper>
        <TypeNotification />
    </Wrapper>
);

const MultilineNotification = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies aliquam, nisl nisl aliquet nisl, eget aliquet nisl nisl eu nisl. Sed euismod, nisl nec ultricies aliquam, nisl nisl aliquet nisl, eget aliquet nisl nisl eu nisl.',
            {
                multiLine: true,
            }
        );
    }, [notify]);
    return null;
};

export const Multiline = () => (
    <Wrapper>
        <MultilineNotification />
    </Wrapper>
);

const AutoHideDurationNotification = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify('hello, world', { autoHideDuration: 1000 });
    }, [notify]);
    return null;
};

export const AutoHideDuration = () => (
    <Wrapper>
        <AutoHideDurationNotification />
    </Wrapper>
);

const UndoableNotification = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify('hello, world', { undoable: true });
    }, [notify]);
    return null;
};

export const Undoable = () => (
    <Wrapper>
        <UndoableNotification />
    </Wrapper>
);

const MessageArgsNotification = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify('hello, %{foo}', { messageArgs: { foo: 'bar' } });
    }, [notify]);
    return null;
};

export const MessageArgs = () => (
    <Wrapper>
        <MessageArgsNotification />
    </Wrapper>
);

const AnchorOriginNotification = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify('hello, world', {
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
    }, [notify]);
    return null;
};

export const AnchorOrigin = () => (
    <Wrapper>
        <AnchorOriginNotification />
    </Wrapper>
);

const CustomNodeNotification = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify(
            <Alert severity="info">Agent Lauren Smith just logged in</Alert>
        );
    }, [notify]);
    return null;
};

export const CustomNode = () => (
    <Wrapper>
        <CustomNodeNotification />
    </Wrapper>
);
