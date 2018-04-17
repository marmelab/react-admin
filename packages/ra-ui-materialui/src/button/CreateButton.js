import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import ContentAdd from '@material-ui/icons/Add';
import compose from 'recompose/compose';
import classnames from 'classnames';

import Responsive from '../layout/Responsive';
import Link from '../Link';
import { translate } from 'ra-core';

const styles = theme => ({
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
    floatingLink: {
        color: 'inherit',
    },
    desktopLink: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
});

const CreateButton = ({
    basePath = '',
    className,
    classes = {},
    translate,
    label = 'ra.action.create',
    ...rest
}) => (
    <Responsive
        small={
            <Button
                component={Link}
                variant="fab"
                color="primary"
                className={classnames(classes.floating, className)}
                to={`${basePath}/create`}
                {...rest}
            >
                <ContentAdd />
            </Button>
        }
        medium={
            <Button
                component={Link}
                color="primary"
                to={`${basePath}/create`}
                className={classnames(classes.desktopLink, className)}
                {...rest}
            >
                <ContentAdd className={classes.iconPaddingStyle} />
                {label && translate(label)}
            </Button>
        }
    />
);

CreateButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    translate,
    onlyUpdateForKeys(['basePath', 'label']),
    withStyles(styles)
);

export default enhance(CreateButton);
