import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Menu from 'material-ui/Menu';

import Button from '../../button/Button';
import translate from '../../../i18n/translate';
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

    handleCloseAfterAction = unselectItems => {
        this.setState({ anchorElement: null });
        if (unselectItems) {
            this.props.onUnselectItems();
        }
    };

    handleClose = () => {
        this.setState({ anchorElement: null });
    };

    render() {
        const {
            basePath,
            children,
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
                            basePath,
                            filterValues,
                            onClick: this.handleCloseAfterAction,
                            resource,
                            selectedIds,
                        })
                    )}
                    <BulkDeleteMenuItem
                        basePath={basePath}
                        filterValues={filterValues}
                        onClick={this.handleCloseAfterAction}
                        resource={resource}
                        selectedIds={selectedIds}
                    />
                </Menu>
            </div>
        );
    }
}

BulkActions.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    filterValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    onUnselectItems: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
};

BulkActions.defaultProps = {
    label: 'ra.action.bulk_actions',
};

const EnhancedButton = translate(BulkActions);

export default EnhancedButton;
