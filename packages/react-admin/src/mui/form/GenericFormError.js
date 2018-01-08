import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        padding: 2 * theme.spacing.unit,
    },
});

export const GenericFormError = ({ error, classes = {}, className, ...rest }) =>
    error ? (
        <Typography
            color="error"
            className={classnames(classes.root, className)}
            {...rest}
        >
            {error}
        </Typography>
    ) : null;

GenericFormError.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    error: PropTypes.string,
};

export default withStyles(styles)(GenericFormError);
