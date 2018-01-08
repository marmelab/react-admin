import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import DefaultBulkActions from './BulkActions';

import {
    CreateButton as DefaultCreateButton,
    RefreshButton as DefaultRefreshButton,
} from '../button';
import CardActions from '../layout/CardActions';

const ListActions = ({
    className,
    resource,
    filters,
    displayedFilters,
    filterValues,
    hasCreate,
    selectable,
    selection,
    selectionData,
    basePath,
    showFilter,
    bulkActions = <DefaultBulkActions />,
    createButton = <DefaultCreateButton />,
    refreshButton = <DefaultRefreshButton />,
    ...rest
}) => {
    return (
        <CardActions className={className} {...rest}>
            {filters &&
                React.cloneElement(filters, {
                    resource,
                    showFilter,
                    displayedFilters,
                    filterValues,
                    context: 'button',
                })}
            {selectable &&
                React.cloneElement(bulkActions, {
                    resource,
                    selection,
                    selectionData,
                })}
            {hasCreate && React.cloneElement(createButton, { basePath })}
            {refreshButton}
        </CardActions>
    );
};

ListActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    displayedFilters: PropTypes.object,
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    selectable: PropTypes.bool,
    selection: PropTypes.array,
    selectionData: PropTypes.object,
    selectionMode: PropTypes.oneOf(['single', 'page', 'bulk']),
    selectActions: PropTypes.element,
    bulkActions: PropTypes.element,
    createButton: PropTypes.element,
    refreshButton: PropTypes.element,
    resource: PropTypes.string,
    showFilter: PropTypes.func,
};

export default onlyUpdateForKeys([
    'resource',
    'selection',
    'filters',
    'displayedFilters',
    'filterValues',
])(ListActions);
