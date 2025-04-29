import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { Typography } from '@mui/material';
import Inbox from '@mui/icons-material/Inbox';
import {
    useTranslate,
    useResourceDefinition,
    useResourceContext,
    useGetResourceLabel,
} from 'ra-core';

import { CreateButton } from '../button';

export const Empty = (inProps: EmptyProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { className } = props;
    const { hasCreate } = useResourceDefinition(props);
    const resource = useResourceContext(props);

    const translate = useTranslate();

    const getResourceLabel = useGetResourceLabel();
    const resourceName = translate(`resources.${resource}.forcedCaseName`, {
        smart_count: 0,
        _: resource ? getResourceLabel(resource, 0) : undefined,
    });

    const emptyMessage = translate('ra.page.empty', { name: resourceName });
    const inviteMessage = translate('ra.page.invite');

    return (
        <Root className={className}>
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
                    <CreateButton variant="contained" />
                </div>
            )}
        </Root>
    );
};

export interface EmptyProps {
    resource?: string;
    hasCreate?: boolean;
    className?: string;
}

const PREFIX = 'RaEmpty';

export const EmptyClasses = {
    message: `${PREFIX}-message`,
    icon: `${PREFIX}-icon`,
    toolbar: `${PREFIX}-toolbar`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    [`& .${EmptyClasses.message}`]: {
        textAlign: 'center',
        margin: '0 1em',
        color: (theme.vars || theme).palette.text.disabled,
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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaEmpty: 'root' | 'message' | 'icon' | 'toolbar';
    }

    interface ComponentsPropsList {
        RaEmpty: Partial<EmptyProps>;
    }

    interface Components {
        RaEmpty?: {
            defaultProps?: ComponentsPropsList['RaEmpty'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaEmpty'];
        };
    }
}
