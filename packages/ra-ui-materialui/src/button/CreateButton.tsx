import * as React from 'react';
import { ReactElement, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Fab, useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ContentAdd from '@material-ui/icons/Add';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { useTranslate, useResourceContext } from 'ra-core';

import Button, { ButtonProps, sanitizeButtonRestProps } from './Button';

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
 *     <CreateButton basePath="/comments" label="Create comment" />
 * );
 */
const CreateButton = (props: CreateButtonProps) => {
    const {
        basePath = '',
        className,
        classes: classesOverride,
        icon = defaultIcon,
        label = 'ra.action.create',
        scrollToTop = true,
        variant,
        ...rest
    } = props;
    const classes = useStyles(props);
    const translate = useTranslate();
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const resource = useResourceContext();
    const location = useMemo(
        () => ({
            pathname: basePath ? `${basePath}/create` : `/${resource}/create`,
            state: { _scrollToTop: scrollToTop },
        }),
        [basePath, resource, scrollToTop]
    );
    return isSmall ? (
        <Fab
            component={Link}
            color="primary"
            className={classnames(classes.floating, className)}
            to={location}
            aria-label={label && translate(label)}
            {...sanitizeButtonRestProps(rest)}
        >
            {icon}
        </Fab>
    ) : (
        <Button
            component={Link}
            to={location}
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

const useStyles = makeStyles(
    theme => ({
        floating: {
            color: theme.palette.getContrastText(theme.palette.primary.main),
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 60,
            left: 'auto',
            position: 'fixed',
            zIndex: 1000,
        },
    }),
    { name: 'RaCreateButton' }
);

interface Props {
    basePath?: string;
    icon?: ReactElement;
    scrollToTop?: boolean;
}

export type CreateButtonProps = Props & ButtonProps;

CreateButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
};

export default memo(CreateButton, (prevProps, nextProps) => {
    return (
        prevProps.basePath === nextProps.basePath &&
        prevProps.label === nextProps.label &&
        prevProps.translate === nextProps.translate &&
        prevProps.to === nextProps.to &&
        prevProps.disabled === nextProps.disabled
    );
});
