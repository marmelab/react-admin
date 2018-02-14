import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';

import {
    crudGetMany as crudGetManyAction,
    crudGetMatching as crudGetMatchingAction,
} from '../../actions/dataActions';
import { getPossibleReferences } from '../../reducer/admin/references/possibleValues';
import ReferenceLoadingProgress from './ReferenceLoadingProgress';
import ReferenceError from './ReferenceError';
import translate from '../../i18n/translate';

const referenceSource = (resource, source) => `${resource}@${source}`;

export const REFERENCES_STATUS_READY = 'REFERENCES_STATUS_READY';
export const REFERENCES_STATUS_INCOMPLETE = 'REFERENCES_STATUS_INCOMPLETE';
export const REFERENCES_STATUS_EMPTY = 'REFERENCES_STATUS_EMPTY';
export const getSelectedReferencesStatus = (input, referenceRecords) =>
    !input.value || input.value.length === referenceRecords.length
        ? REFERENCES_STATUS_READY
        : referenceRecords.length > 0
          ? REFERENCES_STATUS_INCOMPLETE
          : REFERENCES_STATUS_EMPTY;

export const getDataStatus = ({
    input,
    matchingReferences,
    referenceRecords,
    translate,
}) => {
    // selectedReferencesData can be "empty" (no data was found for references from input.value)
    // or "incomplete" (Not all of the reference data was found)
    // or "ready" (all references data was found or there is no references from input.value)
    const selectedReferencesData = getSelectedReferencesStatus(
        input,
        referenceRecords
    );

    const matchingReferencesError =
        matchingReferences && matchingReferences.error
            ? translate(matchingReferences.error, {
                  _: matchingReferences.error,
              })
            : null;

    return {
        waiting:
            (!matchingReferences &&
                input.value &&
                selectedReferencesData === REFERENCES_STATUS_EMPTY) ||
            (!matchingReferences && !input.value),
        error:
            matchingReferencesError &&
            (!input.value ||
                (input.value &&
                    selectedReferencesData === REFERENCES_STATUS_EMPTY))
                ? translate('aor.input.references.all_missing', {
                      _: 'aor.input.references.all_missing',
                  })
                : null,
        warning:
            matchingReferencesError ||
            (input.value && selectedReferencesData !== REFERENCES_STATUS_READY)
                ? matchingReferencesError ||
                  translate('aor.input.references.many_missing', {
                      _: 'aor.input.references.many_missing',
                  })
                : null,
        choices: Array.isArray(matchingReferences)
            ? matchingReferences
            : referenceRecords,
    };
};

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
        this.fetchReferenceAndOptions();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReferenceAndOptions(nextProps);
        }
    }

    setFilter = filter => {
        if (filter !== this.params.filter) {
            this.params.filter = this.props.filterToQuery(filter);
            this.fetchReferenceAndOptions();
        }
    };

    setPagination = pagination => {
        if (pagination !== this.param.pagination) {
            this.param.pagination = pagination;
            this.fetchReferenceAndOptions();
        }
    };

    setSort = sort => {
        if (sort !== this.params.sort) {
            this.params.sort = sort;
            this.fetchReferenceAndOptions();
        }
    };

    fetchReferenceAndOptions(
        { input, reference, source, resource } = this.props
    ) {
        const { pagination, sort, filter } = this.params;
        const ids = input.value;
        if (ids) {
            if (!Array.isArray(ids)) {
                throw Error(
                    'The value of ReferenceArrayInput should be an array'
                );
            }
            this.props.crudGetMany(reference, ids);
        }
        this.props.crudGetMatching(
            reference,
            referenceSource(resource, source),
            pagination,
            sort,
            filter
        );
    }

    render() {
        const {
            input,
            resource,
            label,
            source,
            allowEmpty,
            matchingReferences,
            basePath,
            onChange,
            children,
            meta,
            translate,
            referenceRecords,
        } = this.props;

        if (React.Children.count(children) !== 1) {
            throw new Error(
                '<ReferenceArrayInput> only accepts a single child (like <Datagrid>)'
            );
        }

        const translatedLabel = translate(
            label || `resources.${resource}.fields.${source}`
        );

        const dataStatus = getDataStatus({
            input,
            matchingReferences,
            referenceRecords,
            translate,
        });

        if (dataStatus.waiting) {
            return <ReferenceLoadingProgress label={translatedLabel} />;
        }

        if (dataStatus.error) {
            return (
                <ReferenceError
                    label={translatedLabel}
                    error={translate('aor.input.references.all_missing', {
                        _: 'aor.input.references.all_missing',
                    })}
                />
            );
        }

        return React.cloneElement(children, {
            allowEmpty,
            input,
            label: translatedLabel,
            resource,
            meta: dataStatus.warning
                ? {
                      ...meta,
                      error: dataStatus.warning,
                      touched: true,
                  }
                : meta,
            source,
            choices: dataStatus.choices,
            basePath,
            onChange,
            setFilter: this.debouncedSetFilter,
            setPagination: this.setPagination,
            setSort: this.setSort,
            translateChoice: false,
        });
    }
}

ReferenceArrayInput.propTypes = {
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
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

ReferenceArrayInput.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    matchingReferences: null,
    perPage: 25,
    referenceRecords: [],
    sort: { field: 'id', order: 'DESC' },
};

function mapStateToProps(state, props) {
    const referenceIds = props.input.value || [];
    const data = state.admin.resources[props.reference].data;
    return {
        matchingReferences: getPossibleReferences(
            state,
            referenceSource(props.resource, props.source),
            props.reference,
            referenceIds
        ),
        referenceRecords: referenceIds.reduce((references, referenceId) => {
            if (data[referenceId]) {
                references.push(data[referenceId]);
            }
            return references;
        }, []),
    };
}

const ConnectedReferenceArrayInput = connect(mapStateToProps, {
    crudGetMany: crudGetManyAction,
    crudGetMatching: crudGetMatchingAction,
})(translate(ReferenceArrayInput));

ConnectedReferenceArrayInput.defaultProps = {
    addField: true,
};

export default ConnectedReferenceArrayInput;
