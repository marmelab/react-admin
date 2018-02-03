import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';

import addField from '../form/addField';
import Labeled from '../input/Labeled';
import {
    crudGetMany as crudGetManyAction,
    crudGetMatching as crudGetMatchingAction,
} from '../../actions/dataActions';
import {
    getPossibleReferences,
    getPossibleReferenceValues,
    getResource,
} from '../../reducer/admin';

const referenceSource = (resource, source) => `${resource}@${source}`;

const sanitizeRestProps = ({
    alwaysOn,
    basePath,
    component,
    defaultValue,
    formClassName,
    initializeForm,
    input,
    isRequired,
    label,
    locale,
    meta,
    optionText,
    optionValue,
    record,
    resource,
    allowEmpty,
    source,
    textAlign,
    translate,
    translateChoice,
    ...rest
}) => rest;

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
export class ReferenceArrayInput extends Component {
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
        if (pagination !== this.param.pagination) {
            this.param.pagination = pagination;
            this.fetchOptions();
        }
    };

    setSort = sort => {
        if (sort !== this.params.sort) {
            this.params.sort = sort;
            this.fetchOptions();
        }
    };

    fetchReferences = ({ input, reference } = this.props) => {
        const ids = input.value;
        if (ids) {
            if (!Array.isArray(ids)) {
                throw Error(
                    'The value of ReferenceArrayInput should be an array'
                );
            }
            this.props.crudGetMany(reference, ids);
        }
    };

    fetchOptions = ({ reference, source, resource } = this.props) => {
        const { pagination, sort, filter } = this.params;
        this.props.crudGetMatching(
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
            className,
            input,
            resource,
            label,
            source,
            referenceRecords,
            allowEmpty,
            matchingReferences,
            basePath,
            onChange,
            children,
            meta,
            record,
            options,
            ...rest
        } = this.props;

        if (React.Children.count(children) !== 1) {
            throw new Error(
                '<ReferenceArrayInput> only accepts a single child (like <Datagrid>)'
            );
        }

        if (!(referenceRecords && referenceRecords.length > 0) && !allowEmpty) {
            return (
                <Labeled
                    label={
                        typeof label === 'undefined'
                            ? `resources.${resource}.fields.${source}`
                            : label
                    }
                    source={source}
                    resource={resource}
                    className={className}
                    {...sanitizeRestProps(rest)}
                />
            );
        }

        return React.cloneElement(children, {
            className,
            allowEmpty,
            input,
            label:
                typeof label === 'undefined'
                    ? `resources.${resource}.fields.${source}`
                    : label,
            resource,
            meta,
            source,
            choices: matchingReferences,
            basePath,
            onChange,
            setFilter: this.debouncedSetFilter,
            setPagination: this.setPagination,
            setSort: this.setSort,
            translateChoice: false,
            options,
            ...sanitizeRestProps(rest),
        });
    }
}

ReferenceArrayInput.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
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
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
};

ReferenceArrayInput.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    matchingReferences: [],
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    referenceRecords: [],
    record: {},
};
const mapStateToProps = createSelector(
    (_, { input: { value: referenceIds } }) => referenceIds || [],
    (state, { reference }) => getResource(state, reference),
    (state, { resource, source }) =>
        getPossibleReferenceValues(state, referenceSource(resource, source)),
    (inputIds, referenceState, possibleValues) => ({
        referenceRecords:
            referenceState &&
            inputIds.reduce((references, referenceId) => {
                if (referenceState.data[referenceId]) {
                    references.push(referenceState.data[referenceId]);
                }
                return references;
            }, []),
        matchingReferences: getPossibleReferences(
            referenceState,
            possibleValues,
            inputIds
        ),
    })
);

export default compose(
    addField,
    connect(mapStateToProps, {
        crudGetMany: crudGetManyAction,
        crudGetMatching: crudGetMatchingAction,
    })
)(ReferenceArrayInput);
