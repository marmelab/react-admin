import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyAccumulate as crudGetManyAccumulateAction } from '../../actions';
import { linkToRecord } from '../../util';

/**
 * Fetch reference record, and delegate rendering to child component.
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * By default, includes a link to the <Edit> page of the related record
 * (`/users/:userId` in the previous example).
 *
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType="show">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * You can also prevent `<ReferenceField>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType={false}>
 *     <TextField source="name" />
 * </ReferenceField>
 */
export class ReferenceFieldController extends Component {
    componentDidMount() {
        this.fetchReference(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReference(nextProps);
        }
    }

    fetchReference(props) {
        const source = get(props.record, props.source);
        if (source !== null && typeof source !== 'undefined') {
            this.props.crudGetManyAccumulate(props.reference, [source]);
        }
    }

    render() {
        const {
            allowEmpty,
            basePath,
            children,
            linkType,
            record,
            reference,
            referenceRecord,
            resource,
            source,
        } = this.props;
        const rootPath = basePath.replace(resource, reference);
        const resourceLinkPath = !linkType
            ? false
            : linkToRecord(rootPath, get(record, source), linkType);
        return children({
            isLoading: !referenceRecord && !allowEmpty,
            referenceRecord,
            resourceLinkPath,
        });
    }
}

ReferenceFieldController.propTypes = {
    addLabel: PropTypes.bool,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    crudGetManyAccumulate: PropTypes.func.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    resource: PropTypes.string,
    sortBy: PropTypes.string,
    source: PropTypes.string.isRequired,
    translateChoice: PropTypes.func,
    linkType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
        .isRequired,
};

ReferenceFieldController.defaultProps = {
    allowEmpty: false,
    classes: {},
    linkType: 'edit',
    referenceRecord: null,
    record: {},
};

const mapStateToProps = (state, props) => ({
    referenceRecord:
        state.admin.resources[props.reference].data[
            get(props.record, props.source)
        ],
});

export default connect(
    mapStateToProps,
    {
        crudGetManyAccumulate: crudGetManyAccumulateAction,
    }
)(ReferenceFieldController);
