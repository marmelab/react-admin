import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';
import classnames from 'classnames';
import inflection from 'inflection';
import { translate, crudDelete } from 'ra-core';

import Confirm from '../layout/Confirm';
import Button from './Button';

const sanitizeRestProps = ({
    basePath,
    classes,
    crudDelete,
    filterValues,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    label,
    pristine,
    resource,
    saving,
    selectedIds,
    submitOnEnter,
    redirect,
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

class DeleteWithConfirmButton extends Component {
    state = { isOpen: false };

    handleClick = e => {
        this.setState({ isOpen: true });
        e.stopPropagation();
    };

    handleDialogClose = () => {
        this.setState({ isOpen: false });
    };

    handleDelete = () => {
        const { crudDelete, resource, record, basePath, redirect } = this.props;
        crudDelete(resource, record.id, record, basePath, redirect);
    };

    render() {
        const {
            classes = {},
            className,
            icon,
            label = 'ra.action.delete',
            onClick,
            record,
            resource,
            ...rest
        } = this.props;
        return (
            <Fragment>
                <Button
                    onClick={this.handleClick}
                    label={label}
                    className={classnames(
                        'ra-delete-button',
                        classes.deleteButton,
                        className
                    )}
                    key="button"
                    {...sanitizeRestProps(rest)}
                >
                    {icon}
                </Button>
                <Confirm
                    isOpen={this.state.isOpen}
                    title="ra.message.delete_title"
                    content="ra.message.delete_content"
                    translateOptions={{
                        name: inflection.humanize(
                            inflection.singularize(resource),
                            true
                        ),
                        id: record.id,
                    }}
                    onConfirm={this.handleDelete}
                    onClose={this.handleDialogClose}
                />
            </Fragment>
        );
    }
}

DeleteWithConfirmButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    crudDelete: PropTypes.func.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string.isRequired,
    translate: PropTypes.func,
    icon: PropTypes.element,
};

DeleteWithConfirmButton.defaultProps = {
    redirect: 'list',
    icon: <ActionDelete />,
};

export default compose(
    connect(
        null,
        { crudDelete }
    ),
    translate,
    withStyles(styles)
)(DeleteWithConfirmButton);
