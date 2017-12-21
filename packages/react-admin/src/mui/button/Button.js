import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import MuiButton from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import translate from '../../i18n/translate';
import classnames from 'classnames';
import Responsive from '../layout/Responsive';

const styles = {
    button: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    label: {
        paddingLeft: '0.5em',
    },
};

const Button = ({
    children,
    className,
    classes = {},
    color = 'primary',
    label,
    translate,
    ...rest
}) => (
    <MuiButton
        className={classnames(classes.button, className)}
        color={color}
        {...rest}
    >
        {children}
        <Responsive
            small={<span />}
            medium={
                <span className={classes.label}>
                    {label && translate(label)}
                </span>
            }
        />
    </MuiButton>
);

Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object,
    color: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(withStyles(styles), translate);

export default enhance(Button);
