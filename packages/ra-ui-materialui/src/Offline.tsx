import * as React from 'react';
import {
    Alert,
    AlertProps,
    ComponentsOverrides,
    styled,
    Typography,
} from '@mui/material';
import { useGetResourceLabel, useResourceContext, useTranslate } from 'ra-core';

export const Offline = (props: Offline) => {
    const { message: messageProp } = props;
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const getResourceLabel = useGetResourceLabel();
    if (!resource) {
        throw new Error(
            '<Offline> must be used inside a <Resource> component or provided a resource prop'
        );
    }
    const message = translate(
        messageProp ?? `resources.${resource}.navigation.offline`,
        {
            name: getResourceLabel(resource, 0),
            _:
                messageProp ??
                translate('ra.notification.offline', {
                    name: getResourceLabel(resource, 0),
                    _: 'No connectivity. Could not fetch data.',
                }),
        }
    );
    return (
        <Root severity="warning" {...props}>
            <Typography variant="body2">{message}</Typography>
        </Root>
    );
};

export interface Offline extends AlertProps {
    resource?: string;
    message?: string;
}

const PREFIX = 'RaOffline';

const Root = styled(Alert, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaOffline: 'root';
    }

    interface ComponentsPropsList {
        RaOffline: Partial<Offline>;
    }

    interface Components {
        RaOffline?: {
            defaultProps?: ComponentsPropsList['RaOffline'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaOffline'];
        };
    }
}
