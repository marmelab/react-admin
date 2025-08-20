import * as React from 'react';
import {
    Alert,
    AlertProps,
    ComponentsOverrides,
    styled,
    Typography,
} from '@mui/material';
import {
    useGetResourceLabel,
    useResourceContext,
    useResourceTranslation,
} from 'ra-core';
import clsx from 'clsx';

export const Offline = (props: Offline) => {
    const { icon, message: messageProp, variant = 'standard', ...rest } = props;
    const resource = useResourceContext(props);
    const getResourceLabel = useGetResourceLabel();

    const message = useResourceTranslation({
        baseI18nKey: 'ra.notification.offline',
        resourceI18nKey: resource
            ? `resources.${resource}.notification.offline`
            : undefined,
        userText: messageProp,
        options: {
            name: resource ? getResourceLabel(resource, 0) : undefined,
            _: 'No connectivity. Could not fetch data.',
        },
    });

    return (
        <Root
            className={clsx(OfflineClasses.root, {
                [OfflineClasses.inline]: variant === 'inline',
            })}
            severity="warning"
            variant={variant === 'inline' ? 'outlined' : variant}
            icon={variant === 'inline' ? false : icon}
            {...rest}
        >
            <Typography variant="body2">{message}</Typography>
        </Root>
    );
};

export interface Offline extends Omit<AlertProps, 'variant'> {
    resource?: string;
    message?: string;
    variant?: AlertProps['variant'] | 'inline';
}

const PREFIX = 'RaOffline';
export const OfflineClasses = {
    root: `${PREFIX}-root`,
    inline: `${PREFIX}-inline`,
};

const Root = styled(Alert, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    [`&.${OfflineClasses.inline}`]: {
        border: 'none',
        display: 'inline-flex',
        padding: 0,
        margin: 0,
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<Offline>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
