import React, { cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import { sanitizeListRestProps } from 'ra-core';

import TopToolbar from '../layout/TopToolbar';
import { CreateButton, ExportButton } from '../button';

const ListActions = ({
    currentSort,
    className,
    resource,
    filters,
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
}) =>
    useMemo(
        () => (
            <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
                {filters &&
                    cloneElement(filters, {
                        resource,
                        showFilter,
                        displayedFilters,
                        filterValues,
                        context: 'button',
                    })}
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
        ),
        [resource, displayedFilters, filterValues, selectedIds, filters, total] // eslint-disable-line react-hooks/exhaustive-deps
    );

ListActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    currentSort: PropTypes.object,
    displayedFilters: PropTypes.object,
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    resource: PropTypes.string,
    onUnselectItems: PropTypes.func.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    showFilter: PropTypes.func,
    total: PropTypes.number,
};

ListActions.defaultProps = {
    selectedIds: [],
    onUnselectItems: () => null,
};

export default ListActions;
