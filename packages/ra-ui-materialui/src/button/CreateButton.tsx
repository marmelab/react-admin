import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement, memo } from 'react';
import PropTypes from 'prop-types';
import { Fab, useMediaQuery, Theme } from '@mui/material';
import ContentAdd from '@mui/icons-material/Add';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { useTranslate, useResourceContext, useCreatePath } from 'ra-core';

import { Button, ButtonProps, sanitizeButtonRestProps } from './Button';

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
        scrollToTop = true,
        variant,
        ...rest
    } = props;

    const resource = useResourceContext(props);
    const createPath = useCreatePath();
    const translate = useTranslate();
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('md')
    );

    return isSmall ? (
        <StyledFab
            component={Link}
            to={createPath({ resource, type: 'create' })}
            state={{ _scrollToTop: scrollToTop }}
            color="primary"
            className={classnames(CreateButtonClasses.floating, className)}
            aria-label={label && translate(label)}
            {...sanitizeButtonRestProps(rest)}
        >
            {icon}
        </StyledFab>
    ) : (
        <Button
            component={Link}
            to={createPath({ resource, type: 'create' })}
            state={{ _scrollToTop: scrollToTop }}
            className={className}
            label={label}
            variant={variant}
            {...(rest as any)}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <ContentAdd />;

interface Props {
    resource?: string;
    icon?: ReactElement;
    scrollToTop?: boolean;
}

export type CreateButtonProps = Props & ButtonProps;

CreateButton.propTypes = {
    resource: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
};

const PREFIX = 'RaCreateButton';

export const CreateButtonClasses = {
    floating: `${PREFIX}-floating`,
};

const StyledFab = styled(Fab, { name: PREFIX })(({ theme }) => ({
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
}));

export default memo(CreateButton, (prevProps, nextProps) => {
    return (
        prevProps.resource === nextProps.resource &&
        prevProps.label === nextProps.label &&
        prevProps.translate === nextProps.translate &&
        prevProps.disabled === nextProps.disabled
    );
});
