import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = createStyles({
    cardActions: {
        zIndex: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        padding: 0,
    },
});

const CardActions = ({ classes, className, children, ...rest }) => (
    <div className={classnames(classes.cardActions, className)} {...rest}>
        {children}
    </div>
);

CardActions.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default withStyles(styles)(CardActions);
