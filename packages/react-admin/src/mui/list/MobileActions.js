import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { CreateButton, RefreshButton } from '../button';

class MobileActions extends React.Component {
    state = {
        open: true,
    };

    handleClick() {
        this.setState({ open: true });
    }

    render() {
        const {
            //selection,
            filters,
            showFilter,
            resource,
            basePath,
            displayedFilters,
            filterValues,
            hasCreate,
            //selectActions,
            //selectable,
        } = this.props;

        return (
            <div>
                {filters &&
                    React.cloneElement(filters, {
                        resource,
                        showFilter,
                        displayedFilters,
                        filterValues,
                        context: 'button',
                    })}
                <RefreshButton />
                {hasCreate && <CreateButton basePath={basePath} />}
            </div>
        );
    }
}
// TODO: add SelectActions from next-bulk-actions here.

MobileActions.propTypes = {
    basePath: PropTypes.string,
    displayedFilters: PropTypes.object,
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    //    selectable: PropTypes.bool,
    //    selection: PropTypes.array,
    //    selectMode: PropTypes.oneOf(['single', 'page', 'bulk']),
    //    selectActions: PropTypes.element,
    resource: PropTypes.string,
    showFilter: PropTypes.func,
    theme: PropTypes.object,
};

export default onlyUpdateForKeys([
    'resource',
    'filters',
    'displayedFilters',
    'filterValues',
])(MobileActions);
