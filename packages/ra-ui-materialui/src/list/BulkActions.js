import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { translate } from 'ra-core';

import Button from '../button/Button';
import BulkDeleteAction from './BulkDeleteAction';

const styles = theme => ({
    bulkActionsButton: {
        opacity: 1,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        '&.fade-enter': {
            opacity: 0,
        },
        '&.fade-enter-done': {
            opacity: 1,
        },
        '&.fade-exit': {
            opacity: 0,
        },
        '&.fade-exit-done': {
            opacity: 0,
        },
    },
    icon: {
        marginRight: theme.spacing.unit,
    },
});

const timeoutDurations = {
    enter: 0,
    exit: 300,
};

const sanitizeRestProps = ({
    basePath,
    classes,
    filterValues,
    resource,
    onUnselectItems,
    ...rest
}) => rest;

/**
 * @deprecated pass a Fragment with button children as bulkActionButtons props instead
 */
class BulkActions extends Component {
    state = {
        isOpen: false,
        activeAction: null,
    };

    componentDidMount() {
        // eslint-disable-next-line no-console
        console.warn(
            '<BulkActions> is deprecated. Use the bulkActionButtons prop instead.'
        );
    }

    storeButtonRef = node => {
        this.anchorElement = node;
    };

    handleClick = () => {
        this.setState({ isOpen: true });
    };

    handleClose = () => {
        this.setState({ isOpen: false });
    };

    handleLaunchAction = action => {
        this.setState({ activeAction: action, isOpen: false });
    };

    handleExitAction = () => {
        this.setState({ activeAction: null });
    };

    render() {
        const {
            basePath,
            classes,
            children,
            className,
            filterValues,
            label,
            resource,
            selectedIds,
            translate,
            ...rest
        } = this.props;
        const { isOpen } = this.state;

        return (
            <CSSTransition
                in={selectedIds.length > 0}
                timeout={timeoutDurations}
                mountOnEnter
                unmountOnExit
                classNames="fade"
            >
                <div className={classes.bulkActionsButton}>
                    <Button
                        buttonRef={this.storeButtonRef}
                        className={classnames('bulk-actions-button', className)}
                        alignIcon="left"
                        aria-owns={isOpen ? 'bulk-actions-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        {...sanitizeRestProps(rest)}
                        label={translate(label, {
                            _: label,
                            smart_count: selectedIds.length,
                        })}
                    >
                        <FilterNoneIcon className={classes.icon} />
                    </Button>
                    <Menu
                        id="bulk-actions-menu"
                        anchorEl={this.anchorElement}
                        onClose={this.handleClose}
                        open={isOpen}
                    >
                        {Children.map(children, (child, index) => (
                            <MenuItem
                                key={index}
                                className={classnames(
                                    'bulk-actions-menu-item',
                                    child.props.className
                                )}
                                onClick={() => this.handleLaunchAction(index)}
                                {...sanitizeRestProps(rest)}
                            >
                                {translate(child.props.label)}
                            </MenuItem>
                        ))}
                    </Menu>
                    {Children.map(
                        children,
                        (child, index) =>
                            this.state.activeAction === index &&
                            cloneElement(child, {
                                basePath,
                                filterValues,
                                onExit: this.handleExitAction,
                                resource,
                                selectedIds,
                            })
                    )}
                </div>
            </CSSTransition>
        );
    }
}

BulkActions.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    filterValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    translate: PropTypes.func.isRequired,
};

BulkActions.defaultProps = {
    children: <BulkDeleteAction />,
    label: 'ra.action.bulk_actions',
    selectedIds: [],
};

const EnhancedButton = compose(
    withStyles(styles),
    translate
)(BulkActions);

export default EnhancedButton;
