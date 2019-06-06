import {
    ReactNode,
    ComponentType,
    FunctionComponent,
    useState,
    ReactElement,
    useEffect,
    useRef,
} from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import { WrappedFieldInputProps } from 'redux-form';
import isEqual from 'lodash/isEqual';

import {
    crudGetManyAccumulate as crudGetManyAccumulateAction,
    crudGetMatchingAccumulate as crudGetMatchingAccumulateAction,
} from '../../actions/accumulateActions';
import {
    getPossibleReferences,
    getPossibleReferenceValues,
    getReferenceResource,
} from '../../reducer';
import { getStatusForInput as getDataStatus } from './referenceDataStatus';
import withTranslate from '../../i18n/translate';
import { Sort, Translate, Record, Pagination, Dispatch } from '../../types';
import { MatchingReferencesError } from './types';
import usePaginationState from '../usePaginationState';
import useSortState from '../useSortState';

const defaultReferenceSource = (resource: string, source: string) =>
    `${resource}@${source}`;

interface ChildrenFuncParams {
    choices: Record[];
    error?: string;
    filter?: any;
    isLoading: boolean;
    onChange: (value: any) => void;
    pagination: Pagination;
    setFilter: (filter: any) => void;
    setPagination: (pagination: Pagination) => void;
    setSort: (sort: Sort) => void;
    sort: Sort;
    warning?: string;
}

interface Props {
    allowEmpty?: boolean;
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    filter?: object;
    filterToQuery: (filter: {}) => any;
    input?: WrappedFieldInputProps;
    perPage: number;
    record?: Record;
    reference: string;
    referenceSource: typeof defaultReferenceSource;
    resource: string;
    sort?: Sort;
    source: string;
}

interface EnhancedProps {
    crudGetMatchingAccumulate: Dispatch<typeof crudGetMatchingAccumulateAction>;
    crudGetManyAccumulate: Dispatch<typeof crudGetManyAccumulateAction>;
    matchingReferences?: Record[] | MatchingReferencesError;
    onChange: () => void;
    referenceRecord?: Record;
    translate: Translate;
}

const usePrevious = value => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};

const useFilterState = ({
    filterToQuery = v => v,
    initialFilter,
    debounceTime = 500,
}) => {
    const previousInitialFilter = usePrevious(initialFilter);
    const [filter, setFilterValue] = useState(filterToQuery(initialFilter));

    const setFilter = debounce(
        value => setFilterValue(filterToQuery(value)),
        debounceTime
    );
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (isEqual(initialFilter, previousInitialFilter)) {
            return;
        }
        setFilter(initialFilter);
    }, [initialFilter]);

    return {
        filter,
        setFilter,
    };
};

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
export const UnconnectedReferenceInputController: FunctionComponent<
    Props & EnhancedProps
> = ({
    input,
    referenceRecord,
    matchingReferences,
    onChange,
    children,
    translate,
    perPage,
    filter: initialFilter,
    crudGetManyAccumulate,
    reference,
    crudGetMatchingAccumulate,
    filterToQuery,
    referenceSource,
    resource,
    source,
}) => {
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
            fetchReference({
                crudGetManyAccumulate,
                id: input.value,
                reference,
            }),
        [input.value, reference]
    );

    useEffect(
        () =>
            fetchOptions({
                crudGetMatchingAccumulate,
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
        filter,
        setFilter,
        pagination,
        setPagination,
        sort,
        setSort,
        warning: dataStatus.warning,
    }) as ReactElement;
};

const fetchReference = ({ crudGetManyAccumulate, id, reference }) => {
    if (id) {
        crudGetManyAccumulate(reference, [id]);
    }
};

const fetchOptions = ({
    crudGetMatchingAccumulate,
    filter,
    reference,
    referenceSource,
    resource,
    source,
    pagination,
    sort,
}) => {
    crudGetMatchingAccumulate(
        reference,
        referenceSource(resource, source),
        pagination,
        sort,
        filter
    );
};

const makeMapStateToProps = () =>
    createSelector(
        [
            getReferenceResource,
            getPossibleReferenceValues,
            (_, props) => props.input.value,
        ],
        (referenceState, possibleValues, inputId) => ({
            matchingReferences: getPossibleReferences(
                referenceState,
                possibleValues,
                [inputId]
            ),
            referenceRecord: referenceState && referenceState.data[inputId],
        })
    );

const ReferenceInputController = compose(
    withTranslate,
    connect(
        makeMapStateToProps(),
        {
            crudGetManyAccumulate: crudGetManyAccumulateAction,
            crudGetMatchingAccumulate: crudGetMatchingAccumulateAction,
        }
    )
)(UnconnectedReferenceInputController);

ReferenceInputController.defaultProps = {
    referenceSource: defaultReferenceSource, // used in makeMapStateToProps
};

export default ReferenceInputController as ComponentType<Props>;
