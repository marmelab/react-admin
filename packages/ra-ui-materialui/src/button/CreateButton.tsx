import * as React from 'react';
import ContentAdd from '@mui/icons-material/Add';
import { Fab, useMediaQuery, type Theme } from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import clsx from 'clsx';
import isEqual from 'lodash/isEqual.js';
import merge from 'lodash/merge.js';
import {
    useCreatePath,
    useCanAccess,
    useGetResourceLabel,
    useResourceContext,
    useResourceTranslation,
} from 'ra-core';
import { Link, type To } from 'react-router-dom';

import { Button, type ButtonProps, type LocationDescriptor } from './Button';

/**
 * Opens the Create view of a given resource
 *
 * Renders as a regular button on desktop, and a Floating Action Button
 * on mobile.
 *
 * @example // basic usage
 * import { CreateButton } from 'react-admin';
 *
 * const CommentCreateButton = () => (
 *     <CreateButton label="Create comment" />
 * );
 */
const CreateButton = (inProps: CreateButtonProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        className,
        icon = defaultIcon,
        label: labelProp,
        resource: resourceProp,
        scrollToTop = true,
        variant,
        to: locationDescriptor,
        state: initialState = {},
        ...rest
    } = props;

    const resource = useResourceContext(props);

    if (!resource) {
        throw new Error(
            '<CreateButton> components should be used inside a <Resource> component or provided the resource prop.'
        );
    }

    const { canAccess, isPending } = useCanAccess({
        action: 'create',
        resource,
    });
    const createPath = useCreatePath();
    const getResourceLabel = useGetResourceLabel();
    const label = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.action.create`,
        baseI18nKey: 'ra.action.create',
        options: {
            name: getResourceLabel(resource, 1),
        },
        userText: labelProp,
    });
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('md')
    );
    const state = merge(
        {},
        scrollStates.get(String(scrollToTop)),
        initialState
    );
    // Duplicated behavior of Button component (legacy use) which will be removed in v5.
    const linkParams = getLinkParams(locationDescriptor);

    if (!canAccess || isPending) {
        return null;
    }
    return isSmall ? (
        <StyledFab
            component={Link}
            to={createPath({ resource, type: 'create' })}
            state={state}
            // @ts-ignore FabProps ships its own runtime palette `FabPropsColorOverrides` provoking an overlap error with `ButtonProps`
            color="primary"
            className={clsx(CreateButtonClasses.floating, className)}
            // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
            aria-label={typeof label === 'string' ? label : undefined}
            {...rest}
            {...linkParams}
        >
            {icon}
        </StyledFab>
    ) : (
        <StyledButton
            component={Link}
            to={createPath({ resource, type: 'create' })}
            state={state}
            className={clsx(CreateButtonClasses.root, className)}
            // avoid double translation
            label={<>{label}</>}
            // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
            aria-label={typeof label === 'string' ? label : undefined}
            variant={variant}
            {...(rest as any)}
            {...linkParams}
        >
            {icon}
        </StyledButton>
    );
};

// avoids using useMemo to get a constant value for the link state
const scrollStates = new Map([
    ['true', { _scrollToTop: true }],
    ['false', {}],
]);

const defaultIcon = <ContentAdd />;

interface Props {
    resource?: string;
    icon?: React.ReactNode;
    scrollToTop?: boolean;
    to?: LocationDescriptor | To;
}

export type CreateButtonProps = Props & Omit<ButtonProps<typeof Link>, 'to'>;

const PREFIX = 'RaCreateButton';

export const CreateButtonClasses = {
    root: `${PREFIX}-root`,
    floating: `${PREFIX}-floating`,
};

const StyledFab = styled(Fab, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`&.${CreateButtonClasses.floating}`]: {
        color: (theme.vars || theme).palette.primary.contrastText,
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 60,
        left: 'auto',
        position: 'fixed',
        zIndex: 1000,
    },
})) as unknown as typeof Fab;

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})({});

export default React.memo(CreateButton, (prevProps, nextProps) => {
    return (
        prevProps.resource === nextProps.resource &&
        prevProps.label === nextProps.label &&
        prevProps.translate === nextProps.translate &&
        prevProps.disabled === nextProps.disabled &&
        isEqual(prevProps.to, nextProps.to) &&
        isEqual(prevProps.state, nextProps.state)
    );
});

const getLinkParams = (locationDescriptor?: LocationDescriptor | string) => {
    // eslint-disable-next-line
    if (locationDescriptor == undefined) {
        return undefined;
    }

    if (typeof locationDescriptor === 'string') {
        return { to: locationDescriptor };
    }

    const { redirect, replace, state, ...to } = locationDescriptor;
    return {
        to,
        redirect,
        replace,
        state,
    };
};

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaCreateButton: 'root' | 'floating';
    }

    interface ComponentsPropsList {
        RaCreateButton: Partial<CreateButtonProps>;
    }

    interface Components {
        RaCreateButton?: {
            defaultProps?: ComponentsPropsList['RaCreateButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaCreateButton'];
        };
    }
}
