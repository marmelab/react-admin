import React, { Fragment, Component, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import classnames from 'classnames';
import inflection from 'inflection';
import {
    withTranslate,
    RedirectionSideEffect,
    Record,
    Translate,
} from 'ra-core';
import { Confirm } from 'ra-ui-materialui';
import { deleteNode as deleteNodeAction } from 'ra-tree-core';

interface Props {
    className?: string;
    label?: string;
    icon: ReactElement<any>;
    redirect: RedirectionSideEffect;
    onClick?: (event: MouseEvent) => void;
}

interface InjectedProps {
    basePath: string;
    deleteNode: typeof deleteNodeAction;
    parentSource: string;
    positionSource?: string;
    record: Record;
    resource: string;
    translate: Translate;
}

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

class DeleteWithConfirmMenuItem extends Component<
    Props & InjectedProps & WithStyles<typeof styles> & MenuItemProps
> {
    static propTypes = {
        basePath: PropTypes.string,
        classes: PropTypes.object,
        className: PropTypes.string,
        deleteNode: PropTypes.func.isRequired,
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

    static defaultProps = {
        classes: {},
        redirect: false,
        icon: <ActionDelete />,
    };

    state = { isOpen: false };

    handleClick = e => {
        e.stopPropagation();
        this.setState({ isOpen: true });
    };

    handleDialogClose = e => {
        e.stopPropagation();
        this.setState({ isOpen: false });
    };

    handleDelete = () => {
        const {
            deleteNode,
            resource,
            record,
            basePath,
            redirect,
            parentSource,
            positionSource,
        } = this.props;

        deleteNode({
            resource,
            id: record.id,
            previousData: record,
            basePath,
            redirect,
            parentSource,
            positionSource,
        });
    };

    render() {
        const {
            classes,
            className,
            icon,
            label = 'ra.action.delete',
            onClick,
            record,
            resource,
            translate,
            ...rest
        } = this.props;
        return (
            <Fragment>
                <MenuItem
                    onClick={this.handleClick}
                    className={classnames(classes.deleteButton, className)}
                    key="button"
                    {...sanitizeRestProps(rest)}
                >
                    {translate(label)}
                </MenuItem>
                <Confirm
                    isOpen={this.state.isOpen}
                    title="ra.message.delete_title"
                    content="ra.message.delete_content"
                    translateOptions={{
                        name: inflection.humanize(
                            translate(`resources.${resource}.name`, {
                                smart_count: 1,
                                _: inflection.singularize(resource),
                            }),
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

const sanitizeRestProps = ({
    basePath,
    classes,
    deleteNode,
    filterValues,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    label,
    parentSource,
    positionSource,
    pristine,
    resource,
    saving,
    selectedIds,
    submitOnEnter,
    redirect,
    ...rest
}: any) => rest;

export default compose(
    connect(
        null,
        { deleteNode: deleteNodeAction }
    ),
    withTranslate,
    withStyles(styles)
)(DeleteWithConfirmMenuItem);
