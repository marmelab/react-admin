import { ReactElement, FunctionComponent } from 'react';

import {
    SORT_ASC,
    SORT_DESC,
} from '../../reducer/admin/resource/list/queryReducer';
import { Record, Sort, RecordMap, Identifier, Dispatch } from '../../types';
import useReferenceMany from './useReferenceMany';

interface ChildrenFuncParams {
    currentSort: Sort;
    data: RecordMap;
    ids: Identifier[];
    loadedOnce: boolean;
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

const sortReducer = (state: Sort, field: string | Sort): Sort => {
    if (typeof field !== 'string') {
        return field;
    }
    const order =
        state.field === field && state.order === SORT_ASC
            ? SORT_DESC
            : SORT_ASC;
    return { field, order };
};

/**
 * Render related records to the current one.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 *
 * @example Display all the books by the current author, only the title
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceManyField perPage={10} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceManyField sort={{ field: 'created_at', order: 'DESC' }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceManyField filter={{ is_published: true }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 */
export const ReferenceManyFieldController: FunctionComponent<Props> = ({
    resource,
    reference,
    record,
    target,
    filter,
    source,
    basePath,
    perPage,
    sort,
    children,
}) => {
    const {
        currentSort,
        data,
        ids,
        loadedOnce,
        page,
        currentPerPage,
        referenceBasePath,
        setPage,
        setPerPage,
        setSort,
        total,
    } = useReferenceMany({
        resource,
        reference,
        record,
        target,
        filter,
        source,
        basePath,
        perPage,
        sort,
    });

    return children({
        currentSort,
        data,
        ids,
        loadedOnce,
        page,
        perPage: currentPerPage,
        referenceBasePath,
        setPage,
        setPerPage,
        setSort,
        total,
    });
};

export default ReferenceManyFieldController;
