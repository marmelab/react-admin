import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import { fade } from 'material-ui/styles/colorManipulator';
import ActionDelete from 'material-ui-icons/Delete';
import classnames from 'classnames';
import inflection from 'inflection';
import { translate, crudDelete } from 'ra-core';

import Confirm from '../layout/Confirm';
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

class DeleteButton extends Component {
    state = { dialogOpen: false };

    handleClick = () => {
        this.setState({ dialogOpen: true });
    };

    handleDialogClose = () => {
        this.setState({ dialogOpen: false });
    };

    handleDelete = event => {
        event.preventDefault();
        this.props.crudDelete(
            this.props.resource,
            this.props.record.id,
            this.props.record,
            this.props.basePath,
            this.props.redirect
        );
        this.setState({ dialogOpen: false });
    };

    render() {
        const {
            label = 'ra.action.delete',
            classes = {},
            className,
            record,
            resource,
            translate,
        } = this.props;
        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        return [
            <Button
                onClick={this.handleClick}
                label={label}
                className={classnames(
                    'ra-delete-button',
                    classes.deleteButton,
                    className
                )}
                key="button"
            >
                <ActionDelete />
            </Button>,
            <Confirm
                isOpen={this.state.dialogOpen}
                title={translate('ra.message.delete_title', {
                    name: resourceName,
                    id: record && record.id,
                    data: record,
                })}
                content={translate('ra.message.delete_content', {
                    name: resourceName,
                    id: record && record.id,
                    data: record,
                })}
                confirm={translate('ra.action.delete')}
                confirmColor="warning"
                cancel={translate('ra.action.cancel')}
                onConfirm={this.handleDelete}
                onClose={this.handleDialogClose}
                key="dialog"
            />,
        ];
    }
}

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    crudDelete: PropTypes.func,
    label: PropTypes.string,
    record: PropTypes.object,
    redirect: PropTypes.string,
    resource: PropTypes.string.isRequired,
    translate: PropTypes.func,
};

DeleteButton.defaultProps = {
    redirect: 'list',
};

export default compose(
    connect(null, { crudDelete }),
    translate,
    withStyles(styles)
)(DeleteButton);
