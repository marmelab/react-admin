import * as React from 'react';
import { cloneElement, useMemo, useContext, ReactElement } from 'react';
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
 *     import { cloneElement } from 'react';
 *     import Button from '@mui/material/Button';
 *     import { TopToolbar, List, CreateButton, ExportButton } from 'react-admin';
 *
 *     const PostListActions = ({ filters }) => (
 *         <TopToolbar>
 *             { cloneElement(filters, { context: 'button' }) }
 *             <CreateButton/>
 *             <ExportButton/>
 *             // Add your custom actions here //
 *             <Button onClick={customAction}>Custom Action</Button>
 *         </TopToolbar>
 *     );
 *
 *     export const PostList = (props) => (
 *         <List actions={<PostListActions />} {...props}>
 *             ...
 *         </List>
 *     );
 */
export const ListActions = (props: ListActionsProps) => {
    const {
        className,
        filters: filtersProp,
        hasCreate: _,
        selectedIds = defaultSelectedIds,
        onUnselectItems = defaultOnUnselectItems,
        ...rest
    } = props;

    const {
        sort,
        displayedFilters,
        filterValues,
        exporter,
        showFilter,
        total,
    } = useListContext({ ...props, selectedIds, onUnselectItems });
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
                    <ExportButton
                        disabled={total === 0}
                        resource={resource}
                        sort={sort}
                        filterValues={filterValues}
                    />
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
            sort,
            exporter,
            hasCreate,
        ]
    );
};

ListActions.propTypes = {
    className: PropTypes.string,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC'] as const),
    }),
    displayedFilters: PropTypes.object,
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    resource: PropTypes.string,
    onUnselectItems: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    showFilter: PropTypes.func,
    total: PropTypes.number,
};

export interface ListActionsProps extends ToolbarProps {
    sort?: SortPayload;
    className?: string;
    resource?: string;
    filters?: ReactElement<any>;
    displayedFilters?: any;
    exporter?: Exporter | boolean;
    filterValues?: any;
    permanentFilter?: any;
    hasCreate?: boolean;
    selectedIds?: Identifier[];
    onUnselectItems?: () => void;
    showFilter?: (filterName: string, defaultValue: any) => void;
    total?: number;
}

const defaultSelectedIds = [];
const defaultOnUnselectItems = () => null;
