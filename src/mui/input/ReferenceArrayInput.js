import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import Dialog from 'material-ui/Dialog';
import Labeled from '../input/Labeled';
import {
    crudGetMany as crudGetManyAction,
    crudGetMatching as crudGetMatchingAction,
    crudCreateInline as crudCreateInlineAction,
} from '../../actions/dataActions';
import {
    incrementOpenedForms as incrementOpenedFormsAction,
    decrementOpenedForms as decrementOpenedFormsAction,
} from '../../actions/inlineFormsActions';
import { getPossibleReferences } from '../../reducer/references/possibleValues';

const referenceSource = (resource, source, suffix) => {
    let res = `${resource}@${source}`;
    res = suffix ? `${res}@${suffix}` : res;
    return res;
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
        this.formId = referenceSource(
            props.resource,
            props.source,
            props.openedFormsCount);
        this.currentFormCount = props.openedFormsCount;
        this.recordCreatedCB = null;

        this.state = {
            showCreateDialog: false,
            inlineRecord: null,
        };
    }

    componentDidMount() {
        this.fetchReferenceAndOptions();
    }

    componentWillReceiveProps(nextProps) {
        const currentInlineRecord = this.props.inlineFormsData[this.formId];
        const createdInlineRecord = nextProps.inlineFormsData[this.formId];

        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReferenceAndOptions(nextProps);
        }

        if (currentInlineRecord !== createdInlineRecord) {
            if (this.recordCreatedCB) {
                this.recordCreatedCB(createdInlineRecord);
            }

            this.closeDialog();
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
                throw Error('The value of ReferenceArrayInput should be an array');
            }
            this.props.crudGetMany(reference, ids);
        }
        this.props.crudGetMatching(reference, referenceSource(resource, source), pagination, sort, filter);
    }

    handleCreateInline = (record, recordCreatedCB) => {
        this.props.incrementOpenedForms();
        this.recordCreatedCB = recordCreatedCB;
        this.setState({
            showCreateDialog: true,
            inlineRecord: record,
        });
    }

    handleInlineFormSubmit = (record) => {
        this.props.crudCreateInline(
            this.props.reference,
            record,
            this.formId);
    }

    handleRequestCloseDialog = () => {
        if (this.currentFormCount === this.props.openedFormsCount - 1) {
            this.closeDialog();
        }
    }

    closeDialog = () => {
        this.props.decrementOpenedForms();
        this.setState({ showCreateDialog: false });
    }

    render() {
        const { input, resource, label, source, referenceRecords, allowEmpty, matchingReferences, basePath, onChange, children, meta, inlineForm, reference } = this.props;

        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceArrayInput> only accepts a single child (like <Datagrid>)');
        }

        if (!(referenceRecords && referenceRecords.length > 0) && !allowEmpty) {
            return <Labeled
                label={typeof label === 'undefined' ? `resources.${resource}.fields.${source}` : label}
                source={source}
                resource={resource}
            />;
        }

        return (
            <div>
                {React.cloneElement(children, {
                    allowEmpty,
                    input,
                    label: typeof label === 'undefined' ? `resources.${resource}.fields.${source}` : label,
                    resource,
                    meta,
                    source,
                    choices: matchingReferences,
                    basePath,
                    onChange,
                    onCreateInline: inlineForm ? this.handleCreateInline : null,
                    setFilter: this.debouncedSetFilter,
                    setPagination: this.setPagination,
                    setSort: this.setSort,
                    translateChoice: false,
                })}

                {inlineForm && (
                    <Dialog
                        open={this.state.showCreateDialog}
                        modal={false}
                        autoScrollBodyContent
                        onRequestClose={this.handleRequestCloseDialog}
                    >
                        {React.cloneElement(inlineForm, {
                            form: this.formId,
                            resource: reference,
                            record: this.state.inlineRecord,
                            onSubmit: this.handleInlineFormSubmit,
                        })}
                    </Dialog>
                )}
            </div>
        );
    }
}

ReferenceArrayInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    crudGetMatching: PropTypes.func.isRequired,
    crudGetMany: PropTypes.func.isRequired,
    crudCreateInline: PropTypes.func.isRequired,
    incrementOpenedForms: PropTypes.func.isRequired,
    decrementOpenedForms: PropTypes.func.isRequired,
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
    inlineForm: PropTypes.element,
    openedFormsCount: PropTypes.number.isRequired,
    inlineFormsData: PropTypes.object.isRequired,
};

ReferenceArrayInput.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    matchingReferences: [],
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    referenceRecords: [],
    inlineForm: null,
};

function mapStateToProps(state, props) {
    const referenceIds = props.input.value || [];
    const data = state.admin[props.reference].data;
    const openedFormsCount = state.admin.inlineForms.openedFormsCount;
    const inlineFormsData = state.admin.inlineForms.data;

    return {
        referenceRecords: referenceIds.reduce((references, referenceId) => {
            if (data[referenceId]) {
                references.push(data[referenceId]);
            }
            return references;
        }, []),
        matchingReferences: getPossibleReferences(
            state,
            referenceSource(props.resource, props.source),
            props.reference,
            referenceIds,
        ),
        inlineFormsData,
        openedFormsCount,
    };
}

const ConnectedReferenceInput = connect(mapStateToProps, {
    crudGetMany: crudGetManyAction,
    crudGetMatching: crudGetMatchingAction,
    crudCreateInline: crudCreateInlineAction,
    incrementOpenedForms: incrementOpenedFormsAction,
    decrementOpenedForms: decrementOpenedFormsAction,
})(ReferenceArrayInput);

ConnectedReferenceInput.defaultProps = {
    addField: true,
};

export default ConnectedReferenceInput;
