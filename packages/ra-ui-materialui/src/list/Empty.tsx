import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Inbox from '@mui/icons-material/Inbox';
import {
    useTranslate,
    useListContext,
    useResourceContext,
    useGetResourceLabel,
} from 'ra-core';

import { CreateButton } from '../button';

export const Empty = (props: EmptyProps) => {
    const { basePath, hasCreate } = useListContext(props);
    const resource = useResourceContext(props);

    const translate = useTranslate();

    const getResourceLabel = useGetResourceLabel();
    const resourceName = translate(`resources.${resource}.forcedCaseName`, {
        smart_count: 0,
        _: getResourceLabel(resource, 0),
    });

    const emptyMessage = translate('ra.page.empty', { name: resourceName });
    const inviteMessage = translate('ra.page.invite');

    return (
        <Root>
            <div className={EmptyClasses.message}>
                <Inbox className={EmptyClasses.icon} />
                <Typography variant="h4" paragraph>
                    {translate(`resources.${resource}.empty`, {
                        _: emptyMessage,
                    })}
                </Typography>
                {hasCreate && (
                    <Typography variant="body1">
                        {translate(`resources.${resource}.invite`, {
                            _: inviteMessage,
                        })}
                    </Typography>
                )}
            </div>
            {hasCreate && (
                <div className={EmptyClasses.toolbar}>
                    <CreateButton variant="contained" basePath={basePath} />
                </div>
            )}
        </Root>
    );
};

export interface EmptyProps {
    resource?: string;
}

const PREFIX = 'RaEmpty';

export const EmptyClasses = {
    message: `${PREFIX}-message`,
    icon: `${PREFIX}-icon`,
    toolbar: `${PREFIX}-toolbar`,
};

const Root = styled('span', { name: PREFIX })(({ theme }) => ({
    [`& .${EmptyClasses.message}`]: {
        textAlign: 'center',
        opacity: theme.palette.mode === 'light' ? 0.5 : 0.8,
        margin: '0 1em',
        color:
            theme.palette.mode === 'light'
                ? 'inherit'
                : theme.palette.text.primary,
    },

    [`& .${EmptyClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${EmptyClasses.toolbar}`]: {
        textAlign: 'center',
        marginTop: '2em',
    },
}));
