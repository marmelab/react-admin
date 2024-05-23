import * as React from 'react';
import { cloneElement, useMemo, useContext, ReactElement } from 'react';
import {
    sanitizeListRestProps,
    Exporter,
    useListContext,
    useResourceContext,
    useResourceDefinition,
} from 'ra-core';
import { ToolbarProps } from '@mui/material';

import TopToolbar from '../layout/TopToolbar';
import { CreateButton, ExportButton } from '../button';
import { FilterContext } from './FilterContext';
import { FilterButton } from './filter';

/**
 * Action Toolbar for the List view
 *
 * Internal component. If you want to add or remove actions for a List view,
 * write your own ListActions Component. Then, in the <List> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 * import { cloneElement } from 'react';
 * import Button from '@mui/material/Button';
 * import { TopToolbar, List, CreateButton, ExportButton } from 'react-admin';
 *
 * const PostListActions = ({ filters }) => (
 *     <TopToolbar>
 *         { cloneElement(filters, { context: 'button' }) }
 *         <CreateButton/>
 *         <ExportButton/>
 *         // Add your custom actions here //
 *         <Button onClick={customAction}>Custom Action</Button>
 *     </TopToolbar>
 * );
 *
 * export const PostList = () => (
 *     <List actions={<PostListActions />}>
 *         ...
 *     </List>
 * );
 */
export const ListActions = (props: ListActionsProps) => {
    const { className, filters: filtersProp, hasCreate: _, ...rest } = props;

    const { displayedFilters, filterValues, exporter, showFilter, total } =
        useListContext();
    const resource = useResourceContext(props);
    const { hasCreate } = useResourceDefinition(props);
    const filters = useContext(FilterContext) || filtersProp;
    return useMemo(
        () => (
            <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
                {filtersProp
                    ? cloneElement(filtersProp, {
                          resource,
                          showFilter,
                          displayedFilters,
                          filterValues,
                          context: 'button',
                      })
                    : filters && <FilterButton />}
                {hasCreate && <CreateButton />}
                {exporter !== false && (
                    <ExportButton disabled={total === 0} resource={resource} />
                )}
            </TopToolbar>
        ),
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            resource,
            displayedFilters,
            filterValues,
            filtersProp,
            showFilter,
            filters,
            total,
            className,
            exporter,
            hasCreate,
        ]
    );
};

export interface ListActionsProps extends ToolbarProps {
    className?: string;
    resource?: string;
    filters?: ReactElement<any>;
    displayedFilters?: any;
    exporter?: Exporter | boolean;
    filterValues?: any;
    permanentFilter?: any;
    hasCreate?: boolean;
    showFilter?: (filterName: string, defaultValue: any) => void;
    total?: number;
}
