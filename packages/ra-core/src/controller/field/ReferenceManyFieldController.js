import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { crudGetManyReference as crudGetManyReferenceAction } from '../../actions';
import {
    SORT_ASC,
    SORT_DESC,
} from '../../reducer/admin/resource/list/queryReducer';
import {
    getIds,
    getReferences,
    getTotal,
    nameRelatedTo,
} from '../../reducer/admin/references/oneToMany';

/**
 * Render related records to the current one.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 *
 * @example Display all the books by the current author, only the title
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceManyField perPage={10} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceManyField sort={{ field: 'created_at', order: 'DESC' }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceManyField filter={{ is_published: true }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 */
export class ReferenceManyFieldController extends Component {
    constructor(props) {
        super(props);
        this.state = { sort: props.sort, page: 1, perPage: props.perPage };
    }

    componentDidMount() {
        this.fetchReferences();
    }

    componentWillReceiveProps(nextProps) {
        if (
          this.props.record.id !== nextProps.record.id ||
          !isEqual(this.props.filter, nextProps.filter)
        ) {
            this.fetchReferences(nextProps);
        }

        if (!isEqual(this.props.sort, nextProps.sort)) {
            this.setState({ sort: nextProps.sort }, this.fetchReferences);
        }
    }

    setSort = field => {
        const order =
            this.state.sort.field === field &&
            this.state.sort.order === SORT_ASC
                ? SORT_DESC
                : SORT_ASC;
        this.setState({ sort: { field, order } }, this.fetchReferences);
    };

    setPage = page => this.setState({ page }, this.fetchReferences);

    setPerPage = perPage => this.setState({ perPage }, this.fetchReferences);

    fetchReferences(
        { reference, record, resource, target, filter, source } = this.props
    ) {
        const { crudGetManyReference } = this.props;
        const { page, perPage, sort } = this.state;
        const relatedTo = nameRelatedTo(
            reference,
            record[source],
            resource,
            target,
            filter
        );
        crudGetManyReference(
            reference,
            target,
            record[source],
            relatedTo,
            { page, perPage },
            sort,
            filter
        );
    }

    render() {
        const {
            resource,
            reference,
            data,
            ids,
            children,
            basePath,
            total,
        } = this.props;
        const { page, perPage } = this.state;

        const referenceBasePath = basePath.replace(resource, reference);

        return children({
            currentSort: this.state.sort,
            data,
            ids,
            loadedOnce: typeof ids !== 'undefined',
            page,
            perPage,
            referenceBasePath,
            setPage: this.setPage,
            setPerPage: this.setPerPage,
            setSort: this.setSort,
            total,
        });
    }
}

ReferenceManyFieldController.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    crudGetManyReference: PropTypes.func.isRequired,
    filter: PropTypes.object,
    ids: PropTypes.array,
    perPage: PropTypes.number,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    data: PropTypes.object,
    loadedOnce: PropTypes.bool,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    sortBy: PropTypes.string,
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    total: PropTypes.number,
};

ReferenceManyFieldController.defaultProps = {
    filter: {},
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    source: 'id',
};

function mapStateToProps(state, props) {
    const relatedTo = nameRelatedTo(
        props.reference,
        props.record[props.source],
        props.resource,
        props.target,
        props.filter
    );
    return {
        data: getReferences(state, props.reference, relatedTo),
        ids: getIds(state, relatedTo),
        total: getTotal(state, relatedTo),
    };
}

export default connect(
    mapStateToProps,
    {
        crudGetManyReference: crudGetManyReferenceAction,
    }
)(ReferenceManyFieldController);
