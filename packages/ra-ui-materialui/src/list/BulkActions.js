import React, { cloneElement, Children, Component } from 'react';

import PropTypes from 'prop-types';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Menu from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { translate } from 'ra-core';

import Button from '../button/Button';
import BulkDeleteMenuItem from './BulkDeleteMenuItem';

const styles = theme => ({
    bulkActionsButton: {
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    unselected: {
        opacity: 0,
    },
    selected: {
        opacity: 1,
    },
});

const sanitizeRestProps = ({
    basePath,
    classes,
    filterValues,
    resource,
    onUnselectItems,
    ...rest
}) => rest;

class BulkActions extends Component {
    state = {
        isOpen: false,
    };

    storeButtonRef = node => {
        this.anchorElement = node;
    };

    handleClick = () => {
        this.setState({ isOpen: true });
    };

    handleClose = () => {
        this.setState({ isOpen: false });
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
            <div>
                <Button
                    buttonRef={this.storeButtonRef}
                    className={classnames(
                        'bulk-actions-button',
                        className,
                        classes.bulkActionsButton,
                        {
                            [classes.selected]: selectedIds.length > 0,
                            [classes.unselected]: selectedIds.length === 0,
                        }
                    )}
                    alignIcon="right"
                    aria-owns={isOpen ? 'bulk-actions-menu' : null}
                    aria-haspopup="true"
                    label={translate(label, {
                        _: label,
                        smart_count: selectedIds.length,
                    })}
                    onClick={this.handleClick}
                    {...sanitizeRestProps(rest)}
                >
                    <MoreVertIcon />
                </Button>
                <Menu
                    id="bulk-actions-menu"
                    anchorEl={this.anchorElement}
                    onClose={this.handleClose}
                    open={isOpen}
                >
                    {Children.map(children, child =>
                        cloneElement(child, {
                            className: classnames(
                                'bulk-actions-menu-item',
                                child.props.className
                            ),
                            basePath,
                            filterValues,
                            onCloseMenu: this.handleClose,
                            resource,
                            selectedIds,
                        })
                    )}
                </Menu>
            </div>
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
    children: <BulkDeleteMenuItem />,
    label: 'ra.action.bulk_actions',
    selectedIds: [],
};

const EnhancedButton = compose(withStyles(styles), translate)(BulkActions);

export default EnhancedButton;
