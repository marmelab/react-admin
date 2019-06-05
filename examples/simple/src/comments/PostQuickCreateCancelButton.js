import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import IconCancel from '@material-ui/icons/Cancel';
import withStyles from '@material-ui/core/styles/withStyles';

import { translate } from 'react-admin'; // eslint-disable-line import/no-unresolved

const styles = {
    button: {
        margin: '10px 24px',
        position: 'relative',
    },
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
};

const CancelButtonView = ({ classes, onClick, label = 'ra.action.cancel', translate }) => (
    <Button className={classes.button} onClick={onClick}>
        <IconCancel className={classes.iconPaddingStyle} />
        {label && translate(label, { _: label })}
    </Button>
);

CancelButtonView.propTypes = {
    classes: PropTypes.object,
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
};

export default compose(
    translate,
    withStyles(styles)
)(CancelButtonView);
