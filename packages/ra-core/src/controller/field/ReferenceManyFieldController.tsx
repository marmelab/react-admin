import { ReactElement, FunctionComponent } from 'react';

import { Record, Sort, RecordMap, Identifier } from '../../types';
import useReferenceManyFieldController from './useReferenceManyFieldController';
import useSortState from '../useSortState';
import usePaginationState from '../usePaginationState';

interface ChildrenFuncParams {
    currentSort: Sort;
    data: RecordMap;
    ids: Identifier[];
    loaded: boolean;
    page: number;
    perPage: number;
    referenceBasePath: string;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setSort: (field: string) => void;
    total: number;
}

interface Props {
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactElement<ChildrenFuncParams>;
    filter?: any;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: Sort;
    source: string;
    target: string;
    total?: number;
}

const defaultPerPage = 25;

/**
 * Render prop version of the useReferenceManyFieldController hook.
 *
 * @see useReferenceManyFieldController
 */
export const ReferenceManyFieldController: FunctionComponent<Props> = ({
    resource,
    reference,
    record,
    target,
    filter,
    source,
    basePath,
    perPage: initialPerPage,
    sort: initialSort,
    children,
}) => {
    const { sort, setSortField } = useSortState(initialSort);
    const { page, perPage, setPage, setPerPage } = usePaginationState({
        perPage: initialPerPage || defaultPerPage,
    });
    const {
        data,
        ids,
        loaded,
        referenceBasePath,
        total,
    } = useReferenceManyFieldController({
        resource,
        reference,
        record,
        target,
        filter,
        source,
        basePath,
        perPage,
        page,
        sort,
    });

    return children({
        currentSort: sort,
        data,
        ids,
        loaded,
        page,
        perPage,
        referenceBasePath,
        setPage,
        setPerPage,
        setSort: setSortField,
        total,
    });
};

export default ReferenceManyFieldController;
