import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import Labeled from './Labeled';
import { crudGetOne as crudGetOneAction, crudGetMatching as crudGetMatchingAction } from '../../actions/dataActions';
import { getPossibleReferences } from '../../reducer/references/possibleValues';

const referenceSource = (resource, source) => `${resource}@${source}`;
const noFilter = () => true;

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
 *         <ReferenceInput label="Post" source="post_id" reference="posts">
 *             <AutocompleteInput optionText="title" />
 *         </ReferenceInput>
 *     </Edit>
 * );
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <ReferenceInput label="Post" source="post_id" reference="posts">
 *             <SelectInput optionText="title" />
 *         </ReferenceInput>
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
export class ReferenceInput extends Component {
    constructor(props) {
        super(props);
        const { perPage, sort, filter } = props;
        // stored as a property rather than state because we don't want redraw of async updates
        this.params = { pagination: { page: 1, perPage }, sort, filter };
        this.debouncedSetFilter = debounce(this.setFilter.bind(this), 500);
    }

    componentDidMount() {
        this.fetchReferenceAndOptions();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReferenceAndOptions(nextProps);
        }
    }

    setFilter = (filter) => {
        if (filter !== this.params.filter) {
            this.params.filter = this.props.filterToQuery(filter);
            this.fetchReferenceAndOptions();
        }
    }

    setPagination = (pagination) => {
        if (pagination !== this.param.pagination) {
            this.param.pagination = pagination;
            this.fetchReferenceAndOptions();
        }
    }

    setSort = (sort) => {
        if (sort !== this.params.sort) {
            this.params.sort = sort;
            this.fetchReferenceAndOptions();
        }
    }

    fetchReferenceAndOptions({ reference, record, source, resource } = this.props) {
        const { pagination, sort, filter } = this.params;
        const id = record[source];
        if (id) {
            this.props.crudGetOne(reference, id, null, false);
        }
        this.props.crudGetMatching(reference, referenceSource(resource, source), pagination, sort, filter);
    }

    render() {
        const { input, resource, label, source, record, referenceRecord, allowEmpty, matchingReferences, basePath, onChange, children } = this.props;
        if (!referenceRecord && !allowEmpty) {
            return <Labeled label={label} source={source} />;
        }

        return React.cloneElement(children, {
            allowEmpty,
            input,
            label,
            resource,
            source,
            record,
            choices: matchingReferences,
            basePath,
            onChange,
            filter: noFilter, // for AutocompleteInput
            setFilter: this.debouncedSetFilter,
            setPagination: this.setPagination,
            setSort: this.setSort,
        });
    }
}

ReferenceInput.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    crudGetMatching: PropTypes.func.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    filter: PropTypes.object,
    filterToQuery: PropTypes.func.isRequired,
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    matchingReferences: PropTypes.array,
    onChange: PropTypes.func,
    perPage: PropTypes.number,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string.isRequired,
};

ReferenceInput.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    matchingReferences: [],
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    record: {},
    referenceRecord: null,
};

function mapStateToProps(state, props) {
    const referenceId = props.record[props.source];
    return {
        referenceRecord: state.admin[props.reference].data[referenceId],
        matchingReferences: getPossibleReferences(state, referenceSource(props.resource, props.source), props.reference, referenceId),
    };
}

const ConnectedReferenceInput = connect(mapStateToProps, {
    crudGetOne: crudGetOneAction,
    crudGetMatching: crudGetMatchingAction,
})(ReferenceInput);

ConnectedReferenceInput.defaultProps = {
    includesLabel: true,
};

export default ConnectedReferenceInput;
