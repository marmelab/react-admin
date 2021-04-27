import * as React from 'react';
import { cloneElement, useMemo, FC, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
    sanitizeListRestProps,
    Identifier,
    SortPayload,
    Exporter,
    useListContext,
    useResourceContext,
    useResourceDefinition,
} from 'ra-core';
import { ToolbarProps } from '@material-ui/core';

import TopToolbar from '../layout/TopToolbar';
import { CreateButton, ExportButton } from '../button';

const ListActions: FC<ListActionsProps> = props => {
    const { className, exporter, filters, children, ...rest } = props;
    const {
        currentSort,
        displayedFilters,
        filterValues,
        basePath,
        selectedIds,
        showFilter,
        total,
    } = useListContext(props);
    const resource = useResourceContext(rest);
    const { hasCreate } = useResourceDefinition(rest);
    return useMemo(
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
                        filterValues={filterValues}
                    />
                )}
                {children}
            </TopToolbar>
        ),
        [resource, displayedFilters, filterValues, selectedIds, filters, total] // eslint-disable-line react-hooks/exhaustive-deps
    );
};

ListActions.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    currentSort: PropTypes.any,
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

export interface ListActionsProps extends ToolbarProps {
    children?: ReactNode;
    currentSort?: SortPayload;
    className?: string;
    resource?: string;
    filters?: ReactElement<any>;
    displayedFilters?: any;
    exporter?: Exporter | boolean;
    filterValues?: any;
    permanentFilter?: any;
    hasCreate?: boolean;
    basePath?: string;
    selectedIds?: Identifier[];
    onUnselectItems?: () => void;
    showFilter?: (filterName: string, defaultValue: any) => void;
    total?: number;
}

export default ListActions;
