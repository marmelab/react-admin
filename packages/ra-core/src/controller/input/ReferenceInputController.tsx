import {
    ReactNode,
    ComponentType,
    FunctionComponent,
    ReactElement,
    useEffect,
} from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { WrappedFieldInputProps } from 'redux-form';

import { crudGetMatchingAccumulate } from '../../actions/accumulateActions';
import {
    getPossibleReferences,
    getPossibleReferenceValues,
    getReferenceResource,
} from '../../reducer';
import { getStatusForInput as getDataStatus } from './referenceDataStatus';
import useTranslate from '../../i18n/useTranslate';
import { Sort, Record, Pagination } from '../../types';
import usePaginationState from '../usePaginationState';
import useSortState from '../useSortState';
import useFilterState, { Filter } from '../useFilterState';
import useReference from '../useReference';

const defaultReferenceSource = (resource: string, source: string) =>
    `${resource}@${source}`;

interface ChildrenFuncParams {
    choices: Record[];
    error?: string;
    filter?: any;
    isLoading: boolean;
    onChange: (value: any) => void;
    pagination: Pagination;
    setFilter: (filter: string) => void;
    setPagination: (pagination: Pagination) => void;
    setSort: (sort: Sort) => void;
    sort: Sort;
    warning?: string;
}

interface Props {
    allowEmpty?: boolean;
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    filter?: Filter;
    filterToQuery: (filter: string) => any;
    input?: WrappedFieldInputProps;
    perPage: number;
    record?: Record;
    reference: string;
    referenceSource: typeof defaultReferenceSource;
    resource: string;
    sort?: Sort;
    source: string;
    onChange: () => void;
}

/**
 * An Input component for choosing a reference record. Useful for foreign keys.
 *
 * This component fetches the possible values in the reference resource
 * (using the `CRUD_GET_MATCHING` REST method), then delegates rendering
 * to a subcomponent, to which it passes the possible choices
 * as the `choices` attribute.
 *
 * Use it with a selector component as child, like `<AutocompleteInput>`,
 * `<SelectInput>`, or `<RadioButtonGroupInput>`.
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceInput label="Post" source="post_id" reference="posts">
 *                 <AutocompleteInput optionText="title" />
 *             </ReferenceInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceInput label="Post" source="post_id" reference="posts">
 *                 <SelectInput optionText="title" />
 *             </ReferenceInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      perPage={100}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      sort={{ field: 'title', order: 'ASC' }}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      filter={{ is_published: true }}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 *
 * The enclosed component may filter results. ReferenceInput passes a `setFilter`
 * function as prop to its child component. It uses the value to create a filter
 * for the query - by default { q: [searchText] }. You can customize the mapping
 * searchText => searchQuery by setting a custom `filterToQuery` function prop:
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      filterToQuery={searchText => ({ title: searchText })}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 */
export const ReferenceInputController: FunctionComponent<Props> = ({
    input,
    onChange,
    children,
    perPage,
    filter: initialFilter,
    reference,
    filterToQuery,
    referenceSource = defaultReferenceSource,
    resource,
    source,
}) => {
    const translate = useTranslate();
    const dispatch = useDispatch();
    const matchingReferences = useSelector(
        getMatchingReferences({
            referenceSource,
            input,
            reference,
            resource,
            source,
        }),
        [input.value, referenceSource, reference, source, resource]
    );

    const { referenceRecord } = useReference({
        id: input.value,
        reference,
        allowEmpty: true,
    });

    const dataStatus = getDataStatus({
        input,
        matchingReferences,
        referenceRecord,
        translate,
    });

    const { pagination, setPagination } = usePaginationState(perPage);
    const { sort, setSort } = useSortState();
    const { filter, setFilter } = useFilterState({
        initialFilter,
        filterToQuery,
    });

    useEffect(
        () =>
            fetchOptions({
                dispatch,
                filter,
                reference,
                referenceSource,
                resource,
                source,
                pagination,
                sort,
            }),
        [
            filter,
            reference,
            referenceSource,
            resource,
            source,
            pagination.page,
            pagination.perPage,
            sort.field,
            sort.order,
        ]
    );

    return children({
        choices: dataStatus.choices,
        error: dataStatus.error,
        isLoading: dataStatus.waiting,
        onChange,
        setFilter,
        filter,
        pagination,
        setPagination,
        sort,
        setSort,
        warning: dataStatus.warning,
    }) as ReactElement;
};

const fetchOptions = ({
    dispatch,
    filter,
    reference,
    referenceSource,
    resource,
    source,
    pagination,
    sort,
}) => {
    dispatch(
        crudGetMatchingAccumulate(
            reference,
            referenceSource(resource, source),
            pagination,
            sort,
            filter
        )
    );
};

const matchingReferencesSelector = createSelector(
    [
        getReferenceResource,
        getPossibleReferenceValues,
        (_, props) => props.input.value,
    ],
    (referenceState, possibleValues, inputId) =>
        getPossibleReferences(referenceState, possibleValues, [inputId])
);

const getMatchingReferences = props => state =>
    matchingReferencesSelector(state, props);

export default ReferenceInputController as ComponentType<Props>;
