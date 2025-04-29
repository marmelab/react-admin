import * as React from 'react';
import {
    CoreAdminContext,
    NotificationContextProvider,
    useDelete,
    useNotify,
    useCloseNotification,
} from 'ra-core';
import {
    Alert,
    Button,
    SnackbarContent,
    SnackbarContentProps,
    Stack,
} from '@mui/material';

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

const TypeNotification = ({ type }) => {
    const notify = useNotify();
    React.useEffect(() => {
        notify('hello, world', { type });
    }, [notify, type]);
    return null;
};

export const Type = ({ type }) => (
    <Wrapper>
        <TypeNotification type={type} />
    </Wrapper>
);
Type.args = {
    type: 'warning',
};
Type.argTypes = {
    type: {
        control: { type: 'select' },
        options: ['info', 'warning', 'error', 'success'],
    },
};

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

const NoAutoHideNotification = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify('hello, world', { autoHideDuration: null });
    }, [notify]);
    return null;
};

export const NoAutoHide = () => (
    <Wrapper>
        <NoAutoHideNotification />
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

const DeletePost = ({ id }) => {
    const [deleteOne] = useDelete();
    const notify = useNotify();
    const deletePost = () => {
        deleteOne(
            'posts',
            { id },
            {
                mutationMode: 'undoable',
                onSuccess: () =>
                    notify(`Post ${id} deleted`, { undoable: true }),
            }
        );
    };

    return (
        <Button variant="outlined" onClick={deletePost}>
            Delete post {id}
        </Button>
    );
};

export const ConsecutiveUndoable = ({
    dataProvider = {
        delete: async (_resource, { id }) => {
            console.log('delete post', id);
            return { data: { id } };
        },
    } as any,
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <Stack spacing={2} direction="row" m={2}>
            <DeletePost id={1} />
            <DeletePost id={2} />
        </Stack>
        <Notification />
    </CoreAdminContext>
);

// forwardRef is required for Snackbar to work (transitions) in React 18
const CustomNotificationWithActionContent = React.forwardRef<
    HTMLDivElement,
    SnackbarContentProps
>((props, ref) => {
    const closeNotification = useCloseNotification();
    const handleClick = () => {
        console.log('Custom action');
        closeNotification();
    };
    return (
        <SnackbarContent
            message="Applied automatic changes"
            action={<Button onClick={handleClick}>Cancel</Button>}
            {...props}
            ref={ref}
        />
    );
});

const CustomNotificationElementWithAction = () => {
    const notify = useNotify();
    React.useEffect(() => {
        notify(<CustomNotificationWithActionContent />);
    }, [notify]);
    return null;
};

export const CustomNotificationWithAction = () => (
    <Wrapper>
        <CustomNotificationElementWithAction />
    </Wrapper>
);
