import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import MuiButton from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { translate } from 'ra-core';

import Responsive from '../layout/Responsive';

const styles = {
    button: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    label: {
        paddingLeft: '0.5em',
    },
    labelRightIcon: {
        paddingRight: '0.5em',
    },
    smallIcon: {
        fontSize: 20,
    },
    mediumIcon: {
        fontSize: 22,
    },
    largeIcon: {
        fontSize: 24,
    },
};

const Button = ({
    alignIcon = 'left',
    children,
    classes = {},
    className,
    color = 'primary',
    label,
    size = 'small',
    translate,
    ...rest
}) => (
    <Responsive
        small={
            <Tooltip title={label && translate(label, { _: label })}>
                <IconButton
                    arial-label={label && translate(label, { _: label })}
                    className={className}
                    color={color}
                    {...rest}
                >
                    {children}
                </IconButton>
            </Tooltip>
        }
        medium={
            <MuiButton
                className={classnames(classes.button, className)}
                color={color}
                size={size}
                {...rest}
            >
                {alignIcon === 'left' &&
                    React.cloneElement(children, {
                        className: classes[`${size}Icon`],
                    })}
                <span
                    className={classnames({
                        [classes.label]: alignIcon === 'left',
                        [classes.labelRightIcon]: alignIcon !== 'left',
                    })}
                >
                    {label && translate(label, { _: label })}
                </span>
                {alignIcon === 'right' &&
                    React.cloneElement(children, {
                        className: classes[`${size}Icon`],
                    })}
            </MuiButton>
        }
    />
);

Button.propTypes = {
    alignIcon: PropTypes.string,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.string,
    label: PropTypes.string,
    size: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    withStyles(styles),
    translate
);

export default enhance(Button);
