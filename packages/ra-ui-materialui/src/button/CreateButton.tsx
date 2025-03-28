import * as React from 'react';
import ContentAdd from '@mui/icons-material/Add';
import { Fab, useMediaQuery, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import {
    useTranslate,
    useResourceContext,
    useCreatePath,
    useCanAccess,
} from 'ra-core';
import { Link, To } from 'react-router-dom';

import { Button, ButtonProps, LocationDescriptor } from './Button';

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
const CreateButton = (props: CreateButtonProps) => {
    const {
        className,
        icon = defaultIcon,
        label = 'ra.action.create',
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
    const translate = useTranslate();
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
            aria-label={label && translate(label)}
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
            label={label}
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
    icon?: React.ReactElement;
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
        color: theme.palette.getContrastText(theme.palette.primary.main),
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
