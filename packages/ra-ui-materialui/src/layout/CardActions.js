import React from 'react';
import PropTypes from 'prop-types';
import MuiCardActions from '@material-ui/core/CardActions';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = {
    cardActions: {
        zIndex: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },
};

const CardActions = ({ classes, className, children, ...rest }) => (
    <MuiCardActions
        className={classnames(classes.cardActions, className)}
        {...rest}
    >
        {children}
    </MuiCardActions>
);

CardActions.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default withStyles(styles)(CardActions);
