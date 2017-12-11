import React from 'react';
import PropTypes from 'prop-types';
import { CardActions as MuiCardActions } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';

const styles = {
    cardActions: {
        zIndex: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },
};

const CardActions = ({ classes, children, ...rest }) => (
    <MuiCardActions className={classes.cardAction} {...rest}>
        {children}
    </MuiCardActions>
);

CardActions.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(CardActions);
