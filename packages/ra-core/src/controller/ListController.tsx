import { ReactNode } from 'react';

import useListController, { Props } from './useListController';
import { useTranslate } from '../i18n';
import { Sort, RecordMap, Identifier, Translate } from '../types';

interface ChildrenFuncParams {
    basePath: string;
    currentSort: Sort;
    data: RecordMap;
    defaultTitle: string;
    displayedFilters: any;
    filterValues: any;
    hasCreate: boolean;
    hideFilter: (filterName: string) => void;
    ids: Identifier[];
    isLoading: boolean;
    loadedOnce: boolean;
    onSelect: (ids: Identifier[]) => void;
    onToggleItem: (id: Identifier) => void;
    onUnselectItems: () => void;
    page: number;
    perPage: number;
    resource: string;
    selectedIds: Identifier[];
    setFilters: (filters: any) => void;
    setPage: (page: number) => void;
    setPerPage: (page: number) => void;
    setSort: (sort: Sort) => void;
    showFilter: (filterName: string, defaultValue: any) => void;
    translate: Translate;
    total: number;
    version: number;
}

interface ListControllerProps extends Props {
    children: (params: ChildrenFuncParams) => ReactNode;
}

/**
 * Render prop version of the useListController hook.
 *
 * @see useListController
 * @example
 *
 * const ListView = () => <div>...</div>;
 * const List = props => (
 *     <ListController {...props}>
 *        {controllerProps => <ListView {...controllerProps} {...props} />}
 *     </ListController>
 * )
 */
const ListController = ({ children, ...props }: ListControllerProps) => {
    const controllerProps = useListController(props);
    const translate = useTranslate();
    return children({ translate, ...controllerProps });
};

export default ListController;
