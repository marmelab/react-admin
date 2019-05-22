import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { sanitizeListRestProps, ComponentPropType } from 'ra-core';

import TopToolbar from '../layout/TopToolbar';
import { CreateButton, ExportButton } from '../button';

const ListActions = ({
    bulkActions: BulkActions,
    currentSort,
    className,
    resource,
    filters: Filters,
    displayedFilters,
    exporter,
    filterValues,
    permanentFilter,
    hasCreate,
    basePath,
    selectedIds,
    onUnselectItems,
    showFilter,
    total,
    ...rest
}) => (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
        {BulkActions &&
            <BulkActions
                basePath={basePath}
                filterValues={filterValues}
                resource={resource}
                selectedIds={selectedIds}
                onUnselectItems={onUnselectItems}
            />
        }
        {Filters &&
            <Filters
                resource={resource}
                showFilter={showFilter}
                displayedFilters={displayedFilters}
                filterValues={filterValues}
                context="button"
            />
        }
        {hasCreate && <CreateButton basePath={basePath} />}
        {exporter !== false && (
            <ExportButton
                disabled={total === 0}
                resource={resource}
                sort={currentSort}
                filter={{ ...filterValues, ...permanentFilter }}
                exporter={exporter}
            />
        )}
    </TopToolbar>
);

ListActions.propTypes = {
    bulkActions: PropTypes.oneOfType([ComponentPropType, PropTypes.bool]),
    basePath: PropTypes.string,
    className: PropTypes.string,
    currentSort: PropTypes.object,
    displayedFilters: PropTypes.object,
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filters: ComponentPropType,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    resource: PropTypes.string,
    onUnselectItems: PropTypes.func.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    showFilter: PropTypes.func,
    total: PropTypes.number.isRequired,
};

ListActions.defaultProps = {
    selectedIds: [],
    onUnselectItems: () => null,
};

export default onlyUpdateForKeys([
    'resource',
    'filters',
    'displayedFilters',
    'filterValues',
    'selectedIds',
])(ListActions);
