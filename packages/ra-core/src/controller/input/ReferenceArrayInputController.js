import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';

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
import translate from '../../i18n/translate';

const referenceSource = (resource, source) => `${resource}@${source}`;

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
export class ReferenceArrayInputController extends Component {
    constructor(props) {
        super(props);
        const { perPage, sort, filter } = props;
        // stored as a property rather than state because we don't want redraw of async updates
        this.params = { pagination: { page: 1, perPage }, sort, filter };
        this.debouncedSetFilter = debounce(this.setFilter.bind(this), 500);
    }

    componentDidMount() {
        this.fetchReferencesAndOptions();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReferencesAndOptions(nextProps);
        } else if (this.props.input.value !== nextProps.input.value) {
            this.fetchReferences(nextProps);
        }
    }

    setFilter = filter => {
        if (filter !== this.params.filter) {
            this.params.filter = this.props.filterToQuery(filter);
            this.fetchOptions();
        }
    };

    setPagination = pagination => {
        if (pagination !== this.params.pagination) {
            this.params.pagination = pagination;
            this.fetchOptions();
        }
    };

    setSort = sort => {
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
        } = props;
        const { pagination, sort, filter } = this.params;
        crudGetMatching(
            reference,
            referenceSource(resource, source),
            pagination,
            sort,
            filter
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

ReferenceArrayInputController.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    crudGetMatching: PropTypes.func.isRequired,
    crudGetMany: PropTypes.func.isRequired,
    filter: PropTypes.object,
    filterToQuery: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    matchingReferences: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    meta: PropTypes.object,
    onChange: PropTypes.func,
    perPage: PropTypes.number,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecords: PropTypes.array,
    referenceSource: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

ReferenceArrayInputController.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    matchingReferences: null,
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    referenceRecords: [],
    referenceSource, // used in unit tests
};

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

const EnhancedReferenceArrayInputController = compose(
    translate,
    connect(makeMapStateToProps(), {
        crudGetMany: crudGetManyAction,
        crudGetMatching: crudGetMatchingAction,
    })
)(ReferenceArrayInputController);

EnhancedReferenceArrayInputController.defaultProps = {
    referenceSource, // used in makeMapStateToProps
};

export default EnhancedReferenceArrayInputController;
