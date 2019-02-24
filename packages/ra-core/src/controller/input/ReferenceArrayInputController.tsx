import { Component, ReactNode, ComponentType } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import { WrappedFieldInputProps } from 'redux-form';

import {
    crudGetMany as crudGetManyAction,
    crudGetMatching as crudGetMatchingAction,
} from '../../actions/dataActions';
import {
    getPossibleReferences,
    getPossibleReferenceValues,
    getReferenceResource,
} from '../../reducer';
import { getStatusForArrayInput as getDataStatus } from './referenceDataStatus';
import withTranslate from '../../i18n/translate';
import { Record, Sort, Translate, Pagination, Dispatch } from '../../types';
import { MatchingReferencesError } from './types';

const defaultReferenceSource = (resource: string, source: string) =>
    `${resource}@${source}`;

interface ChildrenFuncParams {
    choices: Record[];
    error?: string;
    isLoading: boolean;
    onChange: (value: any) => void;
    setFilter: (filter: any) => void;
    setPagination: (pagination: Pagination) => void;
    setSort: (sort: Sort) => void;
    warning?: string;
}

interface Props {
    allowEmpty?: boolean;
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    filter?: object;
    filterToQuery: (filter: {}) => any;
    input?: WrappedFieldInputProps;
    meta?: object;
    perPage?: number;
    record?: Record;
    reference: string;
    referenceSource: typeof defaultReferenceSource;
    resource: string;
    sort?: Sort;
    source: string;
}

interface EnhancedProps {
    crudGetMatching: Dispatch<typeof crudGetMatchingAction>;
    crudGetMany: Dispatch<typeof crudGetManyAction>;
    matchingReferences?: Record[] | MatchingReferencesError;
    onChange?: () => void;
    referenceRecords?: Record[];
    translate: Translate;
}

/**
 * An Input component for fields containing a list of references to another resource.
 * Useful for 'hasMany' relationship.
 *
 * @example
 * The post object has many tags, so the post resource looks like:
 * {
 *    id: 1234,
 *    tag_ids: [ "1", "23", "4" ]
 * }
 *
 * ReferenceArrayInput component fetches the current resources (using the
 * `CRUD_GET_MANY` REST method) as well as possible resources (using the
 * `CRUD_GET_MATCHING` REST method) in the reference endpoint. It then
 * delegates rendering to a subcomponent, to which it passes the possible
 * choices as the `choices` attribute.
 *
 * Use it with a selector component as child, like `<SelectArrayInput>`
 * or <CheckboxGroupInput>.
 *
 * @example
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceArrayInput source="tag_ids" reference="tags">
 *                 <SelectArrayInput optionText="name" />
 *             </ReferenceArrayInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      perPage={100}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      sort={{ field: 'name', order: 'ASC' }}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      filter={{ is_public: true }}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 *
 * The enclosed component may filter results. ReferenceArrayInput passes a
 * `setFilter` function as prop to its child component. It uses the value to
 * create a filter for the query - by default { q: [searchText] }. You can
 * customize the mapping searchText => searchQuery by setting a custom
 * `filterToQuery` function prop:
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      filterToQuery={searchText => ({ name: searchText })}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 */
export class UnconnectedReferenceArrayInputController extends Component<
    Props & EnhancedProps
