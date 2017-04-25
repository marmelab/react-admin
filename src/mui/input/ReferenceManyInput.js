import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import Labeled from '../input/Labeled';
import {
    crudGetMany as crudGetManyAction,
    crudGetMatching as crudGetMatchingAction
} from '../../actions/dataActions';
import { getPossibleReferences } from '../../reducer/references/possibleValues';

const referenceSource = (resource, source) => `${resource}@${source}`;

/**
 * An Input component for choosing many reference records.
 * Useful for 'hasMany' relationship.
 *
 * @example
 * The author object has many post, so, the object will like that:
 * {
 *    post_ids: [ "1", "23", "4" ]
 * }
 *
 * This component fetches the possible values in the reference resource
 * (using the `CRUD_GET_MATCHING` REST method), then delegates rendering
 * to a subcomponent, to which it passes the possible choices
 * as the `choices` attribute.
 *
 * Use it with a selector component as child, like `<SelectManyInput>`.
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceManyInput label="Post" source="post_ids" reference="posts">
 *                 <SelectManyInput optionText="title" />
 *             </ReferenceManyInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceManyInput
 *      source="post_ids"
 *      reference="posts"
 *      perPage={100}>
 *     <SelectManyInput optionText="title" />
 * </ReferenceManyInput>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceManyInput
 *      source="post_ids"
 *      reference="posts"
 *      sort={{ field: 'title', order: 'ASC' }}>
 *     <SelectManyInput optionText="title" />
 * </ReferenceManyInput>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceManyInput
 *      source="post_ids"
 *      reference="posts"
 *      filter={{ is_published: true }}>
 *     <SelectManyInput optionText="title" />
 * </ReferenceManyInput>
 *
 * The enclosed component may filter results. ReferenceManyInput passes a `setFilter`
 * function as prop to its child component. It uses the value to create a filter
 * for the query - by default { q: [searchText] }. You can customize the mapping
 * searchText => searchQuery by setting a custom `filterToQuery` function prop:
 *
 * @example
 * <ReferenceManyInput
 *      source="post_ids"
 *      reference="posts"
 *      filterToQuery={searchText => ({ title: searchText })}>
 *     <SelectManyInput optionText="title" />
 * </ReferenceManyInput>
 */
export class ReferenceManyInput extends Component {
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

    fetchReferenceAndOptions({ input, reference, source, resource } = this.props) {
        const { pagination, sort, filter } = this.params;
        const ids = input.value;
        if (ids) {
            if (!Array.isArray(ids)) {
                throw Error("Value of ReferenceManyInput should be an array");
            }
            this.props.crudGetMany(reference, ids);
        }
        this.props.crudGetMatching(reference, referenceSource(resource, source), pagination, sort, filter);
    }

    render() {
        const { input, resource, label, source, referenceRecords, allowEmpty, matchingReferences, basePath, onChange, children, meta } = this.props;

        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceManyInput> only accepts a single child (like <Datagrid>)');
        }

        if (!(referenceRecords && referenceRecords.length > 0) && !allowEmpty) {
            return <Labeled
                label={typeof label === 'undefined' ? `resources.${resource}.fields.${source}` : label}
                source={source}
                resource={resource}
            />;
        }

        return React.cloneElement(children, {
            allowEmpty,
            input,
            label: typeof label === 'undefined' ? `resources.${resource}.fields.${source}` : label,
            resource,
            meta,
            source,
            choices: matchingReferences,
            basePath,
            onChange,
            setFilter: this.debouncedSetFilter,
            setPagination: this.setPagination,
            setSort: this.setSort,
        });
    }
}

ReferenceManyInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    crudGetMatching: PropTypes.func.isRequired,
    crudGetMany: PropTypes.func.isRequired,
    filter: PropTypes.object,
    filterToQuery: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    matchingReferences: PropTypes.array,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    perPage: PropTypes.number,
    reference: PropTypes.string.isRequired,
    referenceRecords: PropTypes.array,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf([ 'ASC', 'DESC' ]),
    }),
    source: PropTypes.string,
};

ReferenceManyInput.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    matchingReferences: [],
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    referenceRecords: [],
};

function mapStateToProps(state, props) {
    const referenceIds = props.input.value;
    const referenceRecords = [];
    let matchingReferences = [];
    const data = state.admin[ props.reference ].data;

    if (!referenceIds.length) {
        matchingReferences = getPossibleReferences(state, referenceSource(props.resource, props.source), props.reference);
    } else {
        for (let i = 0; i < referenceIds.length; i++) {
            if (data[ referenceIds[ i ] ]) {
                referenceRecords.push(data[ referenceIds[ i ] ]);
                const possibleReferences = getPossibleReferences(state, referenceSource(props.resource, props.source), props.reference, referenceIds[ i ]);
                matchingReferences = Object.assign(matchingReferences, possibleReferences);
            }
        }
    }

    return {
        referenceRecords: referenceRecords,
        matchingReferences: matchingReferences,
    }
}

const ConnectedReferenceInput = connect(mapStateToProps, {
    crudGetMany: crudGetManyAction,
    crudGetMatching: crudGetMatchingAction,
})(ReferenceManyInput);

ConnectedReferenceInput.defaultProps = {
    addField: true,
};

export default ConnectedReferenceInput;
