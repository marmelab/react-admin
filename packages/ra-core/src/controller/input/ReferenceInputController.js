import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { crudGetOne, crudGetMatching } from '../../actions/dataActions';
import {
    getPossibleReferences,
    getPossibleReferenceValues,
    getReferenceResource,
} from '../../reducer';
import { getStatusForInput as getDataStatus } from './referenceDataStatus';
import translate from '../../i18n/translate';

const referenceSource = (resource, source) => `${resource}@${source}`;

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
export class ReferenceInputController extends Component {
    constructor(props) {
        super(props);
        const { perPage, sort, filter } = props;
        this.state = { pagination: { page: 1, perPage }, sort, filter };
        this.debouncedSetFilter = debounce(this.setFilter.bind(this), 500);
    }

    componentDidMount() {
        this.fetchReferenceAndOptions(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.record || {}).id !== (nextProps.record || {}).id) {
            this.fetchReferenceAndOptions(nextProps);
        } else if (this.props.input.value !== nextProps.input.value) {
            this.fetchReference(nextProps);
        } else if (
            !isEqual(nextProps.filter, this.props.filter) ||
            !isEqual(nextProps.sort, this.props.sort) ||
            nextProps.perPage !== this.props.perPage
        ) {
            this.fetchOptions(nextProps);
        }
    }

    setFilter = filter => {
        if (filter !== this.state.filter) {
            this.setState({ filter: this.props.filterToQuery(filter) });
            this.fetchOptions();
        }
    };

    setPagination = pagination => {
        if (pagination !== this.state.pagination) {
            this.setState({ pagination });
            this.fetchOptions();
        }
    };

    setSort = sort => {
        if (sort !== this.state.sort) {
            this.setState({ sort });
            this.fetchOptions();
        }
    };

    fetchReference = (props = this.props) => {
        const { crudGetOne, input, reference } = props;
        const id = input.value;
        if (id) {
            crudGetOne(reference, id, null, false);
        }
    };

    fetchOptions = (props = this.props) => {
        const {
            crudGetMatching,
            filter: filterFromProps,
            reference,
            referenceSource,
            resource,
            source,
        } = props;
        const { pagination, sort, filter } = this.state;

        crudGetMatching(
            reference,
            referenceSource(resource, source),
            pagination,
            sort,
            { ...filterFromProps, ...filter }
        );
    };

    fetchReferenceAndOptions(props) {
        this.fetchReference(props);
        this.fetchOptions(props);
    }

    render() {
        const {
            input,
            referenceRecord,
            matchingReferences,
            onChange,
            children,
            translate,
        } = this.props;
        const { pagination, sort, filter } = this.state;

        const dataStatus = getDataStatus({
            input,
            matchingReferences,
            referenceRecord,
            translate,
        });

        return children({
            choices: dataStatus.choices,
            error: dataStatus.error,
            isLoading: dataStatus.waiting,
            onChange,
            filter,
            setFilter: this.debouncedSetFilter,
            pagination,
            setPagination: this.setPagination,
            sort,
            setSort: this.setSort,
            warning: dataStatus.warning,
        });
    }
}

ReferenceInputController.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object,
    crudGetMatching: PropTypes.func.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    filter: PropTypes.object,
    filterToQuery: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired,
    matchingReferences: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    onChange: PropTypes.func,
    perPage: PropTypes.number,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    referenceSource: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

ReferenceInputController.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    matchingReferences: null,
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    referenceRecord: null,
    referenceSource, // used in tests
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

const EnhancedReferenceInputController = compose(
    translate,
    connect(
        makeMapStateToProps(),
        {
            crudGetOne,
            crudGetMatching,
        }
    )
)(ReferenceInputController);

EnhancedReferenceInputController.defaultProps = {
    referenceSource, // used in makeMapStateToProps
};

export default EnhancedReferenceInputController;
