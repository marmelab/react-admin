import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import ActionDelete from '@material-ui/icons/Delete';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import inflection from 'inflection';
import { crudDeleteMany } from 'ra-core';

import Confirm from '../layout/Confirm';
import Button from './Button';

const sanitizeRestProps = ({
    basePath,
    classes,
    crudDeleteMany,
    filterValues,
    label,
    resource,
    selectedIds,
    ...rest
}) => rest;

const styles = theme =>
    createStyles({
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

class BulkDeleteWithConfirmButton extends Component {
    static propTypes = {
        basePath: PropTypes.string,
        classes: PropTypes.object,
        crudDeleteMany: PropTypes.func.isRequired,
        label: PropTypes.string,
        resource: PropTypes.string.isRequired,
        selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
        icon: PropTypes.element,
    };

    static defaultProps = {
        label: 'ra.action.delete',
        icon: <ActionDelete />,
    };

    state = { isOpen: false };

    handleClick = e => {
        this.setState({ isOpen: true });
        e.stopPropagation();
    };

    handleDialogClose = () => {
        this.setState({ isOpen: false });
    };

    handleDelete = () => {
        const {
            basePath,
            crudDeleteMany,
            resource,
            selectedIds,
            onClick,
        } = this.props;

        crudDeleteMany(resource, selectedIds, basePath);

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    render() {
        const {
            classes,
            label,
            icon,
            onClick,
            resource,
            selectedIds,
            ...rest
        } = this.props;
        return (
            <Fragment>
                <Button
                    onClick={this.handleClick}
                    label={label}
                    className={classes.deleteButton}
                    {...sanitizeRestProps(rest)}
                >
                    {icon}
                </Button>
                <Confirm
                    isOpen={this.state.isOpen}
                    title="ra.message.bulk_delete_title"
                    content="ra.message.bulk_delete_content"
                    translateOptions={{
                        smart_count: selectedIds.length,
                        name: inflection.humanize(
                            inflection.singularize(resource),
                            true
                        ),
                    }}
                    onConfirm={this.handleDelete}
                    onClose={this.handleDialogClose}
                />
            </Fragment>
        );
    }
}

const EnhancedBulkDeleteWithConfirmButton = compose(
    connect(
        undefined,
        { crudDeleteMany }
    ),
    withStyles(styles)
)(BulkDeleteWithConfirmButton);

export default EnhancedBulkDeleteWithConfirmButton;
