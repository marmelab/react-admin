import React from 'react';
import PropTypes from 'prop-types';
import ActionDelete from 'material-ui-icons/Delete';
import { withStyles } from 'material-ui/styles';
import { fade } from 'material-ui/styles/colorManipulator';
import classnames from 'classnames';

import { Link } from 'react-router-dom';
import linkToRecord from '../../util/linkToRecord';
import Button from './Button';

const styles = theme => ({
    deleteButton: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: fade(theme.palette.error.main, 0.12),
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
});

const DeleteButton = ({
    basePath = '',
    label = 'ra.action.delete',
    record = {},
    classes = {},
    className,
    ...rest
}) => (
    <Button
        className={classnames(classes.deleteButton, className)}
        component={Link}
        to={`${linkToRecord(basePath, record.id)}/delete`}
        label={label}
        {...rest}
    >
        <ActionDelete />
    </Button>
);

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
};

export default withStyles(styles)(DeleteButton);
