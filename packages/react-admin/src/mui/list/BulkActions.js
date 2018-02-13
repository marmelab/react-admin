import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Menu from 'material-ui/Menu';
import classnames from 'classnames';

import Button from '../button/Button';
import translate from '../../i18n/translate';
import BulkDeleteMenuItem from './BulkDeleteMenuItem';

const sanitizeRestProps = ({
    basePath,
    filterValues,
    resource,
    onUnselectItems,
    ...rest
}) => rest;

class BulkActions extends Component {
    state = {
        anchorElement: null,
    };

    handleClick = event => {
        this.setState({ anchorElement: event.currentTarget });
    };

    handleCloseAfterAction = () => {
        this.setState({ anchorElement: null });
    };

    handleClose = () => {
        this.setState({ anchorElement: null });
    };

    render() {
        const {
            basePath,
            children,
            className,
            filterValues,
            label,
            resource,
            selectedIds,
            translate,
            ...rest
        } = this.props;
        const { anchorElement } = this.state;

        return (
            <div>
                <Button
                    className={classnames('bulk-actions-button', className)}
                    alignIcon="right"
                    aria-owns={anchorElement ? 'bulk-actions-menu' : null}
                    aria-haspopup="true"
                    label={translate(label, {
                        _: label,
                        count: selectedIds.length,
                    })}
                    onClick={this.handleClick}
                    {...sanitizeRestProps(rest)}
                >
                    <MoreVertIcon />
                </Button>
                <Menu
                    id="bulk-actions-menu"
                    anchorEl={anchorElement}
                    onClose={this.handleClose}
                    open={!!anchorElement}
                >
                    {Children.map(children, child =>
                        cloneElement(child, {
                            className: classnames(
                                'bulk-actions-menu-item',
                                child.props.className
                            ),
                            basePath,
                            filterValues,
                            onCloseMenu: this.handleCloseAfterAction,
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
};

const EnhancedButton = translate(BulkActions);

export default EnhancedButton;
