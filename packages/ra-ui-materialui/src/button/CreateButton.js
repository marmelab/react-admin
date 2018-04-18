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
    ButtonClass,
    basePath = '',
    className,
    classes = {},
    icon,
    label = 'ra.action.create',
    translate,
    ...rest
}) => (
    <Responsive
        small={
            <ButtonClass
                component={Link}
                variant="fab"
                color="primary"
                className={classnames(classes.floating, className)}
                to={`${basePath}/create`}
                {...rest}
            >
                {React.cloneElement(icon)}
            </ButtonClass>
        }
        medium={
            <ButtonClass
                component={Link}
                color="primary"
                to={`${basePath}/create`}
                className={classnames(classes.desktopLink, className)}
                {...rest}
            >
                {React.cloneElement(icon, {
                    className: classes.iconPaddingStyle,
                })}
                {label && translate(label)}
            </ButtonClass>
        }
    />
);

CreateButton.propTypes = {
    ButtonClass: PropTypes.object.isRequired,
    basePath: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.object,
    icon: PropTypes.element.isRequired,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

CreateButton.defaultProps = {
    ButtonClass: Button,
    icon: <ContentAdd />,
};

const enhance = compose(
    translate,
    onlyUpdateForKeys(['basePath', 'label']),
    withStyles(styles)
);

export default enhance(CreateButton);
