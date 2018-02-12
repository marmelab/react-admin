import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import { CreateButton, RefreshButton } from '../button';
import CardActions from '../layout/CardActions';
import BulkActions from './BulkActions';

const Actions = ({
    bulkActions,
    className,
    resource,
    filters,
    displayedFilters,
    filterValues,
    hasCreate,
    basePath,
    selectedIds,
    onUnselectItems,
    showFilter,
    ...rest
}) => {
    return (
        <CardActions className={className} {...rest}>
            {selectedIds &&
                selectedIds.length > 0 && (
                    <BulkActions
                        basePath={basePath}
                        filterValues={filterValues}
                        resource={resource}
                        selectedIds={selectedIds}
                        onUnselectItems={onUnselectItems}
                    >
                        {bulkActions}
                    </BulkActions>
                )}
            {filters &&
                React.cloneElement(filters, {
                    resource,
                    showFilter,
                    displayedFilters,
                    filterValues,
                    context: 'button',
                })}
            {hasCreate && <CreateButton basePath={basePath} />}
            <RefreshButton />
        </CardActions>
    );
};

Actions.propTypes = {
    bulkActions: PropTypes.node,
    basePath: PropTypes.string,
    className: PropTypes.string,
    displayedFilters: PropTypes.object,
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    resource: PropTypes.string,
    onUnselectItems: PropTypes.func.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    showFilter: PropTypes.func,
};

Actions.defaultProps = {
    selectedIds: [],
};

export default onlyUpdateForKeys([
    'resource',
    'filters',
    'displayedFilters',
    'filterValues',
    'selectedIds',
])(Actions);
