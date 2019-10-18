import React, { Component, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
} from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import classnames from 'classnames';
import {
    withTranslate,
    startUndoable as startUndoableAction,
    Record,
    RedirectionSideEffect,
    Translate,
    crudDelete,
} from 'ra-core';

interface Props {
    className?: string;
    label?: string;
    icon: ReactElement<any>;
    redirect: RedirectionSideEffect;
    onClick?: (event: MouseEvent) => void;
}

interface InjectedProps {
    basePath: string;
    parentSource: string;
    positionSource?: string;
    record: Record;
    resource: string;
    startUndoable: typeof startUndoableAction;
    translate: Translate;
}

const styles = (theme: Theme) =>
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

class DeleteWithUndoButton extends Component<
    Props & InjectedProps & WithStyles<typeof styles> & MenuItemProps
> {
    static propTypes = {
        basePath: PropTypes.string,
        classes: PropTypes.object,
        className: PropTypes.string,
        label: PropTypes.string,
        record: PropTypes.object,
        redirect: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.func,
        ]),
        resource: PropTypes.string.isRequired,
        startUndoable: PropTypes.func,
        translate: PropTypes.func,
        icon: PropTypes.element,
    };

    static defaultProps = {
        classes: {},
        redirect: undefined,
        undoable: true,
        icon: <ActionDelete />,
    };

    handleDelete = event => {
        event.stopPropagation();
        const {
            startUndoable,
            resource,
            record,
            basePath,
            redirect: redirectTo,
            onClick,
        } = this.props;

        startUndoable(
            crudDelete(resource, record.id, record, basePath, redirectTo, false)
        );

        if (typeof onClick === 'function') {
            onClick(event);
        }
    };

    render() {
        const {
            label = 'ra.action.delete',
            classes,
            className,
            icon,
            onClick,
            translate,
            ...rest
        } = this.props;
        return (
            <MenuItem
                onClick={this.handleDelete}
                className={classnames(classes.deleteButton, className)}
                key="button"
                {...sanitizeRestProps(rest)}
            >
                {translate(label)}
            </MenuItem>
        );
    }
}

export const sanitizeRestProps = ({
    basePath,
    classes,
    dispatchCrudDelete,
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
    startUndoable,
    undoable,
    redirect,
    submitOnEnter,
    ...rest
}: any) => rest;

export default compose(
    connect(
        null,
        { startUndoable: startUndoableAction }
    ),
    withTranslate,
    withStyles(styles)
)(DeleteWithUndoButton);
