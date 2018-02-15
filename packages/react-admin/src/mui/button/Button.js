import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import MuiButton from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import { translate } from 'react-admin-core';
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
};

const Button = ({
    children,
    className,
    classes = {},
    color = 'primary',
    label,
    translate,
    alignIcon = 'left',
    ...rest
}) => (
    <MuiButton
        className={classnames(classes.button, className)}
        color={color}
        {...rest}
    >
        {alignIcon === 'left' && children}
        <Responsive
            small={<span />}
            medium={
                <span
                    className={classnames({
                        [classes.label]: alignIcon === 'left',
                        [classes.labelRightIcon]: alignIcon !== 'left',
                    })}
                >
                    {label && translate(label, { _: label })}
                </span>
            }
        />
        {alignIcon === 'right' && children}
    </MuiButton>
);

Button.propTypes = {
    alignIcon: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object,
    color: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(withStyles(styles), translate);

export default enhance(Button);
