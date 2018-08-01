import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import shallowEqual from 'recompose/shallowEqual';
import CardActions from '@material-ui/core/CardActions';
import { sanitizeListRestProps } from 'ra-core';

import { CreateButton, ExportButton, RefreshButton } from '../button';

const Actions = ({
    bulkActions,
    currentSort,
    className,
    resource,
    filters,
    displayedFilters,
    exporter,
    filterValues,
    hasCreate,
    basePath,
    selectedIds,
    onUnselectItems,
    showFilter,
    ...rest
}) => (
    <CardActions
        className={className}
        disableActionSpacing
        {...sanitizeListRestProps(rest)}
    >
        {bulkActions &&
            cloneElement(bulkActions, {
                basePath,
                filterValues,
                resource,
                selectedIds,
                onUnselectItems,
            })}
        {filters &&
            cloneElement(filters, {
                resource,
                showFilter,
                displayedFilters,
                filterValues,
                context: 'button',
            })}
        {hasCreate && <CreateButton basePath={basePath} />}
        <ExportButton
            resource={resource}
            sort={currentSort}
            filter={filterValues}
            exporter={exporter}
        />
        <RefreshButton />
    </CardActions>
);

Actions.propTypes = {
    bulkActions: PropTypes.node,
    basePath: PropTypes.string,
    className: PropTypes.string,
    currentSort: PropTypes.object,
    displayedFilters: PropTypes.object,
    exporter: PropTypes.func,
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

export default shouldUpdate(
    (props, nextProps) =>
        props.resource !== nextProps.resource ||
        props.filters !== nextProps.filters ||
        props.displayedFilters !== nextProps.displayedFilters ||
        !shallowEqual(props.filterValues, nextProps.filterValues) ||
        props.selectedIds !== nextProps.selectedIds
)(Actions);