> {
    public static defaultProps = {
        allowEmpty: false,
        filter: {},
        filterToQuery: searchText => ({ q: searchText }),
        matchingReferences: null,
        perPage: 25,
        sort: { field: 'id', order: 'DESC' },
        referenceRecords: [],
        referenceSource: defaultReferenceSource, // used in unit tests
    };

    private params;
    private debouncedSetFilter;

    constructor(props: Props & EnhancedProps) {
        super(props);
        const { perPage, sort, filter } = props;
        // stored as a property rather than state because we don't want redraw of async updates
        this.params = { pagination: { page: 1, perPage }, sort, filter };
        this.debouncedSetFilter = debounce(this.setFilter.bind(this), 500);
    }

    componentDidMount() {
        this.fetchReferencesAndOptions(this.props);
    }

    componentWillReceiveProps(nextProps: Props & EnhancedProps) {
        let shouldFetchOptions = false;

        if (
            (this.props.record || { id: undefined }).id !==
            (nextProps.record || { id: undefined }).id
        ) {
            this.fetchReferencesAndOptions(nextProps);
        } else if (this.props.input.value !== nextProps.input.value) {
            this.fetchReferences(nextProps);
        } else {
            if (!isEqual(nextProps.filter, this.props.filter)) {
                this.params = { ...this.params, filter: nextProps.filter };
                shouldFetchOptions = true;
            }
            if (!isEqual(nextProps.sort, this.props.sort)) {
                this.params = { ...this.params, sort: nextProps.sort };
                shouldFetchOptions = true;
            }
            if (nextProps.perPage !== this.props.perPage) {
                this.params = {
                    ...this.params,
                    pagination: {
                        ...this.params.pagination,
                        perPage: nextProps.perPage,
                    },
                };
                shouldFetchOptions = true;
            }
        }
        if (shouldFetchOptions) {
            this.fetchOptions();
        }
    }

    setFilter = (filter: any) => {
        if (filter !== this.params.filter) {
            this.params.filter = this.props.filterToQuery(filter);
            this.fetchOptions();
        }
    };

    setPagination = (pagination: Pagination) => {
        if (pagination !== this.params.pagination) {
            this.params.pagination = pagination;
            this.fetchOptions();
        }
    };

    setSort = (sort: Sort) => {
        if (sort !== this.params.sort) {
            this.params.sort = sort;
            this.fetchOptions();
        }
    };

    fetchReferences = (props = this.props) => {
        const { crudGetMany, input, reference } = props;
        const ids = input.value;
        if (ids) {
            if (!Array.isArray(ids)) {
                throw Error(
                    'The value of ReferenceArrayInput should be an array'
                );
            }
            crudGetMany(reference, ids);
        }
    };

    fetchOptions = (props = this.props) => {
        const {
            crudGetMatching,
            reference,
            source,
            resource,
            referenceSource,
            filter: defaultFilter,
        } = props;
        const { pagination, sort, filter } = this.params;
        crudGetMatching(
            reference,
            referenceSource(resource, source),
            pagination,
            sort,
            { ...filter, ...defaultFilter }
        );
    };

    fetchReferencesAndOptions(nextProps) {
        this.fetchReferences(nextProps);
        this.fetchOptions(nextProps);
    }

    render() {
        const {
            input,
            referenceRecords,
            matchingReferences,
            onChange,
            children,
            translate,
        } = this.props;

        const dataStatus = getDataStatus({
            input,
            matchingReferences,
            referenceRecords,
            translate,
        });

        return children({
            choices: dataStatus.choices,
            error: dataStatus.error,
            isLoading: dataStatus.waiting,
            onChange,
            setFilter: this.debouncedSetFilter,
            setPagination: this.setPagination,
            setSort: this.setSort,
            warning: dataStatus.warning,
        });
    }
}

const makeMapStateToProps = () =>
    createSelector(
        [
            getReferenceResource,
            getPossibleReferenceValues,
            (_, { input: { value: referenceIds } }) => referenceIds || [],
        ],
        (referenceState, possibleValues, inputIds) => ({
            matchingReferences: getPossibleReferences(
                referenceState,
                possibleValues,
                inputIds
            ),
            referenceRecords:
                referenceState &&
                inputIds.reduce((references, referenceId) => {
                    if (referenceState.data[referenceId]) {
                        references.push(referenceState.data[referenceId]);
                    }
                    return references;
                }, []),
        })
    );

const ReferenceArrayInputController = compose(
    withTranslate,
    connect(
        makeMapStateToProps(),
        {
            crudGetMany: crudGetManyAction,
            crudGetMatching: crudGetMatchingAction,
        }
    )
)(UnconnectedReferenceArrayInputController);

ReferenceArrayInputController.defaultProps = {
    referenceSource: defaultReferenceSource, // used in makeMapStateToProps
};

export default ReferenceArrayInputController as ComponentType<Props>;
